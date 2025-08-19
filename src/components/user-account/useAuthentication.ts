
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useLanguage } from "@/contexts/LanguageContext";

export const useAuthentication = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState("");
  const [userInitials, setUserInitials] = useState("");
  const [showAuthDialog, setShowAuthDialog] = useState(false);
  const navigate = useNavigate();
  const { t } = useLanguage();

  useEffect(() => {
    // Check authentication status from Supabase
    const checkAuth = async () => {
      try {
        // Get current session from Supabase
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session) {
          // User is authenticated in Supabase
          const userData = session.user;
          const name = userData.user_metadata?.name || userData.email?.split('@')[0] || "User";
          setUserName(name);
          
          // Create initials from name
          const initials = name
            .split(" ")
            .map((n: string) => n[0])
            .join("")
            .toUpperCase()
            .substring(0, 2);
          
          setUserInitials(initials);
          setIsLoggedIn(true);
          
          // Store in localStorage for backward compatibility
          localStorage.setItem("userData", JSON.stringify(userData));
        } else {
          // As fallback, check localStorage
          const storedUserData = localStorage.getItem("userData");
          if (storedUserData) {
            const parsedUser = JSON.parse(storedUserData);
            const name = parsedUser.user_metadata?.name || parsedUser.email?.split('@')[0] || "User";
            setUserName(name);
            
            // Create initials from name
            const initials = name
              .split(" ")
              .map((n: string) => n[0])
              .join("")
              .toUpperCase()
              .substring(0, 2);
            
            setUserInitials(initials);
            setIsLoggedIn(true);
          } else {
            setIsLoggedIn(false);
          }
        }
      } catch (error) {
        console.error("Auth check error:", error);
        setIsLoggedIn(false);
      }
    };
    
    checkAuth();
    
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN') {
        const userData = session?.user;
        if (userData) {
          const name = userData.user_metadata?.name || userData.email?.split('@')[0] || "User";
          setUserName(name);
          
          // Create initials from name
          const initials = name
            .split(" ")
            .map((n: string) => n[0])
            .join("")
            .toUpperCase()
            .substring(0, 2);
          
          setUserInitials(initials);
          setIsLoggedIn(true);
          
          // Store in localStorage for backward compatibility
          localStorage.setItem("userData", JSON.stringify(userData));
        }
      } else if (event === 'SIGNED_OUT') {
        localStorage.removeItem("userData");
        setIsLoggedIn(false);
      }
    });
    
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      localStorage.removeItem("userData");
      localStorage.removeItem("adminAuthenticated");
      setIsLoggedIn(false);
      toast.success(t('loggedOut'));
      navigate("/");
    } catch (error) {
      console.error("Logout error:", error);
      toast.error(t('logoutFailed'));
    }
  };

  const handleAuthSuccess = () => {
    setShowAuthDialog(false);
    // No need to reload, onAuthStateChange will handle the updates
  };

  return {
    isLoggedIn,
    userName,
    userInitials,
    showAuthDialog,
    setShowAuthDialog,
    handleLogout,
    handleAuthSuccess
  };
};
