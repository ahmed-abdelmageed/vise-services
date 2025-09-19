import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  useCurrentUser, 
  useUserInfo, 
  useCurrentUserId, 
  useIsAuthenticated,
  useUserEmail,
  useSignOut 
} from '@/hooks/useUserQuery';
import { Loader, User, Mail, Phone, Calendar, LogOut } from 'lucide-react';
import { toast } from 'sonner';

export const UserProfile = () => {
  const { data: user, isLoading: userLoading } = useCurrentUser();
  const { data: userInfo, isLoading: userInfoLoading } = useUserInfo();
  const { data: userId } = useCurrentUserId();
  const { data: isAuthenticated } = useIsAuthenticated();
  const { data: userEmail } = useUserEmail();
  const signOutMutation = useSignOut();

  const handleSignOut = () => {
    signOutMutation.mutate();
  };

  if (userLoading || userInfoLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader className="h-8 w-8 animate-spin text-visa-gold" />
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return (
      <div className="text-center p-8">
        <p className="text-gray-500">Please sign in to view your profile</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            User Profile
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-500">User ID</label>
              <p className="font-mono text-sm bg-gray-100 p-2 rounded">{userId}</p>
            </div>
            
            <div>
              <label className="text-sm font-medium text-gray-500">Email</label>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-gray-400" />
                <p>{userEmail || userInfo?.email}</p>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-500">Name</label>
              <p>{userInfo?.name || 'Not provided'}</p>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-500">Phone</label>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-gray-400" />
                <p>{userInfo?.phone || 'Not provided'}</p>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-500">Email Verified</label>
              <p className={userInfo?.email_verified ? 'text-green-600' : 'text-red-600'}>
                {userInfo?.email_verified ? 'Verified' : 'Not Verified'}
              </p>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-500">Phone Verified</label>
              <p className={userInfo?.phone_verified ? 'text-green-600' : 'text-red-600'}>
                {userInfo?.phone_verified ? 'Verified' : 'Not Verified'}
              </p>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-500">Created At</label>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-gray-400" />
                <p>{userInfo?.created_at ? new Date(userInfo.created_at).toLocaleDateString() : 'N/A'}</p>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-500">Last Sign In</label>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-gray-400" />
                <p>{userInfo?.last_sign_in_at ? new Date(userInfo.last_sign_in_at).toLocaleDateString() : 'N/A'}</p>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t">
            <Button 
              onClick={handleSignOut}
              variant="outline"
              className="flex items-center gap-2"
              disabled={signOutMutation.isPending}
            >
              {signOutMutation.isPending ? (
                <Loader className="h-4 w-4 animate-spin" />
              ) : (
                <LogOut className="h-4 w-4" />
              )}
              Sign Out
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Raw User Data for Development */}
      <Card>
        <CardHeader>
          <CardTitle>Raw User Data (Development)</CardTitle>
        </CardHeader>
        <CardContent>
          <pre className="text-xs bg-gray-100 p-4 rounded overflow-auto">
            {JSON.stringify(user, null, 2)}
          </pre>
        </CardContent>
      </Card>
    </div>
  );
};
