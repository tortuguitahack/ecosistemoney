import { useState, useEffect } from 'react'
import { RefreshCw, Settings, Bell, Download, Play } from 'lucide-react'
import { trpc, getTrpcClient } from '../lib/trpc'
import { StatsCards } from '../components/StatsCards'
import { RevenueChart } from '../components/RevenueChart'
import { WorkflowStatus } from '../components/WorkflowStatus'
import { TransactionsTable } from '../components/TransactionsTable'
import { AffiliateMetrics } from '../components/AffiliateMetrics'
import { APIUsageMetrics } from '../components/APIUsageMetrics'
import { MembershipMetrics } from '../components/MembershipMetrics'
import type { DashboardStats } from '../types'

export function Dashboard() {
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date())

  // tRPC hooks
  const { data: dashboardStats, isLoading: statsLoading, refetch: refetchStats } = trpc.dashboard.getStats.useQuery(undefined, {
    refetchInterval: 30000, // Refresh every 30 seconds
  })

  const { data: workflows, isLoading: workflowsLoading, refetch: refetchWorkflows } = trpc.workflows.getAll.useQuery(undefined, {
    refetchInterval: 30000,
  })

  const { data: transactions, isLoading: transactionsLoading } = trpc.transactions.getAll.useQuery(
    { limit: 20 },
    { refetchInterval: 30000 }
  )

  const { data: affiliateMetrics, isLoading: affiliateLoading } = trpc.affiliateMetrics.getAll.useQuery(undefined, {
    refetchInterval: 60000,
  })

  const { data: topPerformers } = trpc.affiliateMetrics.getTopPerformers.useQuery({ limit: 5 }, {
    refetchInterval: 120000,
  })

  const { data: apiUsage, isLoading: apiLoading } = trpc.apiUsage.getAll.useQuery(undefined, {
    refetchInterval: 60000,
  })

  const { data: apiSummary, isLoading: apiSummaryLoading } = trpc.apiUsage.getSummary.useQuery(undefined, {
    refetchInterval: 60000,
  })

  const { data: memberships, isLoading: membershipsLoading } = trpc.memberships.getAll.useQuery(undefined, {
    refetchInterval: 60000,
  })

  const { data: membershipSummary, isLoading: membershipSummaryLoading } = trpc.memberships.getSummary.useQuery(undefined, {
    refetchInterval: 60000,
  })

  // Revenue data (mockup data for chart)
  const revenueData = [
    { date: '2024-01-01', revenue: 1200, transactions: 45, workflows: 3 },
    { date: '2024-01-02', revenue: 1350, transactions: 52, workflows: 3 },
    { date: '2024-01-03', revenue: 1180, transactions: 48, workflows: 4 },
    { date: '2024-01-04', revenue: 1520, transactions: 58, workflows: 4 },
    { date: '2024-01-05', revenue: 1680, transactions: 63, workflows: 4 },
    { date: '2024-01-06', revenue: 1450, transactions: 55, workflows: 5 },
    { date: '2024-01-07', revenue: 1720, transactions: 67, workflows: 5 },
  ]

  const handleRefresh = async () => {
    setIsRefreshing(true)
    setLastUpdated(new Date())
    
    try {
      await Promise.all([
        refetchStats(),
        refetchWorkflows(),
      ])
    } catch (error) {
      console.error('Error refreshing data:', error)
    } finally {
      setIsRefreshing(false)
    }
  }

  const handleStatusChange = (id: number, status: string) => {
    // Here you would call the tRPC mutation to update workflow status
    console.log('Update workflow status:', id, status)
  }

  // Auto-refresh every 5 minutes
  useEffect(() => {
    const interval = setInterval(() => {
      setLastUpdated(new Date())
    }, 300000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <Play className="h-4 w-4 text-white" />
                </div>
                <h1 className="text-xl font-bold text-gray-900">Ecosystem Automation</h1>
              </div>
              <div className="hidden md:flex items-center space-x-2 text-sm text-gray-500">
                <span>Dashboard</span>
                <span>•</span>
                <span>Real-time monitoring</span>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              {/* Status indicator */}
              <div className="hidden sm:flex items-center space-x-2 text-sm text-gray-500">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span>Live</span>
              </div>

              {/* Last updated */}
              <div className="hidden md:block text-sm text-gray-500">
                Updated {lastUpdated.toLocaleTimeString()}
              </div>

              {/* Action buttons */}
              <button
                onClick={handleRefresh}
                disabled={isRefreshing}
                className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
                Refresh
              </button>

              <button className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                <Download className="h-4 w-4 mr-2" />
                Export
              </button>

              <button className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                <Bell className="h-4 w-4" />
              </button>

              <button className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                <Settings className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {/* Stats Cards */}
          <StatsCards stats={dashboardStats} isLoading={statsLoading} />

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <RevenueChart data={revenueData} isLoading={statsLoading} type="line" />
            <RevenueChart data={revenueData} isLoading={statsLoading} type="area" />
          </div>

          {/* Workflow Status */}
          <WorkflowStatus
            workflows={workflows || []}
            isLoading={workflowsLoading}
            onStatusChange={handleStatusChange}
          />

          {/* Tables and Metrics Row */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
            <TransactionsTable
              transactions={transactions || []}
              isLoading={transactionsLoading}
            />
            <AffiliateMetrics
              metrics={affiliateMetrics || []}
              isLoading={affiliateLoading}
              topPerformers={topPerformers}
            />
          </div>

          {/* API and Membership Metrics */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
            <APIUsageMetrics
              apiUsage={apiUsage || []}
              summary={apiSummary}
              isLoading={apiLoading || apiSummaryLoading}
            />
            <MembershipMetrics
              memberships={memberships || []}
              summary={membershipSummary}
              isLoading={membershipsLoading || membershipSummaryLoading}
            />
          </div>

          {/* Additional Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">System Health</h3>
                <div className="h-64 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-300">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <div className="w-8 h-8 bg-green-500 rounded-full animate-pulse"></div>
                    </div>
                    <p className="text-lg font-semibold text-green-700">All Systems Operational</p>
                    <p className="text-sm text-gray-500">8 workflows running smoothly</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Alerts</h3>
              <div className="space-y-3">
                <div className="flex items-start space-x-3 p-3 bg-green-50 rounded-lg">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                  <div>
                    <p className="text-sm font-medium text-green-800">Amazon Workflow Active</p>
                    <p className="text-xs text-green-600">Successfully processed 45 links</p>
                    <p className="text-xs text-gray-500">2 minutes ago</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3 p-3 bg-blue-50 rounded-lg">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                  <div>
                    <p className="text-sm font-medium text-blue-800">Stripe Payment Received</p>
                    <p className="text-xs text-blue-600">$99.00 from Pro subscription</p>
                    <p className="text-xs text-gray-500">5 minutes ago</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3 p-3 bg-yellow-50 rounded-lg">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2"></div>
                  <div>
                    <p className="text-sm font-medium text-yellow-800">API Rate Limit Warning</p>
                    <p className="text-xs text-yellow-600">OpenAI API approaching limit</p>
                    <p className="text-xs text-gray-500">15 minutes ago</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}