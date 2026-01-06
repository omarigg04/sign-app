'use client';

import { UserButton, useUser } from '@clerk/nextjs';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export function UserAccountNav() {
  const { user, isSignedIn } = useUser();

  if (!isSignedIn) {
    return (
      <div className="flex items-center space-x-4">
        <Button variant="outline" asChild>
          <a href="/sign-in">Sign In</a>
        </Button>
        <Button asChild>
          <a href="/sign-up">Sign Up</a>
        </Button>
      </div>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
            <span className="text-sm font-medium">
              {user?.firstName?.charAt(0) || user?.lastName?.charAt(0) || user?.emailAddresses[0]?.emailAddress?.charAt(0) || 'U'}
            </span>
          </div>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <div className="flex items-center justify-start gap-2 p-2">
          <div className="flex flex-col space-y-1 leading-none">
            {user?.firstName && (
              <p className="font-medium">{user.firstName} {user.lastName}</p>
            )}
            {user?.emailAddresses[0]?.emailAddress && (
              <p className="w-[200px] truncate text-sm text-muted-foreground">
                {user.emailAddresses[0].emailAddress}
              </p>
            )}
          </div>
        </div>
        <DropdownMenuItem className="cursor-pointer" onSelect={() => {}}>
          <UserButton afterSignOutUrl="/" />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}