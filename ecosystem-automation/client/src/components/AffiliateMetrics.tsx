import { TrendingUp, Target, MousePointer, DollarSign } from 'lucide-react'
import { formatCurrency, formatNumber, formatPercentage } from '../lib/utils'
import type { AffiliateMetric } from '../types'

interface AffiliateMetricsProps {
  metrics: AffiliateMetric[]
  isLoading: boolean
  topPerformers?: Array<{
    trackingId: string
    region: string
    totalRevenue: number
    totalConversions: number
    avgConversionRate: number
  }>
}

export function AffiliateMetrics({ metrics, isLoading, topPerformers }: AffiliateMetricsProps) {
  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Affiliate Performance</h3>
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="border border-gray-200 rounded-lg p-4 animate-pulse">
              <div className="flex items-center justify-between mb-4">
                <div className="h-4 bg-gray-200 rounded w-32"></div>
                <div className="h-6 bg-gray-200 rounded w-16"></div>
              </div>
              <div className="grid grid-cols-4 gap-4">
                {Array.from({ length: 4 }).map((_, j) => (
                  <div key={j} className="text-center">
                    <div className="h-6 bg-gray-200 rounded w-12 mx-auto mb-1"></div>
                    <div className="h-3 bg-gray-200 rounded w-16 mx-auto"></div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  // Calcular totales
  const totals = metrics.reduce(
    (acc, metric) => ({
      clicks: acc.clicks + metric.clicks,
      conversions: acc.conversions + metric.conversions,
      revenue: acc.revenue + Number(metric.revenue),
      impressions: acc.impressions + metric.impressions,
    }),
    { clicks: 0, conversions: 0, revenue: 0, impressions: 0 }
  )

  const overallConversionRate = totals.impressions > 0 
    ? (totals.conversions / totals.impressions) * 100 
    : 0

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Affiliate Performance</h3>
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <span>Tracking IDs: {new Set(metrics.map(m => m.trackingId)).size}</span>
          <span>•</span>
          <span>Regions: {new Set(metrics.map(m => m.region)).size}</span>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-blue-50 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <MousePointer className="h-5 w-5 text-blue-600" />
            <span className="text-sm font-medium text-blue-900">Total Clicks</span>
          </div>
          <p className="text-2xl font-bold text-blue-900">{formatNumber(totals.clicks)}</p>
        </div>

        <div className="bg-green-50 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <Target className="h-5 w-5 text-green-600" />
            <span className="text-sm font-medium text-green-900">Conversions</span>
          </div>
          <p className="text-2xl font-bold text-green-900">{formatNumber(totals.conversions)}</p>
        </div>

        <div className="bg-purple-50 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <TrendingUp className="h-5 w-5 text-purple-600" />
            <span className="text-sm font-medium text-purple-900">Conv. Rate</span>
          </div>
          <p className="text-2xl font-bold text-purple-900">{formatPercentage(overallConversionRate)}</p>
        </div>

        <div className="bg-yellow-50 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <DollarSign className="h-5 w-5 text-yellow-600" />
            <span className="text-sm font-medium text-yellow-900">Revenue</span>
          </div>
          <p className="text-2xl font-bold text-yellow-900">{formatCurrency(totals.revenue)}</p>
        </div>
      </div>

      {/* Top Performers */}
      {topPerformers && topPerformers.length > 0 && (
        <div className="mb-6">
          <h4 className="text-md font-semibold text-gray-900 mb-4">Top Performers</h4>
          <div className="space-y-3">
            {topPerformers.slice(0, 5).map((performer, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="flex items-center justify-center w-6 h-6 bg-blue-100 text-blue-600 rounded-full text-xs font-medium">
                    {index + 1}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {performer.trackingId.substring(0, 12)}...
                    </p>
                    <p className="text-xs text-gray-500">{performer.region}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-6 text-sm">
                  <div className="text-center">
                    <p className="font-medium text-gray-900">
                      {formatCurrency(Number(performer.totalRevenue))}
                    </p>
                    <p className="text-xs text-gray-500">Revenue</p>
                  </div>
                  <div className="text-center">
                    <p className="font-medium text-gray-900">
                      {formatNumber(performer.totalConversions)}
                    </p>
                    <p className="text-xs text-gray-500">Conversions</p>
                  </div>
                  <div className="text-center">
                    <p className="font-medium text-gray-900">
                      {formatPercentage(Number(performer.avgConversionRate))}
                    </p>
                    <p className="text-xs text-gray-500">Rate</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Performance by Region */}
      <div>
        <h4 className="text-md font-semibold text-gray-900 mb-4">Performance by Region</h4>
        <div className="space-y-3">
          {Object.entries(
            metrics.reduce((acc, metric) => {
              if (!acc[metric.region]) {
                acc[metric.region] = {
                  clicks: 0,
                  conversions: 0,
                  revenue: 0,
                  impressions: 0,
                }
              }
              acc[metric.region].clicks += metric.clicks
              acc[metric.region].conversions += metric.conversions
              acc[metric.region].revenue += Number(metric.revenue)
              acc[metric.region].impressions += metric.impressions
              return acc
            }, {} as Record<string, { clicks: number; conversions: number; revenue: number; impressions: number }>)
          ).map(([region, data]) => {
            const conversionRate = data.impressions > 0 ? (data.conversions / data.impressions) * 100 : 0
            return (
              <div key={region} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded flex items-center justify-center">
                    <span className="text-white text-xs font-bold">{region}</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{region} Region</p>
                    <p className="text-xs text-gray-500">{formatNumber(data.impressions)} impressions</p>
                  </div>
                </div>
                <div className="flex items-center space-x-6 text-sm">
                  <div className="text-center">
                    <p className="font-medium text-gray-900">{formatNumber(data.clicks)}</p>
                    <p className="text-xs text-gray-500">Clicks</p>
                  </div>
                  <div className="text-center">
                    <p className="font-medium text-gray-900">{formatNumber(data.conversions)}</p>
                    <p className="text-xs text-gray-500">Conversions</p>
                  </div>
                  <div className="text-center">
                    <p className="font-medium text-gray-900">{formatPercentage(conversionRate)}</p>
                    <p className="text-xs text-gray-500">Rate</p>
                  </div>
                  <div className="text-center">
                    <p className="font-medium text-gray-900">{formatCurrency(data.revenue)}</p>
                    <p className="text-xs text-gray-500">Revenue</p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {metrics.length === 0 && (
        <div className="text-center py-12">
          <Target className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No affiliate data</h3>
          <p className="mt-1 text-sm text-gray-500">
            Affiliate performance metrics will appear here once your Amazon workflows start generating traffic.
          </p>
        </div>
      )}
    </div>
  )
}