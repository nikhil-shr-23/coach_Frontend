"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";

interface Notification {
  title: string;
  description: string;
  time: string;
  read: boolean;
}

const NOTIFICATIONS: Notification[] = [
  {
    title: "New Lecture Analyzed",
    description: "Your 'Data Structures' lecture analysis is ready.",
    time: "2m ago",
    read: false,
  },
  {
    title: "Dean's Feedback",
    description: "Dr. Rajesh Kumar left a comment on your profile.",
    time: "1h ago",
    read: false,
  },
  {
    title: "System Update",
    description: "Pedagogical AI model has been upgraded to v2.1.",
    time: "1d ago",
    read: true,
  },
];

export function Notifications() {
  const unreadCount = NOTIFICATIONS.filter((n) => !n.read).length;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative h-9 w-9 rounded-full hover:bg-muted/50 transition-colors"
        >
          <svg
            className="h-5 w-5 text-muted-foreground"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0"
            />
          </svg>
          {unreadCount > 0 && (
            <span className="absolute top-1 right-1 h-2.5 w-2.5 rounded-full bg-red-500 border-2 border-background animate-pulse" />
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-80 border-dashed border-border"
        align="end"
        forceMount
      >
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none font-sans">
              Notifications
            </p>
            <p className="text-xs leading-none text-muted-foreground font-ui">
              You have {unreadCount} unread messages
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="bg-border/50 border-t border-dashed border-border/50" />
        <DropdownMenuGroup className="max-h-[300px] overflow-y-auto">
          {NOTIFICATIONS.map((notification, idx) => (
            <DropdownMenuItem
              key={idx}
              className="cursor-pointer flex flex-col items-start gap-1 p-3 focus:bg-muted/50"
            >
              <div className="flex items-center justify-between w-full">
                <span className="font-sans text-sm font-semibold">
                  {notification.title}
                </span>
                <span className="font-ui text-[10px] text-muted-foreground">
                  {notification.time}
                </span>
              </div>
              <p className="font-sans text-xs text-muted-foreground line-clamp-2">
                {notification.description}
              </p>
              {!notification.read && (
                <div className="absolute top-3 right-3 h-1.5 w-1.5 rounded-full bg-primary" />
              )}
            </DropdownMenuItem>
          ))}
        </DropdownMenuGroup>
        <DropdownMenuSeparator className="bg-border/50 border-t border-dashed border-border/50" />
        <DropdownMenuItem className="cursor-pointer font-ui text-xs justify-center text-primary font-medium focus:text-primary">
          View all notifications
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
