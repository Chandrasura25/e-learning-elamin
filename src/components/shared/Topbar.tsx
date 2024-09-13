import { CreditCard, Keyboard, LogOut, Settings, User } from "lucide-react";

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
import { useAuth } from "@/contexts/AuthContext";
import Logo from "./../../assets/logo.png";
export default function Topbar() {
  const { logout, user, role } = useAuth();
  return (
    <div className="bg-red-1 p-3 shadow-lg border-b border-gray-600 fixed top-0 z-30 w-full">
      <div className="flex items-center justify-between">
        <a href="https://learming.elaminschoolabuja.com" className="flex gap-1">
          <img src={Logo} className="mr-3 h-10 w-10" alt="El-Amin" />
          <span className="text-heading3-bold uppercase text-light-1 max-xs:hidden">
            El-Amin
          </span>
        </a>
        <div className="flex text-white items-center gap-4">
          <div className="flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="bg-transparent border-none hover:bg-transparent hover:text-light-2"
                >
                  <img src="/images/user.svg" alt="" className="h-5 w-5 mr-1" />
                  <span className="text-base1-semibold">
                    {user?.firstname} {user?.lastname}
                  </span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56">
                <DropdownMenuLabel>{role}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  {role === "Teacher" ? (
                    <DropdownMenuItem>
                      <User className="mr-2 h-4 w-4" />
                      <span>Notes</span>
                      <DropdownMenuShortcut>⇧⌘N</DropdownMenuShortcut>
                    </DropdownMenuItem>
                  ) : (
                    <DropdownMenuItem>
                      <User className="mr-2 h-4 w-4" />
                      <span>Profile</span>
                      <DropdownMenuShortcut>��G</DropdownMenuShortcut>
                    </DropdownMenuItem>
                  )}
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={logout} className="cursor-pointer">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                  <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </div>
  );
}
