export interface Task {
    id: string
    title: string
    isImportant: boolean
    deadline?: Date
    hasAlert: boolean
    createdAt: Date
    completed: boolean
  }
  
  export interface User {
    id: string
    name: string
    email: string
    avatar: string
  }
  
  