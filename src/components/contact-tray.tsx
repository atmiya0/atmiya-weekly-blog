"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import Script from "next/script";

interface TallyWindow extends Window {
  Tally?: {
    loadEmbeds: () => void;
  };
}

declare const window: TallyWindow;

export function ContactTray() {
  const [isOpen, setIsOpen] = useState(false);
  const [tallyLoaded, setTallyLoaded] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isOpen && tallyLoaded && typeof window !== 'undefined' && window.Tally) {
      // Small delay to ensure the tray transition has started and DOM is ready
      const timer = setTimeout(() => {
        window.Tally?.loadEmbeds();
      }, 200);
      return () => clearTimeout(timer);
    }
  }, [isOpen, tallyLoaded]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Don't trigger if user is typing in an input
      if (
        event.target instanceof HTMLInputElement ||
        event.target instanceof HTMLTextAreaElement
      ) {
        return;
      }

      if (event.key.toLowerCase() === "f") {
        setIsOpen(true);
      }

      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Portal content - rendered outside of parent DOM hierarchy
  const portalContent = mounted ? createPortal(
    <>
      {/* Tally Script */}
      <Script
        src="https://tally.so/widgets/embed.js"
        onLoad={() => setTallyLoaded(true)}
        strategy="afterInteractive"
      />

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 transition-opacity"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Side Tray */}
      <div
        className={`fixed top-0 right-0 h-full w-full md:w-[650px] bg-[var(--background)] z-50 shadow-2xl transition-transform duration-300 ease-in-out ${isOpen ? "translate-x-0" : "translate-x-full"
          }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-6 border-b border-[var(--divider)]">
          <h2 className="text-[24px] leading-[1.3em] font-normal">Get in touch</h2>
          <button
            onClick={() => setIsOpen(false)}
            className="text-[14px] leading-[1.5714285714285714em] font-normal hover:text-[var(--brand)] transition-colors"
            aria-label="Close"
          >
            Close
          </button>
        </div>

        {/* Form Content */}
        <div className="h-[calc(100%-73px)] overflow-auto px-6">
          {isOpen && (
            <iframe
              src="https://tally.so/embed/2EB2OV?alignLeft=1&hideTitle=1&transparentBackground=1&dynamicHeight=1"
              loading="lazy"
              width="100%"
              height="100%"
              frameBorder="0"
              marginHeight={0}
              marginWidth={0}
              title="Contact Form"
              className="min-h-[600px]"
            />
          )}
        </div>
      </div>
    </>,
    document.body
  ) : null;

  return (
    <>
      {/* Trigger Button - this stays inline */}
      <button
        onClick={() => setIsOpen(true)}
        className="link-underline cursor-pointer bg-transparent border-none p-0 text-inherit font-inherit"
      >
        reach out via form
      </button>

      {/* Portal renders overlay and tray at document.body level */}
      {portalContent}
    </>
  );
}
