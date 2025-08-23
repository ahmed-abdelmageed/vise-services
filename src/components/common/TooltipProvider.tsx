import React from "react";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";

export function TooltipProvider({
  trigger,
  content,
}: {
  trigger: React.ReactNode;
  content: React.ReactNode;
}) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>{trigger}</TooltipTrigger>
      <TooltipContent className="leading-3">
        <div className="mb-0 !text-xs">{content}</div>
      </TooltipContent>
    </Tooltip>
  );
}
