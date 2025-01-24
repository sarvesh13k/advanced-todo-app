"use client"

import { createContext, useContext, useEffect, useState } from "react"
import type { Task } from "@/types/todo"

interface TodoContextType {
  tasks: Task[]
  addTask: (title: string, isImportant?: boolean, deadline?: Date, hasAlert?: boolean) => void
  toggleImportant: (id: string) => void
  deleteTask: (id: string) => void
  toggleCompleted: (id: string) => void
  getTodayTasks: () => Task[]
  getImportantTasks: () => Task[]
  getPlannedTasks: () => Task[]
  getCompletedTasks: () => Task[]
  updateTask: (id: string, updates: Partial<Task>) => void
}

const TodoContext = createContext<TodoContextType>({
  tasks: [],
  addTask: () => {},
  toggleImportant: () => {},
  deleteTask: () => {},
  toggleCompleted: () => {},
  getTodayTasks: () => [],
  getImportantTasks: () => [],
  getPlannedTasks: () => [],
  getCompletedTasks: () => [],
  updateTask: () => {},
})

export function TodoProvider({ children }: { children: React.ReactNode }) {
  const [tasks, setTasks] = useState<Task[]>([])

  useEffect(() => {
    const storedTasks = localStorage.getItem("tasks")
    if (storedTasks) {
      setTasks(JSON.parse(storedTasks))
    }
  }, [])

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks))
  }, [tasks])

  const addTask = (title: string, isImportant = false, deadline?: Date, hasAlert = false) => {
    const newTask: Task = {
      id: Math.random().toString(36).substring(7),
      title,
      isImportant,
      deadline,
      hasAlert,
      createdAt: new Date(),
      completed: false,
    }
    setTasks((prev) => [...prev, newTask])
  }

  const toggleImportant = (id: string) => {
    setTasks((prev) => prev.map((task) => (task.id === id ? { ...task, isImportant: !task.isImportant } : task)))
  }

  const deleteTask = (id: string) => {
    setTasks((prev) => prev.filter((task) => task.id !== id))
  }

  const toggleCompleted = (id: string) => {
    setTasks((prev) => prev.map((task) => (task.id === id ? { ...task, completed: !task.completed } : task)))
  }

  const getTodayTasks = () => {
    return tasks.filter((task) => {
      if (!task.deadline) return false
      const today = new Date()
      const taskDate = new Date(task.deadline)
      return (
        taskDate.getDate() === today.getDate() &&
        taskDate.getMonth() === today.getMonth() &&
        taskDate.getFullYear() === today.getFullYear()
      )
    })
  }

  const getImportantTasks = () => {
    return tasks.filter((task) => task.isImportant)
  }

  const getPlannedTasks = () => {
    return tasks.filter((task) => {
      if (!task.deadline) return false
      const today = new Date()
      const taskDate = new Date(task.deadline)
      return taskDate > today
    })
  }

  const getCompletedTasks = () => {
    return tasks.filter((task) => task.completed)
  }

  const updateTask = (id: string, updates: Partial<Task>) => {
    setTasks((prev) => prev.map((task) => (task.id === id ? { ...task, ...updates } : task)))
  }

  return (
    <TodoContext.Provider
      value={{
        tasks,
        addTask,
        toggleImportant,
        deleteTask,
        toggleCompleted,
        getTodayTasks,
        getImportantTasks,
        getPlannedTasks,
        getCompletedTasks,
        updateTask,
      }}
    >
      {children}
    </TodoContext.Provider>
  )
}

export const useTodo = () => useContext(TodoContext)

