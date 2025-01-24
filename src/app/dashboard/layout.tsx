"use client"

import { useState } from "react"
import { Navbar } from "@/components/navbar"
import { Sidebar } from "@/components/sidebar"
import React, { ReactElement } from "react"

// Define the expected props for the children components
interface ChildProps {
  searchTerm: string
}

export default function DashboardLayout({
  children,
}: {
  children: ReactElement<ChildProps> // Typing children to accept searchTerm
}) {
  const [showSidebar, setShowSidebar] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [currentView, setCurrentView] = useState("all") // Add state for view management

  // Function to handle view changes in Sidebar
  const handleViewChange = (view: string) => {
    setCurrentView(view)
  }

  return (
    <div className="min-h-screen">
      <Navbar onMenuToggle={() => setShowSidebar(!showSidebar)} onSearch={setSearchTerm} />
      <div className="flex">
        {showSidebar && (
          <Sidebar onViewChange={handleViewChange} currentView={currentView} />
        )}
        <main className="flex-1 p-6">
          {/* Ensuring searchTerm is passed correctly to children */}
          {React.cloneElement(children, { searchTerm })}
        </main>
      </div>
    </div>
  )
}
