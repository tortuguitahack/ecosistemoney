import { TrendingUp, DollarSign, Activity, CheckCircle, Users, BarChart3 } from 'lucide-react'
import { formatCurrency, formatNumber } from '../lib/utils'
import type { DashboardStats } from '../types'

interface StatsCardsProps {
  stats: DashboardStats | undefined
  isLoading: boolean
}

export function StatsCards({ stats, isLoading }: StatsCardsProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="bg-white rounded-lg shadow p-6 animate-pulse">
            <div className="flex items-center">
              <div className="rounded-full bg-gray-200 h-12 w-12"></div>
              <div className="ml-4 flex-1">
                <div className="h-4 bg-gray-200 rounded w-20 mb-2"></div>
                <div className="h-6 bg-gray-200 rounded w-16"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  const cards = [
    {
      title: 'Total Revenue',
      value: formatCurrency(stats?.totalRevenue || 0),
      icon: DollarSign,
      change: '+12.5%',
      changeType: 'positive' as const,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      title: 'Active Workflows',
      value: stats?.activeWorkflows || 0,
      icon: Activity,
      change: '+2',
      changeType: 'positive' as const,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      title: 'Today Revenue',
      value: formatCurrency(stats?.todayRevenue || 0),
      icon: TrendingUp,
      change: '+8.2%',
      changeType: 'positive' as const,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
    },
    {
      title: 'Success Rate',
      value: `${stats?.successRate?.toFixed(1) || 0}%`,
      icon: CheckCircle,
      change: '+0.5%',
      changeType: 'positive' as const,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-50',
    },
    {
      title: 'Total Transactions',
      value: formatNumber(stats?.totalTransactions || 0),
      icon: BarChart3,
      change: '+15',
      changeType: 'positive' as const,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
    },
    {
      title: 'Month Revenue',
      value: formatCurrency(stats?.monthRevenue || 0),
      icon: Users,
      change: '+18.9%',
      changeType: 'positive' as const,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50',
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
      {cards.map((card, index) => {
        const Icon = card.icon
        return (
          <div
            key={index}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200"
          >
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600 mb-1">
                  {card.title}
                </p>
                <p className="text-2xl font-bold text-gray-900 mb-1">
                  {card.value}
                </p>
                <div className="flex items-center text-sm">
                  <span
                    className={`font-medium ${
                      card.changeType === 'positive'
                        ? 'text-green-600'
                        : 'text-red-600'
                    }`}
                  >
                    {card.change}
                  </span>
                  <span className="text-gray-500 ml-1">vs last month</span>
                </div>
              </div>
              <div
                className={`${card.bgColor} rounded-lg p-3 ${card.color} flex-shrink-0`}
              >
                <Icon className="h-6 w-6" />
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}