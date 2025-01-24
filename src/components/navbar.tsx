"use client"

import { useState } from "react"
import Link from "next/link"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ThemeToggle } from "@/components/theme-toggle"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Menu, PlusCircle, LogOut, SearchIcon } from "lucide-react"

interface NavbarProps {
  onMenuToggle: () => void
  onSearch: (term: string) => void
}

export function Navbar({ onMenuToggle, onSearch }: NavbarProps) {
  const { user, logout } = useAuth()
  const [showSearch, setShowSearch] = useState(false)

  if (!user) return null

  return (
    <header className="border-b">
      <div className="flex h-16 items-center px-4 md:px-6">
        <Button variant="ghost" size="icon" onClick={onMenuToggle} className="mr-4">
          <Menu className="h-5 w-5" />
        </Button>
        <Link href="/dashboard" className="font-semibold">
          Todo App
        </Link>
        <div className="ml-auto flex items-center space-x-4">
          {showSearch ? (
            <div className="relative w-64">
              <Input placeholder="Search tasks..." className="pl-8" onChange={(e) => onSearch(e.target.value)} />
              <SearchIcon className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            </div>
          ) : (
            <Button variant="ghost" size="icon" onClick={() => setShowSearch(true)}>
              <SearchIcon className="h-5 w-5" />
            </Button>
          )}
          <ThemeToggle />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                <img
                  alt={user.name}
                  className="h-8 w-8 rounded-full"
                  src={user.avatar || "/placeholder.svg"}
                  width={32}
                  height={32}
                />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuItem>
                <PlusCircle className="mr-2 h-4 w-4" />
                Add task
              </DropdownMenuItem>
              <DropdownMenuItem onClick={logout}>
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}

