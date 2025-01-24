"use client"

import { useState } from "react"
import { format } from "date-fns"
import { Star, Bell, Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import type { Task } from "@/types/todo"
import { cn } from "@/lib/utils"

interface TaskEditorProps {
  task: Task
  open: boolean
  onClose: () => void
  onUpdate: (id: string, updates: Partial<Task>) => void
}

export function TaskEditor({ task, open, onClose, onUpdate }: TaskEditorProps) {
  const [title, setTitle] = useState(task.title)
  const [isImportant, setIsImportant] = useState(task.isImportant)
  const [date, setDate] = useState<Date | undefined>(task.deadline)
  const [hasAlert, setHasAlert] = useState(task.hasAlert)

  const handleSave = () => {
    onUpdate(task.id, {
      title,
      isImportant,
      deadline: date,
      hasAlert,
    })
    onClose()
  }

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Edit Task</SheetTitle>
        </SheetHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Task title" />
          </div>
          <div className="flex items-center gap-2">
            <Button type="button" variant="ghost" size="icon" onClick={() => setIsImportant(!isImportant)}>
              <Star
                className={cn("h-5 w-5", isImportant ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground")}
              />
            </Button>
            <Button type="button" variant="ghost" size="icon" onClick={() => setHasAlert(!hasAlert)}>
              <Bell className={cn("h-5 w-5", hasAlert ? "text-primary" : "text-muted-foreground")} />
            </Button>
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span className="text-sm">{date ? format(date, "PPP") : "No deadline"}</span>
            </div>
            <CalendarComponent mode="single" selected={date} onSelect={setDate} initialFocus />
          </div>
          <Button onClick={handleSave} className="w-full">
            Save Changes
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  )
}

