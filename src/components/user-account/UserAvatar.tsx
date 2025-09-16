import React from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

interface UserAvatarProps {
  userInitials: string;
  onClick?: () => void;
}

export const UserAvatar = ({ userInitials, onClick }: UserAvatarProps) => {
  return (
    <Button
      variant="ghost"
      className="relative rounded-full h-8 w-8 p-0 border border-gray-200 hover:bg-visa-light"
      onClick={onClick}
    >
      <Avatar className="h-8 w-8">
        <AvatarFallback className="bg-visa-gold text-white text-xs">
          {userInitials}
        </AvatarFallback>
      </Avatar>
    </Button>
  );
};
