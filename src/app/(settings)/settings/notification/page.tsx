// app/settings/notifications/page.tsx
"use client";

import { useState, useEffect } from "react";
import { Switch } from "../../../../components/ui/switch";  // from shadcn-ui
import { toast } from "sonner";                 // or your toast lib

export default function NotificationSettingsPage() {
  const [enabled, setEnabled] = useState<boolean>(false);

  // Load saved preference from localStorage (or fetch from your API)
  useEffect(() => {
    const saved = localStorage.getItem("notifications_enabled");
    setEnabled(saved === "true");
  }, []);

  const toggle = () => {
    const next = !enabled;
    setEnabled(next);
    localStorage.setItem("notifications_enabled", next.toString());
    toast.success(
      next
        ? "Notifications turned on"
        : "Notifications turned off"
    );
  };

  return (
    <div className="min-h-screen p-8 bg-gray-50">
      <h1 className="text-2xl font-semibold mb-6">Notification Settings</h1>
      <div className="flex items-center space-x-4">
        <Switch
          id="notif-toggle"
          checked={enabled}
          onCheckedChange={toggle}
        />
        <label htmlFor="notif-toggle" className="text-lg">
          {enabled ? "Enabled" : "Disabled"}
        </label>
      </div>
    </div>
  );
}
