import React from "react";
import { Link } from "wouter";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

export default function AIAssistantButton() {
  return (
    <div className="fixed bottom-8 right-8 z-50">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Link href="/assistant">
              <button className="bg-primary hover:bg-primary-dark text-white w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-all duration-200 hover:scale-110">
                <i className="ri-robot-line text-2xl"></i>
              </button>
            </Link>
          </TooltipTrigger>
          <TooltipContent side="left">
            <p>Ask ESG AI Assistant</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
}