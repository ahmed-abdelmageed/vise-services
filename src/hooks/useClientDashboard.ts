import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/contexts/LanguageContext";
import { ClientSection, UserData } from "@/types/dashboard";

export const useClientDashboard = () => {
  const [activeSection, setActiveSection] = useState<ClientSection>("dashboard");
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState<any>(null);
  const [applications, setApplications] = useState<any[]>([]);
  const navigate = useNavigate();
  const { t } = useLanguage();

  // Check authentication and fetch user data
  useEffect(() => {
    const checkAuth = async () => {
      try {
        setLoading(true);
        
        // Get current session
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          throw sessionError;
        }
        
        if (!session) {
          // Try to get from localStorage as fallback for previously stored sessions
          const storedUserData = localStorage.getItem("userData");
          
          if (!storedUserData) {
            toast.error(t('pleaseLogin'));
            navigate("/");
            return;
          }
          
          setUserData(JSON.parse(storedUserData));
        } else {
          // Set user data from session
          setUserData(session.user);
          
          // Store in localStorage for backward compatibility
          localStorage.setItem("userData", JSON.stringify(session.user));
        }
        
        // Fetch user's visa applications
        await fetchUserApplications();
      } catch (error) {
        console.error("Authentication error:", error);
        toast.error(t('authFailed'));
        navigate("/");
      } finally {
        setLoading(false);
      }
    };
    
    checkAuth();
  }, [navigate, t]);
  
  // Listen for setActiveSection events (from UserAccountMenu)
  useEffect(() => {
    const handleSetActiveSection = (event: CustomEvent) => {
      if (event.detail && typeof event.detail === 'string') {
        setActiveSection(event.detail as ClientSection);
      }
    };
    
    // Add event listener
    document.addEventListener('setActiveSection', handleSetActiveSection as EventListener);
    
    // Cleanup
    return () => {
      document.removeEventListener('setActiveSection', handleSetActiveSection as EventListener);
    };
  }, []);
  
  // Fetch user's visa applications
  const fetchUserApplications = async () => {
    try {
      const email = userData?.email || JSON.parse(localStorage.getItem("userData") || "{}")?.email;
      
      if (!email) return;
      
      console.log("Fetching applications for email:", email);
      
      const { data, error } = await supabase
        .from('visa_applications')
        .select('*')
        .eq('email', email);
        
      if (error) {
        throw error;
      }
      
      console.log("Fetched applications:", data);
      setApplications(data || []);
    } catch (error) {
      console.error("Error fetching applications:", error);
      toast.error(t('failedToLoadApplications'));
    }
  };

  // Handle logout
  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      localStorage.removeItem("userData");
      toast.success(t('loggedOut'));
      navigate("/");
    } catch (error) {
      console.error("Logout error:", error);
      toast.error(t('logoutFailed'));
    }
  };

  // Prepare user data for components
  const user: UserData = userData ? {
    name: userData.user_metadata?.name || userData.email?.split('@')[0] || t('client'),
    email: userData.email || "",
    phone: userData.user_metadata?.phone || "",
    avatar: (userData.user_metadata?.name || userData.email || "CL").substring(0, 2).toUpperCase()
  } : {
    name: t('client'),
    email: "",
    phone: "",
    avatar: "CL"
  };

  return {
    activeSection,
    setActiveSection,
    loading,
    userData,
    applications,
    handleLogout,
    user
  };
};
