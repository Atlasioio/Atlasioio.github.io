import type { ReactNode } from "react";
import { ChatProvider } from "./chat-provider";
import { ChatDock } from "./chat-dock";

export default function WorkLayout({ children }: { children: ReactNode }) {
  return (
    <ChatProvider>
      <div>{children}</div>
      <ChatDock />
    </ChatProvider>
  );
}
