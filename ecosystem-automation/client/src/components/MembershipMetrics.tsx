import { Users, Crown, Building, Star, TrendingUp, DollarSign } from 'lucide-react'
import { formatCurrency, formatNumber } from '../lib/utils'
import type { Membership } from '../types'

interface MembershipMetricsProps {
  memberships: Membership[]
  summary?: {
    basic: number
    pro: number
    enterprise: number
  }
  isLoading: boolean
}

export function MembershipMetrics({ memberships, summary, isLoading }: MembershipMetricsProps) {
  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Membership Metrics</h3>
        <div className="space-y-6">
          {/* Tier Cards */}
          <div className="grid grid-cols-3 gap-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="bg-gray-50 rounded-lg p-4 animate-pulse">
                <div className="h-6 bg-gray-200 rounded w-16 mb-2"></div>
                <div className="h-8 bg-gray-200 rounded w-12"></div>
              </div>
            ))}
          </div>
          {/* Chart placeholder */}
          <div className="h-48 bg-gray-100 rounded animate-pulse"></div>
        </div>
      </div>
    )
  }

  // Calcular distribución por tier
  const tierDistribution = {
    basic: memberships.filter(m => m.tier === 'basic').length,
    pro: memberships.filter(m => m.tier === 'pro').length,
    enterprise: memberships.filter(m => m.tier === 'enterprise').length,
  }

  const finalSummary = summary || tierDistribution

  // Calcular revenue por tier
  const revenueByTier = {
    basic: memberships
      .filter(m => m.tier === 'basic')
      .reduce((sum, m) => sum + Number(m.amount), 0),
    pro: memberships
      .filter(m => m.tier === 'pro')
      .reduce((sum, m) => sum + Number(m.amount), 0),
    enterprise: memberships
      .filter(m => m.tier === 'enterprise')
      .reduce((sum, m) => sum + Number(m.amount), 0),
  }

  const totalMembers = finalSummary.basic + finalSummary.pro + finalSummary.enterprise
  const totalRevenue = revenueByTier.basic + revenueByTier.pro + revenueByTier.enterprise

  // Calcular métricas de churn (simuladas)
  const activeMemberships = memberships.filter(m => m.status === 'active').length
  const churnRate = totalMembers > 0 ? ((totalMembers - activeMemberships) / totalMembers) * 100 : 0

  const tierData = [
    {
      tier: 'basic',
      name: 'Basic',
      icon: Star,
      count: finalSummary.basic,
      revenue: revenueByTier.basic,
      color: 'blue',
      bgColor: 'bg-blue-50',
      iconColor: 'text-blue-600',
      price: '$29/month',
    },
    {
      tier: 'pro',
      name: 'Pro',
      icon: Crown,
      count: finalSummary.pro,
      revenue: revenueByTier.pro,
      color: 'purple',
      bgColor: 'bg-purple-50',
      iconColor: 'text-purple-600',
      price: '$99/month',
    },
    {
      tier: 'enterprise',
      name: 'Enterprise',
      icon: Building,
      count: finalSummary.enterprise,
      revenue: revenueByTier.enterprise,
      color: 'gold',
      bgColor: 'bg-yellow-50',
      iconColor: 'text-yellow-600',
      price: '$299/month',
    },
  ]

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Membership Metrics</h3>
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <Users className="h-4 w-4" />
          <span>{totalMembers} total members</span>
        </div>
      </div>

      {/* Tier Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        {tierData.map((tier) => {
          const Icon = tier.icon
          const percentage = totalMembers > 0 ? (tier.count / totalMembers) * 100 : 0
          
          return (
            <div
              key={tier.tier}
              className={`${tier.bgColor} rounded-lg p-6 border-2 border-transparent hover:border-gray-200 transition-all duration-200`}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className={`${tier.bgColor} rounded-lg p-2 ${tier.iconColor}`}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900">{tier.name}</h4>
                    <p className="text-sm text-gray-600">{tier.price}</p>
                  </div>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Members</span>
                  <span className="text-xl font-bold text-gray-900">{tier.count}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Share</span>
                  <span className="text-lg font-semibold text-gray-900">{percentage.toFixed(1)}%</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Revenue</span>
                  <span className="text-xl font-bold text-gray-900">
                    {formatCurrency(tier.revenue)}
                  </span>
                </div>
                
                <div className="w-full bg-white bg-opacity-50 rounded-full h-2">
                  <div
                    className={`bg-${tier.color}-600 h-2 rounded-full transition-all duration-300`}
                    style={{ width: `${Math.min(percentage, 100)}%` }}
                  ></div>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Summary Statistics */}
      <div className="bg-gray-50 rounded-lg p-6 mb-6">
        <h4 className="text-md font-semibold text-gray-900 mb-4">Summary</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-2 mb-2">
              <Users className="h-5 w-5 text-blue-600" />
              <span className="text-sm font-medium text-gray-700">Total Members</span>
            </div>
            <p className="text-2xl font-bold text-gray-900">{formatNumber(totalMembers)}</p>
          </div>
          
          <div className="text-center">
            <div className="flex items-center justify-center space-x-2 mb-2">
              <DollarSign className="h-5 w-5 text-green-600" />
              <span className="text-sm font-medium text-gray-700">Total Revenue</span>
            </div>
            <p className="text-2xl font-bold text-gray-900">{formatCurrency(totalRevenue)}</p>
          </div>
          
          <div className="text-center">
            <div className="flex items-center justify-center space-x-2 mb-2">
              <TrendingUp className="h-5 w-5 text-purple-600" />
              <span className="text-sm font-medium text-gray-700">Active</span>
            </div>
            <p className="text-2xl font-bold text-gray-900">{formatNumber(activeMemberships)}</p>
          </div>
          
          <div className="text-center">
            <div className="flex items-center justify-center space-x-2 mb-2">
              <TrendingUp className="h-5 w-5 text-red-600" />
              <span className="text-sm font-medium text-gray-700">Churn Rate</span>
            </div>
            <p className="text-2xl font-bold text-gray-900">{churnRate.toFixed(1)}%</p>
          </div>
        </div>
      </div>

      {/* Growth Chart (Mockup) */}
      <div>
        <h4 className="text-md font-semibold text-gray-900 mb-4">Member Growth</h4>
        <div className="h-48 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-300">
          <div className="text-center">
            <TrendingUp className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <p className="text-sm text-gray-500">Member growth chart</p>
            <p className="text-xs text-gray-400">Historical data visualization</p>
          </div>
        </div>
      </div>

      {/* Recent Memberships */}
      {memberships.length > 0 && (
        <div className="mt-6">
          <h4 className="text-md font-semibold text-gray-900 mb-4">Recent Memberships</h4>
          <div className="space-y-3">
            {memberships
              .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
              .slice(0, 5)
              .map((membership) => {
                const tier = tierData.find(t => t.tier === membership.tier)
                const Icon = tier?.icon || Star
                
                return (
                  <div key={membership.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className={`${tier?.bgColor} rounded-lg p-2 ${tier?.iconColor}`}>
                        <Icon className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {tier?.name} Member
                        </p>
                        <p className="text-xs text-gray-500">
                          {new Date(membership.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900">
                        {formatCurrency(Number(membership.amount))}
                      </p>
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                        membership.status === 'active' 
                          ? 'bg-green-100 text-green-800'
                          : membership.status === 'cancelled'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {membership.status}
                      </span>
                    </div>
                  </div>
                )
              })}
          </div>
        </div>
      )}

      {memberships.length === 0 && (
        <div className="text-center py-12">
          <Users className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No memberships</h3>
          <p className="mt-1 text-sm text-gray-500">
            Membership data will appear here once users start subscribing to your workflows.
          </p>
        </div>
      )}
    </div>
  )
}