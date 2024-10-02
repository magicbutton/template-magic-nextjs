'use client'

import React, { useState, useReducer } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

// TypeScript interfaces
interface AdminAction {
  name: string
  handler: () => Promise<void>
}

interface StatusMessage {
  id: number
  text: string
  type: 'info' | 'success' | 'error'
}

// Reducer for status messages
type StatusAction =
  | { type: 'ADD_MESSAGE'; payload: StatusMessage }
  | { type: 'CLEAR_MESSAGES' }

const statusReducer = (state: StatusMessage[], action: StatusAction): StatusMessage[] => {
  switch (action.type) {
    case 'ADD_MESSAGE':
      return [...state, action.payload]
    case 'CLEAR_MESSAGES':
      return []
    default:
      return state
  }
}

// Simulated API call
const activateAllRoles = async (): Promise<string> => {
  await new Promise(resolve => setTimeout(resolve, 2000)) // Simulate API delay
  return "All roles have been successfully activated."
}

export function AdminPageComponent() {
  const [isLoading, setIsLoading] = useState(false)
  const [statusMessages, dispatchStatus] = useReducer(statusReducer, [])

  const addStatusMessage = (text: string, type: 'info' | 'success' | 'error' = 'info') => {
    dispatchStatus({
      type: 'ADD_MESSAGE',
      payload: { id: Date.now(), text, type }
    })
  }

  const handleActivateAllRoles = async () => {
    setIsLoading(true)
    addStatusMessage("Activating all roles...", "info")
    try {
      const result = await activateAllRoles()
      addStatusMessage(result, "success")
    } catch (error) {
      addStatusMessage("Failed to activate roles. Please try again.", "error")
    } finally {
      setIsLoading(false)
    }
  }

  const actions: AdminAction[] = [
    { name: "Activate all roles", handler: handleActivateAllRoles },
  ]

  return (
    <div className="container mx-auto p-4">
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Microsoft 365 Admin Actions</CardTitle>
          <CardDescription>Perform administrative actions for your Microsoft 365 environment</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {actions.map((action, index) => (
              <Button
                key={index}
                onClick={action.handler}
                disabled={isLoading}
                className="w-full"
              >
                {action.name}
              </Button>
            ))}
          </div>
          {statusMessages.length > 0 && (
            <div className="mt-6 space-y-2">
              {statusMessages.map((message) => (
                <div
                  key={message.id}
                  className={`p-2 rounded ${message.type === 'success' ? 'bg-green-100 text-green-800' :
                    message.type === 'error' ? 'bg-red-100 text-red-800' :
                      'bg-blue-100 text-blue-800'
                    }`}
                >
                  {message.text}
                </div>
              ))}
            </div>
          )}
        </CardContent>
        <CardFooter>
          <Button
            onClick={() => dispatchStatus({ type: 'CLEAR_MESSAGES' })}
            variant="outline"
            className="w-full"
          >
            Clear Messages
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}