"use client"

import { useEffect, useRef } from "react"
import { Chart, type ChartConfiguration } from "chart.js/auto"
import { useTodo } from "@/contexts/todo-context"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

interface StatisticsProps {
  open: boolean
  onClose: () => void
}

export function Statistics({ open, onClose }: StatisticsProps) {
  const chartRef = useRef<HTMLCanvasElement>(null)
  const chartInstance = useRef<Chart | null>(null)
  const { tasks } = useTodo()

  useEffect(() => {
    // If chartRef is not available or modal is not open, don't proceed
    if (!chartRef.current || !open) return

    // Calculate completed and remaining tasks
    const completed = tasks.filter((task) => task.completed).length
    const remaining = tasks.length - completed

    // Chart.js configuration
    const config: ChartConfiguration<"pie"> = {
      type: "pie",
      data: {
        labels: ["Completed", "Remaining"],
        datasets: [
          {
            data: [completed, remaining],
            backgroundColor: ["#22c55e", "#e11d48"],
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: "bottom",
          },
        },
      },
    }

    // Destroy the previous chart if exists
    if (chartInstance.current) {
      chartInstance.current.destroy()
    }

    // Create a new chart instance
    chartInstance.current = new Chart(chartRef.current, config)

    // Cleanup: destroy the chart instance when component unmounts or `open` changes
    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy()
      }
    }
  }, [open, tasks]) // Re-run whenever `open` or `tasks` change

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Task Statistics</DialogTitle>
        </DialogHeader>
        <div className="p-4">
          <canvas ref={chartRef} />
        </div>
      </DialogContent>
    </Dialog>
  )
}
