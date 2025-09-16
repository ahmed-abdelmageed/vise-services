import React from "react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { UserAvatar } from "./UserAvatar";
import { UserDropdownContent } from "./UserDropdownContent";
import { AuthDialog } from "./AuthDialog";
import { useAuthentication } from "./useAuthentication";
import { useNavigate } from "react-router-dom";

export const UserAccountMenu = () => {
  const {
    isLoggedIn,
    userName,
    userInitials,
    showAuthDialog,
    setShowAuthDialog,
    handleLogout,
    handleAuthSuccess,
  } = useAuthentication();
  const navigate = useNavigate();

  if (isLoggedIn) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <UserAvatar
            userInitials={userInitials}
            onClick={() => {
              const isAdmin = localStorage.getItem("adminAuthenticated");
              if (isAdmin === "true") {
                navigate("/admin");
              } else {
                navigate("/client-dashboard");
              }
            }}
          />
        </DropdownMenuTrigger>
        <UserDropdownContent userName={userName} onLogout={handleLogout} />
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
