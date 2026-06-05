"use client";

import { useState } from "react";
import { Check, ShareNetwork } from "@phosphor-icons/react/dist/ssr";

export function ShareCVButton() {
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    const url = window.location.href;
    const shareData = {
      title: "Lukas Ahlse — CV",
      text: "Lukas Ahlse's CV — Product Designer based in Malmö",
      url,
    };

    // Native share sheet (mobile + some desktops). User cancellation throws
    // an AbortError — silently swallowed.
    if (typeof navigator !== "undefined" && "share" in navigator) {
      try {
        await navigator.share(shareData);
        return;
      } catch {
        // fall through to clipboard
      }
    }

    // Fallback: copy to clipboard with brief "Link copied" feedback.
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Last resort: silent fail. The page URL is visible in the browser bar.
    }
  };

  return (
    <button type="button" onClick={handleShare} className="cv-download-btn">
      {copied ? (
        <>
          <Check weight="bold" className="cv-download-icon" />
          Link copied
        </>
      ) : (
        <>
          <ShareNetwork weight="bold" className="cv-download-icon" />
          Share
        </>
      )}
    </button>
  );
}
