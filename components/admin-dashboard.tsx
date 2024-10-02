'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { AlertCircle, CheckCircle, Link as LinkIcon, Bell } from 'lucide-react'

// Mock data - replace with actual API calls in a real application
const mockServiceStatus = [
  { name: 'Exchange Online', status: 'operational', unreadCount: 0 },
  { name: 'SharePoint Online', status: 'degraded', unreadCount: 2 },
  { name: 'Teams', status: 'operational', unreadCount: 1 },
]

const mockTickets = [
  { id: 'INC0001', title: 'Email not syncing', assigned: true, unread: true },
  { id: 'INC0002', title: 'SharePoint access issues', assigned: false, unread: false },
  { id: 'INC0003', title: 'Teams call quality degraded', assigned: true, unread: true },
]

const mockTools = [
  { name: 'Admin Center', url: 'https://admin.microsoft.com' },
  { name: 'Exchange Admin Center', url: 'https://admin.exchange.microsoft.com' },
  { name: 'SharePoint Admin Center', url: 'https://admin.sharepoint.com' },
]

interface DashboardState {
  roles: string[]
  applyingRoles: boolean
  roleStatus: string
}

export function AdminDashboardComponent() {
  const [state, setState] = useState<DashboardState>({
    roles: [],
    applyingRoles: false,
    roleStatus: '',
  })

  const [activeSection, setActiveSection] = useState('')

  const handleApplyRoles = async () => {
    setState(prev => ({ ...prev, applyingRoles: true, roleStatus: 'Applying roles...' }))
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000))
    setState(prev => ({
      ...prev,
      applyingRoles: false,
      roleStatus: 'Roles applied successfully',
      roles: ['Global Admin', 'Exchange Admin', 'SharePoint Admin']
    }))
  }

  useEffect(() => {
    const handleScroll = () => {
      const sections = document.querySelectorAll('section')
      let currentActiveSection = ''
      sections.forEach(section => {
        const sectionTop = section.offsetTop
        const sectionHeight = section.clientHeight
        if (window.pageYOffset >= sectionTop - 50 && window.pageYOffset < sectionTop + sectionHeight - 50) {
          currentActiveSection = section.id
        }
      })
      setActiveSection(currentActiveSection)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const getUnreadCount = (sectionId: string) => {
    switch (sectionId) {
      case 'get-started':
        return 0
      case 'service-status':
        return mockServiceStatus.reduce((acc, service) => acc + service.unreadCount, 0)
      case 'tickets':
        return mockTickets.filter(ticket => ticket.unread).length
      case 'admin-tools':
        return 0
      default:
        return 0
    }
  }

  return (
    <div className="container mx-auto p-4 flex">
      <div className="w-3/4 pr-8">
        <h1 className="text-3xl font-bold mb-6">Microsoft 365 Admin Dashboard</h1>

        <section id="get-started" className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">Get Started</h2>
          <Card>
            <CardHeader>
              <CardTitle>Apply Roles</CardTitle>
            </CardHeader>
            <CardContent>
              <Button onClick={handleApplyRoles} disabled={state.applyingRoles}>
                {state.applyingRoles ? 'Applying...' : 'Apply All Roles'}
              </Button>
              {state.roleStatus && (
                <p className="mt-2 text-sm text-muted-foreground">{state.roleStatus}</p>
              )}
              {state.roles.length > 0 && (
                <div className="mt-4">
                  <h3 className="font-semibold">Active Roles:</h3>
                  <ul className="list-disc list-inside">
                    {state.roles.map(role => (
                      <li key={role}>{role}</li>
                    ))}
                  </ul>
                </div>
              )}
            </CardContent>
          </Card>
        </section>

        <section id="service-status" className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">Microsoft 365 Service Status</h2>
          <Card>
            <CardContent>
              <ul className="space-y-2">
                {mockServiceStatus.map(service => (
                  <li key={service.name} className="flex items-center justify-between">
                    <div className="flex items-center">
                      {service.status === 'operational' ? (
                        <CheckCircle className="text-green-500 mr-2" />
                      ) : (
                        <AlertCircle className="text-yellow-500 mr-2" />
                      )}
                      <span>{service.name}: {service.status}</span>
                    </div>
                    {service.unreadCount > 0 && (
                      <span className="bg-red-500 text-white px-2 py-1 rounded-full text-xs">
                        {service.unreadCount}
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </section>

        <section id="tickets" className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">ServiceNow Tickets</h2>
          <Card>
            <CardContent>
              <h3 className="font-semibold mb-2">Assigned to Me</h3>
              <ul className="list-disc list-inside mb-4">
                {mockTickets.filter(ticket => ticket.assigned).map(ticket => (
                  <li key={ticket.id} className="flex items-center justify-between">
                    <span>{ticket.id}: {ticket.title}</span>
                    {ticket.unread && (
                      <span className="bg-blue-500 text-white px-2 py-1 rounded-full text-xs">New</span>
                    )}
                  </li>
                ))}
              </ul>
              <h3 className="font-semibold mb-2">Unassigned in My Groups</h3>
              <ul className="list-disc list-inside">
                {mockTickets.filter(ticket => !ticket.assigned).map(ticket => (
                  <li key={ticket.id} className="flex items-center justify-between">
                    <span>{ticket.id}: {ticket.title}</span>
                    {ticket.unread && (
                      <span className="bg-blue-500 text-white px-2 py-1 rounded-full text-xs">New</span>
                    )}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </section>

        <section id="admin-tools" className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">Admin Tools</h2>
          <Card>
            <CardContent>
              <ul className="space-y-2">
                {mockTools.map(tool => (
                  <li key={tool.name}>
                    <a
                      href={tool.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center text-blue-500 hover:underline"
                    >
                      <LinkIcon className="mr-2" size={16} />
                      {tool.name}
                    </a>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </section>
      </div>

      <div className="w-1/4">
        <div className="sticky top-4 bg-background p-4 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Table of Contents</h2>
          <ul className="space-y-2">
            {['get-started', 'service-status', 'tickets', 'admin-tools'].map((sectionId) => (
              <li key={sectionId}>
                <a
                  href={`#${sectionId}`}
                  className={`flex items-center justify-between ${activeSection === sectionId ? 'text-primary font-semibold' : 'text-muted-foreground'}`}
                >
                  <span>{sectionId.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}</span>
                  {getUnreadCount(sectionId) > 0 && (
                    <span className="flex items-center">
                      <Bell size={16} className="mr-1" />
                      <span className="bg-red-500 text-white px-2 py-1 rounded-full text-xs">
                        {getUnreadCount(sectionId)}
                      </span>
                    </span>
                  )}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}