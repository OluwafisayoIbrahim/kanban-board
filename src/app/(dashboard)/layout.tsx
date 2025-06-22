'use client';
import { ProtectedRoute } from "../(auth)/components/protected-route";
import { useNotificationToast } from "@/hooks/useNotificationToast";

function DashboardContent({ children }: { children: React.ReactNode }) {
  useNotificationToast();
  
  return (
    <div className="relative">
      <div className="fixed inset-0 bg-white" />
      <div
        className="
          relative
          z-10              
          font-sf-pro
          text-black       
          overflow-y-auto   
          min-h-screen  
          antialiased
        "
      >
        {children}
      </div>
    </div>
  );
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute>
      <DashboardContent>{children}</DashboardContent>
    </ProtectedRoute>
  );
}
