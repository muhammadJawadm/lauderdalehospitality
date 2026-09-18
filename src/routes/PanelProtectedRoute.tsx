import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import type { User } from "firebase/auth";

export default function PanelProtectedRoute({ user, children }: { user: User | null | undefined; children: ReactNode }) {
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
}
