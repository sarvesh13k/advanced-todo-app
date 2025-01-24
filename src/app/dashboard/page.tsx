"use client"

import { useState, useEffect } from "react"
import { format } from "date-fns"
import { CalendarIcon, Star, Bell, Trash2, Edit, PieChart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Checkbox } from "@/components/ui/checkbox"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { TaskEditor } from "@/components/task-editor"
import type { Task } from "@/types/todo"
import { Statistics } from "@/components/statistics" // Import the Statistics component

interface DashboardPageProps {
  searchTerm?: string
}

export default function DashboardPage({ searchTerm = "" }: DashboardPageProps) {
  const [tasks, setTasks] = useState<Task[]>([])
  const [title, setTitle] = useState("")
  const [isImportant, setIsImportant] = useState(false)
  const [date, setDate] = useState<Date>()
  const [hasAlert, setHasAlert] = useState(false)
  const [editingTask, setEditingTask] = useState<Task | null>(null)
  const [showStats, setShowStats] = useState(false)

  // Load tasks from localStorage on mount
  useEffect(() => {
    const savedTasks = localStorage.getItem("tasks")
    if (savedTasks) {
      setTasks(JSON.parse(savedTasks))
    }
  }, [])

  // Save tasks to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks))
  }, [tasks])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) return

    const newTask: Task = {
      id: Math.random().toString(36).substring(7),
      title,
      isImportant,
      deadline: date,
      hasAlert,
      createdAt: new Date(),
      completed: false,
    }

    setTasks((prev) => [...prev, newTask])
    setTitle("")
    setIsImportant(false)
    setDate(undefined)
    setHasAlert(false)
  }

  const toggleImportant = (id: string) => {
    setTasks((prev) => prev.map((task) => (task.id === id ? { ...task, isImportant: !task.isImportant } : task)))
  }

  const toggleCompleted = (id: string) => {
    setTasks((prev) => prev.map((task) => (task.id === id ? { ...task, completed: !task.completed } : task)))
  }

  const deleteTask = (id: string) => {
    setTasks((prev) => prev.filter((task) => task.id !== id))
  }

  const updateTask = (id: string, updates: Partial<Task>) => {
    setTasks((prev) => prev.map((task) => (task.id === id ? { ...task, ...updates } : task)))
  }

  const incompleteTasks = tasks.filter((task) => !task.completed)
  const completedTasks = tasks.filter((task) => task.completed)

  const filteredIncompleteTasks = incompleteTasks.filter((task) =>
    task.title.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const filteredCompletedTasks = completedTasks.filter((task) =>
    task.title.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold">Tasks</h1>
        <Button variant="outline" size="sm" onClick={() => setShowStats(true)} className="flex items-center gap-2">
          <PieChart className="h-4 w-4" />
          Statistics
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="flex items-center gap-2 mb-8">
        <Input
          type="text"
          placeholder="Add a task"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="flex-1"
        />
        <Button type="button" variant="ghost" size="icon" onClick={() => setIsImportant(!isImportant)}>
          <Star className={cn("h-5 w-5", isImportant ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground")} />
        </Button>
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="icon">
              <CalendarIcon className="h-5 w-5 text-muted-foreground" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="end">
            <Calendar mode="single" selected={date} onSelect={setDate} initialFocus />
          </PopoverContent>
        </Popover>
        <Button type="button" variant="ghost" size="icon" onClick={() => setHasAlert(!hasAlert)}>
          <Bell className={cn("h-5 w-5", hasAlert ? "text-primary" : "text-muted-foreground")} />
        </Button>
        <Button type="submit">Add Task</Button>
      </form>

      <div className="space-y-8">
        {filteredIncompleteTasks.length > 0 && (
          <div>
            <h2 className="text-lg font-semibold mb-4">Tasks</h2>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredIncompleteTasks.map((task) => (
                <div key={task.id} className="p-4 rounded-lg border">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-start gap-2">
                      <Checkbox checked={task.completed} onCheckedChange={() => toggleCompleted(task.id)} />
                      <div>
                        <h3 className="font-medium">{task.title}</h3>
                        {task.deadline && (
                          <p className="text-sm text-muted-foreground">Due {format(new Date(task.deadline), "PPP")}</p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="icon" onClick={() => toggleImportant(task.id)}>
                        <Star className={cn("h-4 w-4", task.isImportant && "fill-yellow-400 text-yellow-400")} />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => setEditingTask(task)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => deleteTask(task.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {filteredCompletedTasks.length > 0 && (
          <div>
            <h2 className="text-lg font-semibold mb-4">Completed Tasks</h2>
            <div className="space-y-2">
              {filteredCompletedTasks.map((task) => (
                <div key={task.id} className="flex items-center justify-between p-4 rounded-lg border">
                  <div className="flex items-center gap-2">
                    <Checkbox checked={task.completed} onCheckedChange={() => toggleCompleted(task.id)} />
                    <span className="line-through text-muted-foreground">{task.title}</span>
                  </div>
                  <Button variant="ghost" size="icon" onClick={() => deleteTask(task.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {editingTask && (
        <TaskEditor
          task={editingTask}
          open={!!editingTask}
          onClose={() => setEditingTask(null)}
          onUpdate={updateTask}
        />
      )}

      {/* Show statistics modal */}
      <Statistics open={showStats} onClose={() => setShowStats(false)} />
    </div>
  )
}
