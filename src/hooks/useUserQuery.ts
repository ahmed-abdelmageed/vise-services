import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  getCurrentUser, 
  getCurrentUserId, 
  getUserInfo, 
  getUserSession, 
  isUserAuthenticated,
  getUserEmail,
  updateUserMetadata,
  signOutUser,
  UserInfo
} from '@/api/user';
import { User } from '@supabase/supabase-js';

// Query keys
export const userQueryKeys = {
  all: ['user'] as const,
  currentUser: () => [...userQueryKeys.all, 'current'] as const,
  userId: () => [...userQueryKeys.all, 'id'] as const,
  userInfo: () => [...userQueryKeys.all, 'info'] as const,
  session: () => [...userQueryKeys.all, 'session'] as const,
  authenticated: () => [...userQueryKeys.all, 'authenticated'] as const,
  email: () => [...userQueryKeys.all, 'email'] as const,
};

/**
 * Hook to get the current authenticated user
 */
export const useCurrentUser = () => {
  return useQuery<User | null>({
    queryKey: userQueryKeys.currentUser(),
    queryFn: getCurrentUser,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};

/**
 * Hook to get the current user's ID
 */
export const useCurrentUserId = () => {
  return useQuery<string | null>({
    queryKey: userQueryKeys.userId(),
    queryFn: getCurrentUserId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};

/**
 * Hook to get formatted user information
 */
export const useUserInfo = () => {
  return useQuery<UserInfo | null>({
    queryKey: userQueryKeys.userInfo(),
    queryFn: getUserInfo,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};

/**
 * Hook to get user session
 */
export const useUserSession = () => {
  return useQuery({
    queryKey: userQueryKeys.session(),
    queryFn: getUserSession,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};

/**
 * Hook to check if user is authenticated
 */
export const useIsAuthenticated = () => {
  return useQuery<boolean>({
    queryKey: userQueryKeys.authenticated(),
    queryFn: isUserAuthenticated,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};

/**
 * Hook to get user email
 */
export const useUserEmail = () => {
  return useQuery<string | null>({
    queryKey: userQueryKeys.email(),
    queryFn: getUserEmail,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};

/**
 * Hook to update user metadata
 */
export const useUpdateUserMetadata = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateUserMetadata,
    onSuccess: () => {
      // Invalidate all user-related queries
      queryClient.invalidateQueries({ queryKey: userQueryKeys.all });
    },
  });
};

/**
 * Hook to sign out user
 */
export const useSignOut = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: signOutUser,
    onSuccess: () => {
      // Clear all queries when user signs out
      queryClient.clear();
    },
  });
};

/**
 * Hook to refresh user data
 */
export const useRefreshUser = () => {
  const queryClient = useQueryClient();

  const refreshUserData = () => {
    queryClient.invalidateQueries({ queryKey: userQueryKeys.all });
  };

  return { refreshUserData };
};
