import { ProtectedRoute } from "../(auth)/components/protected-route";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute>
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
    </ProtectedRoute>
  );
}
