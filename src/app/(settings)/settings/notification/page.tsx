"use client";

import { useState, useEffect } from "react";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { useNotificationStore } from "@/store/notification-store";
import { Bell, UserPlus, Calendar, AlertTriangle, Users } from "lucide-react";

function NotificationSettingsPage() {
  const { settings, updateSettings } = useNotificationStore();
  const [localSettings, setLocalSettings] = useState(settings);

  useEffect(() => {
    setLocalSettings(settings);
  }, [settings]);

  const handleSettingChange = (key: keyof typeof settings, value: boolean) => {
    const newSettings = { ...localSettings, [key]: value };
    setLocalSettings(newSettings);
    updateSettings(newSettings);
    
    toast.success(
      `${key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())} ${value ? 'enabled' : 'disabled'}`
    );
  };

  const settingOptions = [
    {
      key: 'enabled' as const,
      label: 'Enable Notifications',
      description: 'Turn on all notifications',
      icon: Bell,
    },
    {
      key: 'friendRequests' as const,
      label: 'Friend Requests',
      description: 'Get notified when someone sends you a friend request',
      icon: UserPlus,
    },
    {
      key: 'taskUpdates' as const,
      label: 'Task Updates',
      description: 'Get notified about task assignments and updates',
      icon: Users,
    },
    {
      key: 'deadlines' as const,
      label: 'Deadlines',
      description: 'Get notified about upcoming deadlines',
      icon: AlertTriangle,
    },
    {
      key: 'reminders' as const,
      label: 'Reminders',
      description: 'Get notified about scheduled reminders',
      icon: Calendar,
    },
  ];

  return (
    <div className="min-h-screen p-8 bg-gray-50">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h1 className="text-2xl font-semibold mb-6">Notification Settings</h1>
          <p className="text-gray-600 mb-6">
            Customize your notification preferences to stay updated on what matters to you.
          </p>
          
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h3 className="font-medium text-blue-900 mb-2">Friend Request Notifications</h3>
            <div className="text-sm text-blue-800 space-y-1">
              <p><strong>When you send a friend request:</strong></p>
              <ul className="list-disc list-inside ml-2 space-y-1">
                <li>You get: &quot;You have sent a friend request to [username]&quot;</li>
                <li>They get: &quot;[username] sent you a friend request&quot; (handled by backend)</li>
              </ul>
              <p className="mt-2"><strong>When you accept/decline a friend request:</strong></p>
              <ul className="list-disc list-inside ml-2 space-y-1">
                <li>You get: <strong>NO notification</strong> (you performed the action)</li>
                <li>They get: &quot;[username] accepted/declined your friend request&quot; (handled by backend)</li>
              </ul>
            </div>
          </div>
          
          <div className="space-y-6">
            {settingOptions.map((option) => {
              const Icon = option.icon;
              return (
                <div key={option.key} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="p-2 bg-gray-100 rounded-lg">
                      <Icon className="w-5 h-5 text-gray-600" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">{option.label}</h3>
                      <p className="text-sm text-gray-500">{option.description}</p>
                    </div>
                  </div>
                  <Switch
                    id={option.key}
                    checked={localSettings[option.key]}
                    onCheckedChange={(checked) => handleSettingChange(option.key, checked)}
                    disabled={option.key !== 'enabled' && !localSettings.enabled}
                  />
                </div>
              );
            })}
          </div>
          
          {!localSettings.enabled && (
            <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-sm text-yellow-800">
                Enable notifications to configure individual notification types.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default NotificationSettingsPage;
