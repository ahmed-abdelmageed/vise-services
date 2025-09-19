import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";
import { toast } from "sonner";

export interface UserInfo {
  id: string;
  email: string;
  name?: string;
  phone?: string;
  email_verified: boolean;
  phone_verified: boolean;
  created_at: string;
  updated_at: string;
  last_sign_in_at?: string;
}

/**
 * Get the current authenticated user
 */
export const getCurrentUser = async (): Promise<User | null> => {
  try {
    const { data: { user }, error } = await supabase.auth.getUser();
    
    if (error) {
      console.error('Error getting current user:', error);
      toast.error('Failed to get user information');
      return null;
    }
    
    return user;
  } catch (error) {
    console.error('Error getting current user:', error);
    toast.error('Failed to get user information');
    return null;
  }
};

/**
 * Get the current user's ID
 */
export const getCurrentUserId = async (): Promise<string | null> => {
  try {
    const user = await getCurrentUser();
    return user?.id || null;
  } catch (error) {
    console.error('Error getting current user ID:', error);
    return null;
  }
};

/**
 * Get formatted user information
 */
export const getUserInfo = async (): Promise<UserInfo | null> => {
  try {
    const user = await getCurrentUser();
    
    if (!user) {
      return null;
    }
    
    return {
      id: user.id,
      email: user.email || '',
      name: user.user_metadata?.name || user.user_metadata?.email?.split('@')[0] || '',
      phone: user.phone || user.user_metadata?.phone || '',
      email_verified: user.user_metadata?.email_verified || false,
      phone_verified: user.user_metadata?.phone_verified || false,
      created_at: user.created_at,
      updated_at: user.updated_at,
      last_sign_in_at: user.last_sign_in_at || undefined,
    };
  } catch (error) {
    console.error('Error getting user info:', error);
    toast.error('Failed to get user information');
    return null;
  }
};

/**
 * Get user session information
 */
export const getUserSession = async () => {
  try {
    const { data: { session }, error } = await supabase.auth.getSession();
    
    if (error) {
      console.error('Error getting user session:', error);
      toast.error('Failed to get session information');
      return null;
    }
    
    return session;
  } catch (error) {
    console.error('Error getting user session:', error);
    toast.error('Failed to get session information');
    return null;
  }
};

/**
 * Check if user is authenticated
 */
export const isUserAuthenticated = async (): Promise<boolean> => {
  try {
    const user = await getCurrentUser();
    return !!user;
  } catch (error) {
    console.error('Error checking authentication:', error);
    return false;
  }
};

/**
 * Get user email
 */
export const getUserEmail = async (): Promise<string | null> => {
  try {
    const user = await getCurrentUser();
    return user?.email || null;
  } catch (error) {
    console.error('Error getting user email:', error);
    return null;
  }
};

/**
 * Update user metadata
 */
export const updateUserMetadata = async (metadata: Record<string, any>) => {
  try {
    const { data, error } = await supabase.auth.updateUser({
      data: metadata
    });
    
    if (error) {
      console.error('Error updating user metadata:', error);
      toast.error('Failed to update user information');
      return null;
    }
    
    toast.success('User information updated successfully');
    return data.user;
  } catch (error) {
    console.error('Error updating user metadata:', error);
    toast.error('Failed to update user information');
    return null;
  }
};

/**
 * Sign out user
 */
export const signOutUser = async () => {
  try {
    const { error } = await supabase.auth.signOut();
    
    if (error) {
      console.error('Error signing out:', error);
      toast.error('Failed to sign out');
      return false;
    }
    
    toast.success('Signed out successfully');
    return true;
  } catch (error) {
    console.error('Error signing out:', error);
    toast.error('Failed to sign out');
    return false;
  }
};
