"use client";

import { DownloadSimple } from "@phosphor-icons/react/dist/ssr";

export function DownloadCVButton() {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="cv-download-btn"
    >
      <DownloadSimple weight="bold" className="cv-download-icon" />
      Download PDF
    </button>
  );
}
