import { ReactNode } from "react";


export default function SettingsLayout({ children }: { children: ReactNode }) {
  return (
    <div
      className={`            
        font-sf-pro text-white overflow-y-hidden h-screen antialiased
      `}
    >
      {children}
    </div>
  );
}
