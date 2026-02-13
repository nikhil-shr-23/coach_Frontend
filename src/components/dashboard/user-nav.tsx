"use client";

import Link from "next/link";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface UserNavProps {
  name: string;
  email: string;
  initials: string;
  role: string;
}

export function UserNav({ name, email, initials, role }: UserNavProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="relative h-10 w-10 md:h-auto md:w-auto p-0 md:px-0 md:flex md:items-center md:gap-3 rounded-full md:rounded-lg hover:bg-transparent"
        >
          <Avatar className="h-8 w-8 border border-dashed border-border transition-all hover:border-primary/50">
            <AvatarFallback className="font-ui text-xs font-semibold bg-primary/10 text-primary">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div className="hidden md:block text-left">
            <p className="text-sm font-sans font-medium text-foreground leading-none">
              {name}
            </p>
            <p className="text-xs font-ui text-muted-foreground mt-0.5">
              {email}
            </p>
          </div>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-56 border-dashed border-border"
        align="end"
        forceMount
      >
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none font-sans">{name}</p>
            <p className="text-xs leading-none text-muted-foreground font-ui">
              {email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="bg-border/50 border-t border-dashed border-border/50" />
        <DropdownMenuGroup>
          <DropdownMenuItem className="cursor-pointer font-sans text-sm">
            Profile
            <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem className="cursor-pointer font-sans text-sm">
            Settings
            <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator className="bg-border/50 border-t border-dashed border-border/50" />
        <Link href="/">
          <DropdownMenuItem className="cursor-pointer font-sans text-sm text-red-500 focus:text-red-500 focus:bg-red-50">
            Log out
            <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
          </DropdownMenuItem>
        </Link>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
