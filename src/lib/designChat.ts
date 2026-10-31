'use client';

/**
 * Lightweight way for any component (Header, ProductCard, homepage CTAs...)
 * to open the CustomDesignChat widget without prop-drilling or context.
 * CustomDesignChat listens for this event on mount.
 */
export const OPEN_DESIGN_CHAT_EVENT = 'pm:open-design-chat';

export function openDesignChat(prefill?: string) {
  if (typeof window === 'undefined') return;
  window.dispatchEvent(
    new CustomEvent(OPEN_DESIGN_CHAT_EVENT, { detail: { prefill } })
  );
}
