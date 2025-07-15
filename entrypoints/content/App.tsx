"use client";

import { AuthScreen } from "@/components/auth/auth-screen";
import DeliveryServiceTabs from "@/components/main/navigation";
import { AuthManager } from "@/utils/auth";
import { useEffect, useState } from "react";

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [_, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const authenticated = await AuthManager.isAuthenticated();
      setIsAuthenticated(authenticated);

      if (authenticated) {
        const profile = await AuthManager.getProfile();
        setUserProfile(profile);
      }
    } catch (error) {
      console.error(
        "Erreur lors de la vérification de l'authentification:",
        error
      );
      setIsAuthenticated(false);
      setUserProfile(null);
    } finally {
      setLoading(false);
    }
  };

  const handleAuthSuccess = async (token: string, profile: UserProfile) => {
    try {
      await AuthManager.saveAuth(token, profile, 7);
      setIsAuthenticated(true);
      setUserProfile(profile);
    } catch (error) {
      console.error("Erreur lors de la sauvegarde du token:", error);
    }
  };

  const handleLogout = async () => {
    try {
      await AuthManager.clearAuth();
    } catch (error) {
      console.error("Erreur lors de la déconnexion:", error);
    } finally {
      setIsAuthenticated(false);
      setUserProfile(null);
    }
  };

  if (loading) {
    return (
      <div className="fixed top-2 max-w-[400px] min-w-[400px] right-2 max-h-[400px] min-h-[400px] bg-background z-[9999451] border-foreground rounded-lg flex justify-center items-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Chargement...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed top-2 max-w-[400px] min-w-[400px] right-2 max-h-[400px] min-h-[400px] bg-background border-foreground z-[9999451] rounded-lg flex justify-center items-center">
      {!isAuthenticated ? (
        <AuthScreen onAuthSuccess={handleAuthSuccess} />
      ) : (
        <DeliveryServiceTabs onLogout={handleLogout} />
      )}
    </div>
  );
}
