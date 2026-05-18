import type { ReactNode } from "react";
import { ChatProvider } from "./chat-provider";
import { ChatDock } from "./chat-dock";

export default function WorkLayout({ children }: { children: ReactNode }) {
  return (
    <ChatProvider>
      <div className="pb-24 md:pb-28">{children}</div>
      <ChatDock />
    </ChatProvider>
  );
}
