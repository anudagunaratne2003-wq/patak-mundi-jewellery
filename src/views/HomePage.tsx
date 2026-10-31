"use client";

import { useState } from "react";
import {
  ArrowRight,
  Handshake,
  Gem,
  Sparkles,
  Compass,
  MessageCircle,
  PenTool,
  Hammer,
} from "lucide-react";
import { useRouter } from "@/router/Router";
import { CATEGORIES } from "@/data/products";
import { ASTROLOGICAL_SHIELDS } from "@/data/astrology";
import { ConceptsShowcase } from "@/components/ConceptsShowcase";
import { TestimonialCarousel } from "@/components/TestimonialCarousel";
import { openDesignChat } from "@/lib/designChat";
// import { LandingGate } from "@/components/LandingGate";
import { LandingGate3D } from "@/components/LandingGate3D";
import { HeroSlider } from "@/components/HeroSlider";

export function HomePage() {
  const { navigate } = useRouter();
  const [gateClosed, setGateClosed] = useState(false);

  return (
    <>
      {/* Entry animation. Mounts on top of the content below, shows once
          per session, then unmounts itself — see IntroPage.tsx. onEnter
          flips gateClosed so the hero slider below only loads its other
          photos once the 3D gate is done using the bandwidth. */}
      {/* <LandingGate /> */}
      <LandingGate3D onEnter={() => setGateClosed(true)} />

      <div className="animate-fade-in">
        {/* Hero */}
        <section className="relative h-[88vh] min-h-[600px] w-full overflow-hidden">
          <HeroSlider
            active={gateClosed}
            className="absolute inset-0 h-full w-full overflow-hidden"
          />
          <div className="absolute inset-0 bg-charcoal-900/50 md:bg-gradient-to-r md:from-charcoal-900/85 md:via-charcoal-900/45 md:to-transparent" />
          <div className="relative z-10 flex h-full items-center">
            <div className="container-lux w-full">
              <div className="max-w-xl animate-fade-up">
                <p className="text-sm uppercase tracking-ultra text-ivory-200/90">
                  Bespoke Jewellery Atelier
                </p>
                <h1 className="mt-5 font-serif text-5xl leading-[1.05] text-ivory-50 sm:text-6xl lg:text-7xl">
                  Designed Around You,
                  <br />
                  <span className="italic text-champagne-300">
                    Made Only Once.
                  </span>
                </h1>
                <p className="mt-6 max-w-md text-base font-light leading-relaxed text-ivory-100/90">
                  We don't sell jewellery off the shelf. Every Pátak Mundi piece
                  is designed one-on-one with the person who will wear it — then
                  handcrafted in our atelier, just for them.
                </p>
                <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:gap-4">
                  <button
                    type="button"
                    onClick={() => openDesignChat()}
                    className="group flex items-center justify-center gap-2 bg-ivory-50 px-8 py-4 text-xs font-medium uppercase tracking-widest text-charcoal-900 transition-all hover:bg-champagne-300"
                  >
                    <Sparkles size={15} />
                    Start Your Design
                  </button>
                  <button
                    type="button"
                    onClick={() => navigate({ name: "portfolio" })}
                    className="group flex items-center justify-center gap-2 border border-ivory-50/50 px-8 py-4 text-xs font-medium uppercase tracking-widest text-ivory-50 transition-all hover:border-ivory-50 hover:bg-ivory-50/10"
                  >
                    See Our Work
                    <ArrowRight
                      size={16}
                      className="transition-transform group-hover:translate-x-1"
                    />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Trust badges */}
        <section className="border-b border-charcoal-100 bg-ivory-100">
          <div className="container-lux grid grid-cols-2 gap-6 py-8 md:grid-cols-4">
            {[
              {
                icon: Handshake,
                title: "Designed With You",
                sub: "One-on-one design consultations",
              },
              {
                icon: Sparkles,
                title: "Master Craftsmanship",
                sub: "Hand-finished in our atelier",
              },
              {
                icon: Gem,
                title: "Ethically Sourced",
                sub: "Conflict-free stones",
              },
              {
                icon: Compass,
                title: "Made to Order",
                sub: "Every piece begins from a sketch",
              },
            ].map(({ icon: Icon, title, sub }) => (
              <div key={title} className="flex items-center gap-3">
                <Icon
                  size={28}
                  className="shrink-0 text-champagne-500"
                  strokeWidth={1.25}
                />
                <div>
                  <p className="text-sm font-medium text-charcoal-800">
                    {title}
                  </p>
                  <p className="text-xs text-charcoal-400">{sub}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* How a commission works */}
        <section className="container-lux py-20 lg:py-28">
          <div className="text-center">
            <p className="text-xs uppercase tracking-ultra text-champagne-600">
              The Bespoke Process
            </p>
            <h2 className="mt-3 font-serif text-4xl text-charcoal-900 lg:text-5xl">
              How a Commission Works
            </h2>
            <p className="mx-auto mt-4 max-w-lg text-sm font-light text-charcoal-500">
              No catalogue, no checkout. Just you, our designer, and a piece
              that exists nowhere else.
            </p>
          </div>
          <ol className="mt-14 grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                icon: MessageCircle,
                title: "Tell Us Your Idea",
                body: "Open a chat with our designer. Share a sketch, a photo, an heirloom stone — or just a feeling.",
              },
              {
                icon: PenTool,
                title: "Sketch & Refine",
                body: "We send hand sketches and renders, refining every curve with you until it feels right.",
              },
              {
                icon: Gem,
                title: "Choose Your Stones",
                body: "Select from hand-picked, ethically sourced gemstones matched to your design.",
              },
              {
                icon: Hammer,
                title: "Handcrafted for You",
                body: "Our master craftsmen bring it to life, by hand, as a true one-of-one piece.",
              },
            ].map(({ icon: Icon, title, body }, i) => (
              <li
                key={title}
                className="relative text-center animate-fade-up"
                style={{ animationDelay: `${i * 90}ms` }}
              >
                <span className="font-serif text-5xl text-champagne-200">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div className="mx-auto -mt-3 flex h-14 w-14 items-center justify-center rounded-full bg-ivory-100">
                  <Icon
                    size={24}
                    className="text-champagne-500"
                    strokeWidth={1.25}
                  />
                </div>
                <h3 className="mt-5 font-serif text-xl text-charcoal-900">
                  {title}
                </h3>
                <p className="mx-auto mt-2 max-w-xs text-sm font-light leading-relaxed text-charcoal-500">
                  {body}
                </p>
              </li>
            ))}
          </ol>
          <div className="mt-12 flex justify-center">
            <button
              type="button"
              onClick={() => openDesignChat()}
              className="flex items-center gap-2 bg-charcoal-900 px-8 py-4 text-xs font-medium uppercase tracking-widest text-ivory-50 transition-colors hover:bg-champagne-500"
            >
              <Sparkles size={15} /> Begin Step One
            </button>
          </div>
        </section>

        {/* Explore by Category */}
        <section className="border-t border-charcoal-100 container-lux py-20 lg:py-28">
          <div className="text-center">
            <p className="text-xs uppercase tracking-ultra text-champagne-600">
              The Portfolio
            </p>
            <h2 className="mt-3 font-serif text-4xl text-charcoal-900 lg:text-5xl">
              Pieces We've Designed
            </h2>
            <p className="mx-auto mt-4 max-w-lg text-sm font-light text-charcoal-500">
              A look at past commissions — each one made for a single client.
              Find a style you love, and we'll design yours from there.
            </p>
          </div>
          <div className="mt-14 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
            {CATEGORIES.map((cat, i) => (
              <button
                key={cat.name}
                type="button"
                onClick={() =>
                  navigate({ name: "portfolio", params: { category: cat.name } })
                }
                className="group relative aspect-[3/4] overflow-hidden bg-ivory-200 animate-fade-up"
                style={{ animationDelay: `${i * 80}ms` }}
              >
                <img
                  src={cat.image}
                  alt={cat.name}
                  loading="lazy"
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-charcoal-900/80 via-charcoal-900/10 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-5 text-center">
                  <h3 className="font-serif text-xl text-ivory-50">
                    {cat.name}
                  </h3>
                  <p className="mt-1 text-[11px] uppercase tracking-widest text-ivory-200/80">
                    {cat.tagline}
                  </p>
                  <span className="mt-3 inline-block text-[11px] uppercase tracking-widest text-champagne-300 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                    See Our Work →
                  </span>
                </div>
              </button>
            ))}
          </div>
        </section>

        {/* Discover the Concepts — synced slideshow */}
        <div className="bg-ivory-100">
          <ConceptsShowcase />
        </div>


        {/* Astrological Shields */}
        <section className="bg-charcoal-900 py-20 lg:py-28">
          <div className="container-lux">
            <div className="text-center">
              <p className="text-xs uppercase tracking-ultra text-champagne-400">
                Nawagraha Collection
              </p>
              <h2 className="mt-3 font-serif text-4xl text-ivory-50 lg:text-5xl">
                Astrological Shields
              </h2>
              <p className="mx-auto mt-4 max-w-lg text-sm font-light text-ivory-200/70">
                Four pieces, each dedicated to a planetary influence — worn or
                gifted to bring balance, strength, or grace.
              </p>
            </div>
            <div className="mt-14 grid grid-cols-2 gap-4 lg:grid-cols-4">
              {ASTROLOGICAL_SHIELDS.map((shield, i) => (
                <div
                  key={shield.id}
                  className="group relative aspect-[3/4] overflow-hidden bg-charcoal-800 animate-fade-up"
                  style={{ animationDelay: `${i * 90}ms` }}
                >
                  <img
                    src={shield.image}
                    alt={shield.name}
                    loading="lazy"
                    className="absolute inset-0 h-full w-full object-cover opacity-80 transition-transform duration-700 ease-out group-hover:scale-110 group-hover:opacity-100"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-charcoal-900/90 via-charcoal-900/20 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-4 text-center">
                    <h3 className="font-serif text-lg uppercase tracking-widest text-ivory-50">
                      {shield.name}
                    </h3>
                    <p className="mt-1 text-[10px] uppercase tracking-widest text-champagne-300">
                      {shield.planet}
                    </p>
                    <p className="mt-3 hidden text-[11px] font-light leading-relaxed text-ivory-200/70 group-hover:block">
                      {shield.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* About / heritage story */}
        <section className="relative overflow-hidden bg-charcoal-900 py-20 lg:py-28">
          <div className="container-lux grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
            <div className="relative aspect-[4/5] overflow-hidden">
              <img
                src="/images/concepts/the-hive-side.jpg"
                alt="Craftsman finishing a piece of jewellery"
                loading="lazy"
                className="absolute inset-0 h-full w-full object-cover"
              />
            </div>
            <div>
              <p className="text-xs uppercase tracking-ultra text-champagne-400">
                Our Atelier
              </p>
              <h2 className="mt-3 font-serif text-4xl text-ivory-50 lg:text-5xl">
                Crafted, Not Manufactured.
              </h2>
              <p className="mt-6 text-base font-light leading-relaxed text-ivory-200/80">
                Pátak Mundi has spent over two decades designing
                heirloom-quality pieces from a small atelier. Every design
                begins with a conversation and a sketch, and ends in the hands
                of a master craftsman who devotes days — sometimes weeks — to a
                single piece.
              </p>
              <p className="mt-4 text-base font-light leading-relaxed text-ivory-200/80">
                We source only ethically mined gemstones and the finest precious
                metals, because true luxury leaves nothing to chance.
              </p>
              <button
                type="button"
                onClick={() => navigate({ name: "about" })}
                className="group mt-8 flex items-center gap-2 border border-ivory-50/40 px-8 py-4 text-xs font-medium uppercase tracking-widest text-ivory-50 transition-all hover:border-champagne-400 hover:bg-champagne-500 hover:text-charcoal-900"
              >
                Discover Our Story
                <ArrowRight
                  size={16}
                  className="transition-transform group-hover:translate-x-1"
                />
              </button>
            </div>
          </div>
        </section>

        {/* Heritage stat banner */}
        <section className="relative h-[420px] overflow-hidden">
          <img
            src="/images/brand/heritage-banner.jpg"
            alt="Close detail of hand-finished jewellery"
            loading="lazy"
            className="absolute inset-0 h-full w-full object-cover grayscale"
          />
          <div className="absolute inset-0 bg-charcoal-900/70" />
          <div className="relative z-10 flex h-full items-center justify-center text-center">
            <div className="max-w-2xl px-6">
              <p className="text-sm font-light text-ivory-100/80">
                Every commission is drawn by hand, shaped with our clients, and
                finished at the bench by craftsmen who have spent a lifetime
                perfecting a single art.
              </p>
              <p className="mt-6 font-serif text-7xl text-champagne-300 sm:text-8xl">
                25<span className="text-4xl align-top sm:text-5xl">+</span>
              </p>
              <p className="mt-2 text-xs uppercase tracking-ultra text-ivory-200/70">
                Years of Atelier Craftsmanship
              </p>
            </div>
          </div>
        </section>


        {/* Testimonials */}
        <section className="bg-ivory-100 py-20 lg:py-28">
          <div className="container-lux">
            <div className="text-center">
              <p className="text-xs uppercase tracking-ultra text-champagne-600">
                Words of Heart
              </p>
              <h2 className="mt-3 font-serif text-4xl text-charcoal-900 lg:text-5xl">
                Our Client Perceptions
              </h2>
            </div>
            <TestimonialCarousel />
          </div>
        </section>

        {/* Contact / start a design */}
        <section className="container-lux py-20 lg:py-24">
          <div className="border border-charcoal-100 bg-ivory-100 px-8 py-16 text-center lg:px-16">
            <Gem
              size={32}
              className="mx-auto text-champagne-500"
              strokeWidth={1}
            />
            <h2 className="mt-5 font-serif text-3xl text-charcoal-900 sm:text-4xl">
              Have a Design in Mind?
            </h2>
            <p className="mx-auto mt-4 max-w-md text-sm font-light text-charcoal-500">
              Every Pátak Mundi piece is made to order, for one person only.
              Tell us your vision, attach a photo or a sketch, and let's design
              it together.
            </p>
            <div className="mx-auto mt-8 flex max-w-md flex-col gap-3 sm:flex-row sm:justify-center">
              <button
                type="button"
                onClick={() => openDesignChat()}
                className="flex items-center justify-center gap-2 bg-charcoal-900 px-8 py-4 text-xs font-medium uppercase tracking-widest text-ivory-50 transition-colors hover:bg-champagne-500"
              >
                <Sparkles size={15} /> Start a Design Chat
              </button>
              <button
                type="button"
                onClick={() => navigate({ name: "contact" })}
                className="flex items-center justify-center gap-2 border border-charcoal-300 px-8 py-4 text-xs font-medium uppercase tracking-widest text-charcoal-800 transition-colors hover:border-charcoal-900"
              >
                Contact the Atelier
              </button>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
