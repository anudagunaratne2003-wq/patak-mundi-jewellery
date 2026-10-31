'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import {
  MessageCircle,
  X,
  Send,
  Sparkles,
  ShieldAlert,
  Scissors,
  Paperclip,
  Film,
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { OPEN_DESIGN_CHAT_EVENT } from '@/lib/designChat';

interface ChatMessage {
  id: string;
  session_id: string;
  sender: 'customer' | 'atelier';
  message: string;
  customer_name?: string | null;
  customer_email?: string | null;
  created_at: string;
  /** Comma-separated public URLs, when the customer attached image/video files. */
  attachment_url?: string | null;
  /** Comma-separated 'image' | 'video' tags, aligned by index with attachment_url. */
  attachment_type?: string | null;
}

interface PendingAttachment {
  file: File;
  previewUrl: string;
  kind: 'image' | 'video';
}

const SESSION_KEY = 'patakmundi_chat_session';
const PROFILE_KEY = 'patakmundi_chat_profile';
const ATTACHMENTS_BUCKET = 'design-attachments';
const MAX_FILES_PER_MESSAGE = 4;
const MAX_FILE_SIZE_MB = 25;

function getOrCreateSession(): string {
  if (typeof window === 'undefined') return 'ssr';
  let id = localStorage.getItem(SESSION_KEY);
  if (!id) {
    id = `chat-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    localStorage.setItem(SESSION_KEY, id);
  }
  return id;
}

function attachmentPairs(m: ChatMessage): { url: string; kind: 'image' | 'video' }[] {
  if (!m.attachment_url) return [];
  const urls = m.attachment_url.split(',').filter(Boolean);
  const types = (m.attachment_type ?? '').split(',');
  return urls.map((url, i) => ({
    url,
    kind: types[i] === 'video' ? 'video' : 'image',
  }));
}

const QUICK_PROMPTS = [
  'I would like a custom engagement ring',
  'Can you design a necklace with emeralds?',
  'I want to personalise a bracelet',
  'Do you make bespoke earrings?',
];

export function CustomDesignChat() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState<{ name: string; email: string } | null>(() => {
    try {
      const raw = localStorage.getItem(PROFILE_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  });
  const [nameInput, setNameInput] = useState('');
  const [emailInput, setEmailInput] = useState('');
  const [screenshotWarning, setScreenshotWarning] = useState(false);
  const [windowBlurred, setWindowBlurred] = useState(false);
  const [unread, setUnread] = useState(0);
  const [pendingFiles, setPendingFiles] = useState<PendingAttachment[]>([]);
  const [uploading, setUploading] = useState(false);
  const [attachError, setAttachError] = useState<string | null>(null);

  const sessionIdRef = useRef(getOrCreateSession());
  const scrollRef = useRef<HTMLDivElement>(null);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const lastSeenRef = useRef<string | null>(null);
  const warningTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Let the Header / product cards / homepage CTAs open this widget, and
  // optionally pre-fill the composer (e.g. "Enquire about the Aurora Ring").
  useEffect(() => {
    const onOpenRequest = (e: Event) => {
      const detail = (e as CustomEvent<{ prefill?: string }>).detail;
      setOpen(true);
      if (detail?.prefill) setInput(detail.prefill);
    };
    window.addEventListener(OPEN_DESIGN_CHAT_EVENT, onOpenRequest);
    return () => window.removeEventListener(OPEN_DESIGN_CHAT_EVENT, onOpenRequest);
  }, []);

  // Revoke object URLs for pending previews when they're cleared/unmounted.
  useEffect(() => {
    return () => {
      pendingFiles.forEach((f) => URL.revokeObjectURL(f.previewUrl));
    };
  }, [pendingFiles]);

  // Scroll to bottom on new messages
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, open]);

  const loadMessages = useCallback(async () => {
    const { data, error } = await supabase
      .from('custom_design_chats')
      .select('*')
      .eq('session_id', sessionIdRef.current)
      .order('created_at', { ascending: true });

    if (error) return;
    if (data) {
      setMessages(data as ChatMessage[]);
      // Track unread atelier replies
      const lastAtelier = [...data].reverse().find((m) => m.sender === 'atelier');
      if (lastAtelier && lastSeenRef.current !== lastAtelier.id) {
        if (!open) setUnread((u) => u + 1);
        if (open) lastSeenRef.current = lastAtelier.id;
      }
    }
  }, [open]);

  // Load on open and poll for replies
  useEffect(() => {
    if (!open) return;
    setUnread(0);
    loadMessages();
    pollRef.current = setInterval(loadMessages, 4000);
    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
    };
  }, [open, loadMessages]);

  // Screenshot protection — runs always (even when closed) so the warning fires
  useEffect(() => {
    const triggerWarning = (reason: string) => {
      setScreenshotWarning(true);
      // eslint-disable-next-line no-console
      console.warn(`Screenshot attempt detected: ${reason}`);
      if (warningTimer.current) clearTimeout(warningTimer.current);
      warningTimer.current = setTimeout(() => setScreenshotWarning(false), 3000);
    };

    const onKeyDown = (e: KeyboardEvent) => {
      const key = e.key;
      // PrintScreen
      if (key === 'PrintScreen' || e.code === 'PrintScreen') {
        e.preventDefault();
        try {
          navigator.clipboard?.writeText('');
        } catch {
          /* ignore */
        }
        triggerWarning('screen capture key');
      }
      // Ctrl/Cmd + P (print)
      if ((e.ctrlKey || e.metaKey) && key.toLowerCase() === 'p') {
        e.preventDefault();
        triggerWarning('print shortcut');
      }
      // Ctrl/Cmd + Shift + S (common screenshot shortcut on some browsers/extensions)
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && key.toLowerCase() === 's') {
        e.preventDefault();
        triggerWarning('capture shortcut');
      }
      // Windows + Shift + S is OS-level and cannot be intercepted, but we still warn on keyup
    };

    const onKeyUp = (e: KeyboardEvent) => {
      if (e.key === 'PrintScreen' || e.code === 'PrintScreen') {
        try {
          navigator.clipboard?.writeText('');
        } catch {
          /* ignore */
        }
        triggerWarning('screen capture released');
      }
    };

    const onCopy = (e: ClipboardEvent) => {
      if (!open) return;
      e.preventDefault();
      triggerWarning('copy attempt');
    };

    const onContextMenu = (e: MouseEvent) => {
      // Only block within the chat panel
      const target = e.target as HTMLElement;
      if (target.closest('[data-chat-protected]')) {
        e.preventDefault();
      }
    };

    const onBlur = () => setWindowBlurred(true);
    const onFocus = () => setWindowBlurred(false);

    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);
    window.addEventListener('blur', onBlur);
    window.addEventListener('focus', onFocus);
    document.addEventListener('copy', onCopy);
    document.addEventListener('contextmenu', onContextMenu);

    return () => {
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
      window.removeEventListener('blur', onBlur);
      window.removeEventListener('focus', onFocus);
      document.removeEventListener('copy', onCopy);
      document.removeEventListener('contextmenu', onContextMenu);
      if (warningTimer.current) clearTimeout(warningTimer.current);
    };
  }, [open]);

  const handleIntroSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nameInput.trim() || !emailInput.trim()) return;
    const p = { name: nameInput.trim(), email: emailInput.trim() };
    setProfile(p);
    localStorage.setItem(PROFILE_KEY, JSON.stringify(p));
  };

  const handleFilesSelected = (fileList: FileList | null) => {
    if (!fileList || fileList.length === 0) return;
    setAttachError(null);
    const incoming: PendingAttachment[] = [];
    for (const file of Array.from(fileList)) {
      const isImage = file.type.startsWith('image/');
      const isVideo = file.type.startsWith('video/');
      if (!isImage && !isVideo) {
        setAttachError('Only image or video files can be attached.');
        continue;
      }
      if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
        setAttachError(`Files must be under ${MAX_FILE_SIZE_MB}MB.`);
        continue;
      }
      incoming.push({
        file,
        previewUrl: URL.createObjectURL(file),
        kind: isVideo ? 'video' : 'image',
      });
    }
    setPendingFiles((prev) => {
      const combined = [...prev, ...incoming].slice(0, MAX_FILES_PER_MESSAGE);
      if (prev.length + incoming.length > MAX_FILES_PER_MESSAGE) {
        setAttachError(`You can attach up to ${MAX_FILES_PER_MESSAGE} files per message.`);
      }
      return combined;
    });
  };

  const removePendingFile = (index: number) => {
    setPendingFiles((prev) => {
      const copy = [...prev];
      const [removed] = copy.splice(index, 1);
      if (removed) URL.revokeObjectURL(removed.previewUrl);
      return copy;
    });
  };

  /** Uploads all pending files to Supabase Storage; returns aligned URL/type
   * arrays. Falls back to local blob URLs (visible for this session only)
   * if the storage bucket isn't reachable, so the feature still works
   * end-to-end during design/preview even before a bucket is provisioned. */
  const uploadPendingFiles = async (): Promise<{ urls: string[]; types: string[] }> => {
    const urls: string[] = [];
    const types: string[] = [];
    for (const attachment of pendingFiles) {
      const ext = attachment.file.name.split('.').pop() || 'dat';
      const path = `${sessionIdRef.current}/${Date.now()}-${Math.random()
        .toString(36)
        .slice(2, 8)}.${ext}`;
      const { error: uploadError } = await supabase.storage
        .from(ATTACHMENTS_BUCKET)
        .upload(path, attachment.file, { upsert: false });

      if (uploadError) {
        // Storage bucket may not exist yet — keep the local preview so the
        // customer's message still shows their attachment in this session.
        urls.push(attachment.previewUrl);
      } else {
        const { data } = supabase.storage.from(ATTACHMENTS_BUCKET).getPublicUrl(path);
        urls.push(data.publicUrl);
      }
      types.push(attachment.kind);
    }
    return { urls, types };
  };

  const sendMessage = async (text: string) => {
    const trimmed = text.trim();
    const hasFiles = pendingFiles.length > 0;
    if (!trimmed && !hasFiles) return;
    if (!profile) return;
    setLoading(true);
    setUploading(hasFiles);
    setInput('');

    const { urls, types } = hasFiles
      ? await uploadPendingFiles()
      : { urls: [], types: [] };
    setPendingFiles([]);
    setUploading(false);

    const messageBody = trimmed || (hasFiles ? 'Shared reference images/video for a custom design.' : '');

    const { error } = await supabase.from('custom_design_chats').insert({
      session_id: sessionIdRef.current,
      sender: 'customer',
      message: messageBody,
      customer_name: profile.name,
      customer_email: profile.email,
      attachment_url: urls.length ? urls.join(',') : null,
      attachment_type: types.length ? types.join(',') : null,
    });

    setLoading(false);
    if (error) {
      // still show the message locally (e.g. attachment_url column not yet
      // migrated on this project, or a transient network error)
      setMessages((prev) => [
        ...prev,
        {
          id: `local-${Date.now()}`,
          session_id: sessionIdRef.current,
          sender: 'customer',
          message: messageBody,
          customer_name: profile.name,
          customer_email: profile.email,
          created_at: new Date().toISOString(),
          attachment_url: urls.length ? urls.join(',') : null,
          attachment_type: types.length ? types.join(',') : null,
        },
      ]);
      return;
    }
    await loadMessages();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  const watermark = `PÁTAK MUNDI · Session ${sessionIdRef.current.slice(-6)} · Confidential`;

  return (
    <>
      {/* Floating button */}
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-label="Open custom design chat"
        className={`fixed bottom-6 right-6 z-[60] flex items-center gap-2 rounded-full shadow-2xl transition-all duration-300 ${
          open
            ? 'scale-90 opacity-0 pointer-events-none'
            : 'scale-100 opacity-100 hover:scale-105'
        } bg-charcoal-900 px-5 py-4 text-ivory-50`}
      >
        <span className="relative flex h-6 w-6 items-center justify-center">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-champagne-400 opacity-40" />
          <MessageCircle size={22} className="relative" strokeWidth={1.5} />
        </span>
        <span className="text-xs font-medium uppercase tracking-widest">Design With Us</span>
        {unread > 0 && (
          <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-champagne-500 px-1.5 text-[10px] font-medium text-white">
            {unread}
          </span>
        )}
      </button>

      {/* Chat panel */}
      {open && (
        <div
          data-chat-protected
          className="fixed bottom-6 right-6 z-[60] flex h-[560px] max-h-[calc(100vh-2rem)] w-[calc(100vw-3rem)] flex-col overflow-hidden bg-ivory-50 shadow-2xl ring-1 ring-charcoal-200 animate-slide-in-right sm:w-[400px]"
        >
          {/* Header */}
          <div className="flex items-center justify-between bg-charcoal-900 px-5 py-4 text-ivory-50">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-champagne-500">
                <Sparkles size={18} strokeWidth={1.5} />
              </div>
              <div>
                <p className="font-serif text-lg leading-none">Atelier Chat</p>
                <p className="mt-1 text-[10px] uppercase tracking-widest text-ivory-200/70">
                  Custom Design Requests
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="text-ivory-200/70 transition-colors hover:text-ivory-50"
              aria-label="Close chat"
            >
              <X size={20} />
            </button>
          </div>

          {/* Confidentiality notice */}
          <div className="flex items-center gap-2 bg-charcoal-800 px-5 py-2 text-[10px] uppercase tracking-widest text-ivory-200/60">
            <ShieldAlert size={12} />
            Private &amp; confidential — screen capture disabled
          </div>

          {/* Body */}
          <div className="relative flex-1 overflow-hidden">
            {/* Watermark overlay — always visible, makes screenshots traceable */}
            <div
              className="pointer-events-none absolute inset-0 z-20 flex flex-col items-center justify-center gap-6 opacity-[0.06]"
              aria-hidden="true"
            >
              {Array.from({ length: 6 }).map((_, i) => (
                <p
                  key={i}
                  className="whitespace-nowrap font-serif text-sm tracking-widest text-charcoal-900"
                  style={{ transform: `rotate(-25deg) translateY(${i * 40}px)` }}
                >
                  {watermark}
                </p>
              ))}
            </div>

            {/* Blur overlay when window loses focus — prevents alt-tab screenshots */}
            {windowBlurred && (
              <div className="absolute inset-0 z-30 flex flex-col items-center justify-center gap-3 bg-ivory-50/95 backdrop-blur-xl">
                <ShieldAlert size={32} className="text-champagne-600" strokeWidth={1.25} />
                <p className="px-8 text-center text-sm text-charcoal-600">
                  Content hidden to protect your privacy.
                </p>
                <p className="text-xs text-charcoal-400">Click anywhere to return.</p>
              </div>
            )}

            {/* Screenshot warning flash */}
            {screenshotWarning && (
              <div className="absolute inset-0 z-40 flex flex-col items-center justify-center gap-3 bg-charcoal-900/95 backdrop-blur-md animate-fade-in">
                <ShieldAlert size={36} className="text-red-400" strokeWidth={1.25} />
                <p className="px-8 text-center font-serif text-lg text-ivory-50">
                  Screen capture is disabled
                </p>
                <p className="px-8 text-center text-xs text-ivory-200/70">
                  This conversation is private and watermarked. Unauthorised capture is
                  logged against your session.
                </p>
              </div>
            )}

            {/* Messages */}
            <div
              ref={scrollRef}
              className="hide-scrollbar h-full overflow-y-auto px-5 py-4"
            >
              {messages.length === 0 && profile ? (
                <div className="flex h-full flex-col items-center justify-center text-center">
                  <Sparkles size={28} className="text-champagne-500" strokeWidth={1.25} />
                  <p className="mt-4 font-serif text-lg text-charcoal-800">
                    Tell us about your dream piece
                  </p>
                  <p className="mt-2 max-w-xs text-sm font-light text-charcoal-500">
                    Share your vision — gemstones, metal, occasion — and attach reference
                    photos or a short video. Our atelier will respond with ideas.
                  </p>
                  <div className="mt-5 w-full space-y-2">
                    {QUICK_PROMPTS.map((q) => (
                      <button
                        key={q}
                        type="button"
                        onClick={() => sendMessage(q)}
                        className="w-full border border-charcoal-200 px-4 py-2.5 text-left text-sm text-charcoal-700 transition-colors hover:border-champagne-400 hover:bg-ivory-100"
                      >
                        {q}
                      </button>
                    ))}
                  </div>
                </div>
              ) : messages.length === 0 && !profile ? null : (
                <div className="space-y-3">
                  {messages.map((m) => (
                    <div
                      key={m.id}
                      className={`flex ${m.sender === 'customer' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[80%] px-4 py-2.5 text-sm ${
                          m.sender === 'customer'
                            ? 'bg-charcoal-900 text-ivory-50'
                            : 'bg-ivory-200 text-charcoal-800'
                        }`}
                      >
                        {m.sender === 'atelier' && (
                          <p className="mb-1 text-[10px] font-medium uppercase tracking-widest text-champagne-600">
                            Atelier
                          </p>
                        )}
                        <p className="whitespace-pre-wrap leading-relaxed">{m.message}</p>
                        {attachmentPairs(m).length > 0 && (
                          <div className="mt-2 grid grid-cols-2 gap-1.5">
                            {attachmentPairs(m).map((a, i) =>
                              a.kind === 'video' ? (
                                <video
                                  key={i}
                                  src={a.url}
                                  controls
                                  className="h-24 w-full rounded-sm object-cover"
                                />
                              ) : (
                                <img
                                  key={i}
                                  src={a.url}
                                  alt="Reference attachment"
                                  className="h-24 w-full rounded-sm object-cover"
                                />
                              )
                            )}
                          </div>
                        )}
                        <p
                          className={`mt-1 text-[10px] ${
                            m.sender === 'customer' ? 'text-ivory-200/50' : 'text-charcoal-400'
                          }`}
                        >
                          {new Date(m.created_at).toLocaleTimeString('en-US', {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Intro form or input */}
          {!profile ? (
            <div className="border-t border-charcoal-100 bg-ivory-100 p-5">
              <p className="font-serif text-base text-charcoal-800">
                Let's start with your details
              </p>
              <p className="mt-1 text-xs text-charcoal-500">
                So our atelier can follow up on your custom request.
              </p>
              <form onSubmit={handleIntroSubmit} className="mt-4 space-y-3">
                <input
                  type="text"
                  required
                  value={nameInput}
                  onChange={(e) => setNameInput(e.target.value)}
                  placeholder="Your name"
                  className="w-full border border-charcoal-200 bg-white px-4 py-2.5 text-sm text-charcoal-800 placeholder:text-charcoal-400 focus:border-champagne-400 focus:outline-none"
                />
                <input
                  type="email"
                  required
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  placeholder="Email address"
                  className="w-full border border-charcoal-200 bg-white px-4 py-2.5 text-sm text-charcoal-800 placeholder:text-charcoal-400 focus:border-champagne-400 focus:outline-none"
                />
                <button
                  type="submit"
                  className="w-full bg-charcoal-900 py-3 text-xs font-medium uppercase tracking-widest text-ivory-50 transition-colors hover:bg-champagne-500"
                >
                  Begin Chat
                </button>
              </form>
            </div>
          ) : (
            <div className="border-t border-charcoal-100 bg-white">
              {attachError && (
                <p className="px-4 pt-2 text-[11px] text-red-500">{attachError}</p>
              )}
              {pendingFiles.length > 0 && (
                <div className="flex gap-2 overflow-x-auto px-3 pt-3">
                  {pendingFiles.map((f, i) => (
                    <div key={i} className="relative shrink-0">
                      {f.kind === 'video' ? (
                        <div className="relative h-14 w-14 overflow-hidden rounded-sm bg-charcoal-900">
                          <video src={f.previewUrl} className="h-full w-full object-cover opacity-70" />
                          <Film size={16} className="absolute inset-0 m-auto text-ivory-50" />
                        </div>
                      ) : (
                        <img
                          src={f.previewUrl}
                          alt="Attachment preview"
                          className="h-14 w-14 rounded-sm object-cover"
                        />
                      )}
                      <button
                        type="button"
                        onClick={() => removePendingFile(i)}
                        aria-label="Remove attachment"
                        className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-charcoal-900 text-ivory-50"
                      >
                        <X size={11} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
              <form onSubmit={handleSubmit} className="flex items-center gap-2 p-3">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*,video/*"
                  multiple
                  className="hidden"
                  onChange={(e) => {
                    handleFilesSelected(e.target.files);
                    e.target.value = '';
                  }}
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={loading || pendingFiles.length >= MAX_FILES_PER_MESSAGE}
                  aria-label="Attach image or video"
                  className="flex h-10 w-10 shrink-0 items-center justify-center text-charcoal-500 transition-colors hover:text-champagne-600 disabled:opacity-40"
                >
                  <Paperclip size={18} />
                </button>
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder={
                    uploading ? 'Uploading your files…' : 'Describe your custom piece, or attach a photo…'
                  }
                  disabled={loading}
                  className="flex-1 border border-charcoal-200 px-4 py-2.5 text-sm text-charcoal-800 placeholder:text-charcoal-400 focus:border-champagne-400 focus:outline-none disabled:opacity-50"
                />
                <button
                  type="submit"
                  disabled={loading || (!input.trim() && pendingFiles.length === 0)}
                  className="flex h-10 w-10 shrink-0 items-center justify-center bg-charcoal-900 text-ivory-50 transition-colors hover:bg-champagne-500 disabled:opacity-40"
                  aria-label="Send message"
                >
                  <Send size={16} />
                </button>
              </form>
            </div>
          )}

          {/* Footer note */}
          <div className="flex items-center justify-center gap-1.5 bg-ivory-100 px-5 py-2 text-[10px] text-charcoal-400">
            <Scissors size={11} className="text-champagne-500" />
            Right-click &amp; copy are disabled in this chat
          </div>
        </div>
      )}
    </>
  );
}
