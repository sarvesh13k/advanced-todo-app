"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Calendar, Star, AlertCircle, ListTodo, PieChart, Plus } from "lucide-react"
import { Statistics } from "@/components/statistics"
import { Input } from "./ui/input"

interface SidebarProps {
  onViewChange: (view: string) => void // Expecting this to be passed from the parent
  currentView: string
}

export function Sidebar({ onViewChange, currentView }: SidebarProps) {
  const [showStats, setShowStats] = useState(false)
  const [showAddList, setShowAddList] = useState(false)

  return (
    <div className="w-64 border-r p-4">
      <nav className="space-y-2">
        <Button
          variant={currentView === "all" ? "secondary" : "ghost"}
          className="w-full justify-start"
          onClick={() => onViewChange("all")}
        >
          <ListTodo className="mr-2 h-4 w-4" />
          All tasks
        </Button>
        <Button
          variant={currentView === "today" ? "secondary" : "ghost"}
          className="w-full justify-start"
          onClick={() => onViewChange("today")}
        >
          <Calendar className="mr-2 h-4 w-4" />
          Today
        </Button>
        <Button
          variant={currentView === "important" ? "secondary" : "ghost"}
          className="w-full justify-start"
          onClick={() => onViewChange("important")}
        >
          <Star className="mr-2 h-4 w-4" />
          Important
        </Button>
        <Button
          variant={currentView === "planned" ? "secondary" : "ghost"}
          className="w-full justify-start"
          onClick={() => onViewChange("planned")}
        >
          <AlertCircle className="mr-2 h-4 w-4" />
          Planned
        </Button>
      </nav>
      <div className="mt-8">
        <Button variant="outline" className="w-full justify-start" onClick={() => setShowAddList(!showAddList)}>
          <Plus className="mr-2 h-4 w-4" />
          Add list
        </Button>
        {showAddList && (
          <div className="mt-2 p-2 border rounded-md">
            <Input placeholder="List name" className="mb-2" />
            <Button size="sm" className="w-full">
              Add
            </Button>
          </div>
        )}
        <Button variant="ghost" className="w-full justify-start mt-2" onClick={() => setShowStats(true)}>
          <PieChart className="mr-2 h-4 w-4" />
          Statistics
        </Button>
      </div>
      <Statistics open={showStats} onClose={() => setShowStats(false)} />
    </div>
  )
}
