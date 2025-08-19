
import React from "react";
import { DropdownMenu, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { UserAvatar } from "./UserAvatar";
import { UserDropdownContent } from "./UserDropdownContent";
import { AuthDialog } from "./AuthDialog";
import { useAuthentication } from "./useAuthentication";

export const UserAccountMenu = () => {
  const {
    isLoggedIn,
    userName,
    userInitials,
    showAuthDialog,
    setShowAuthDialog,
    handleLogout,
    handleAuthSuccess
  } = useAuthentication();

  if (isLoggedIn) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <UserAvatar userInitials={userInitials} />
        </DropdownMenuTrigger>
        <UserDropdownContent 
          userName={userName}
          onLogout={handleLogout}
        />
      </DropdownMenu>
    );
  }

  return (
    <AuthDialog 
      open={showAuthDialog} 
      onOpenChange={setShowAuthDialog}
      onSuccess={handleAuthSuccess} 
    />
  );
};
