import { Activity, Zap, Clock, AlertTriangle, TrendingUp, TrendingDown } from 'lucide-react'
import { formatNumber, formatDuration, formatPercentage } from '../lib/utils'
import type { ApiUsage } from '../types'

interface APIUsageMetricsProps {
  apiUsage: ApiUsage[]
  summary?: {
    totalCalls: number
    successCalls: number
    avgResponseTime: number
    successRate: number
  }
  isLoading: boolean
}

export function APIUsageMetrics({ apiUsage, summary, isLoading }: APIUsageMetricsProps) {
  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">API Usage</h3>
        <div className="space-y-6">
          {/* Overview Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="bg-gray-50 rounded-lg p-4 animate-pulse">
                <div className="h-6 bg-gray-200 rounded w-16 mb-2"></div>
                <div className="h-8 bg-gray-200 rounded w-12"></div>
              </div>
            ))}
          </div>

          {/* Usage Chart Placeholder */}
          <div className="h-64 bg-gray-100 rounded animate-pulse"></div>

          {/* Endpoints Table Placeholder */}
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg animate-pulse">
                <div className="flex items-center space-x-4">
                  <div className="w-8 h-8 bg-gray-200 rounded"></div>
                  <div>
                    <div className="h-4 bg-gray-200 rounded w-32 mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-20"></div>
                  </div>
                </div>
                <div className="flex items-center space-x-6">
                  <div className="h-6 bg-gray-200 rounded w-12"></div>
                  <div className="h-6 bg-gray-200 rounded w-16"></div>
                  <div className="h-6 bg-gray-200 rounded w-14"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  // Calcular métricas por endpoint
  const endpointMetrics = apiUsage.reduce((acc, usage) => {
    const key = `${usage.method} ${usage.endpoint}`
    if (!acc[key]) {
      acc[key] = {
        totalCalls: 0,
        successCalls: 0,
        totalResponseTime: 0,
        errorCount: 0,
        methods: new Set<string>(),
      }
    }
    acc[key].totalCalls += 1
    acc[key].totalResponseTime += usage.responseTime || 0
    if (usage.success === 'true') {
      acc[key].successCalls += 1
    } else {
      acc[key].errorCount += 1
    }
    acc[key].methods.add(usage.method)
    return acc
  }, {} as Record<string, {
    totalCalls: number
    successCalls: number
    totalResponseTime: number
    errorCount: number
    methods: Set<string>
  }>)

  // Métricas generales
  const generalMetrics = {
    totalCalls: apiUsage.length,
    successCalls: apiUsage.filter(u => u.success === 'true').length,
    avgResponseTime: apiUsage.reduce((sum, u) => sum + (u.responseTime || 0), 0) / apiUsage.length || 0,
    successRate: apiUsage.length > 0 ? (apiUsage.filter(u => u.success === 'true').length / apiUsage.length) * 100 : 0,
  }

  const finalSummary = summary || generalMetrics

  // Tendencia de respuesta (simulada)
  const trend = finalSummary.avgResponseTime < 500 ? 'positive' : 'negative'

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">API Usage</h3>
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <Activity className="h-4 w-4" />
          <span>Real-time monitoring</span>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-blue-50 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <Zap className="h-5 w-5 text-blue-600" />
            <span className="text-sm font-medium text-blue-900">Total Calls</span>
          </div>
          <p className="text-2xl font-bold text-blue-900">{formatNumber(finalSummary.totalCalls)}</p>
          <div className="flex items-center mt-1">
            {trend === 'positive' ? (
              <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
            ) : (
              <TrendingDown className="h-4 w-4 text-red-500 mr-1" />
            )}
            <span className={`text-xs ${trend === 'positive' ? 'text-green-600' : 'text-red-600'}`}>
              {finalSummary.successRate > 95 ? 'Excellent' : finalSummary.successRate > 90 ? 'Good' : 'Needs attention'}
            </span>
          </div>
        </div>

        <div className="bg-green-50 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <Activity className="h-5 w-5 text-green-600" />
            <span className="text-sm font-medium text-green-900">Success Rate</span>
          </div>
          <p className="text-2xl font-bold text-green-900">
            {formatPercentage(finalSummary.successRate)}
          </p>
          <div className="w-full bg-green-200 rounded-full h-2 mt-2">
            <div
              className="bg-green-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${finalSummary.successRate}%` }}
            ></div>
          </div>
        </div>

        <div className="bg-purple-50 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <Clock className="h-5 w-5 text-purple-600" />
            <span className="text-sm font-medium text-purple-900">Avg Response</span>
          </div>
          <p className="text-2xl font-bold text-purple-900">
            {formatDuration(finalSummary.avgResponseTime)}
          </p>
          <div className="flex items-center mt-1">
            <span className={`text-xs ${
              finalSummary.avgResponseTime < 500 ? 'text-green-600' : 
              finalSummary.avgResponseTime < 1000 ? 'text-yellow-600' : 'text-red-600'
            }`}>
              {finalSummary.avgResponseTime < 500 ? 'Fast' : 
               finalSummary.avgResponseTime < 1000 ? 'Medium' : 'Slow'}
            </span>
          </div>
        </div>

        <div className="bg-red-50 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <AlertTriangle className="h-5 w-5 text-red-600" />
            <span className="text-sm font-medium text-red-900">Errors</span>
          </div>
          <p className="text-2xl font-bold text-red-900">
            {formatNumber(finalSummary.totalCalls - finalSummary.successCalls)}
          </p>
          <div className="flex items-center mt-1">
            <span className="text-xs text-red-600">
              {finalSummary.totalCalls > 0 ? 
                formatPercentage(((finalSummary.totalCalls - finalSummary.successCalls) / finalSummary.totalCalls) * 100)
                : '0%'
              } error rate
            </span>
          </div>
        </div>
      </div>

      {/* Usage Chart (Mockup) */}
      <div className="mb-6">
        <h4 className="text-md font-semibold text-gray-900 mb-4">API Calls Over Time</h4>
        <div className="h-64 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-300">
          <div className="text-center">
            <Activity className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <p className="text-sm text-gray-500">API usage chart</p>
            <p className="text-xs text-gray-400">Real-time visualization coming soon</p>
          </div>
        </div>
      </div>

      {/* Top Endpoints */}
      <div>
        <h4 className="text-md font-semibold text-gray-900 mb-4">Top Endpoints</h4>
        <div className="space-y-3">
          {Object.entries(endpointMetrics)
            .sort(([, a], [, b]) => b.totalCalls - a.totalCalls)
            .slice(0, 10)
            .map(([endpoint, metrics], index) => {
              const successRate = (metrics.successCalls / metrics.totalCalls) * 100
              const avgResponseTime = metrics.totalResponseTime / metrics.totalCalls
              
              return (
                <div key={endpoint} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-150">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center justify-center w-8 h-8 bg-blue-100 text-blue-600 rounded-full text-sm font-medium">
                      #{index + 1}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900 flex items-center space-x-2">
                        <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded">
                          {[...metrics.methods][0]}
                        </span>
                        <span className="font-mono text-xs">{endpoint}</span>
                      </p>
                      <p className="text-xs text-gray-500">{metrics.totalCalls} calls</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-6 text-sm">
                    <div className="text-center">
                      <p className="font-medium text-gray-900">{formatNumber(metrics.totalCalls)}</p>
                      <p className="text-xs text-gray-500">Calls</p>
                    </div>
                    
                    <div className="text-center">
                      <p className={`font-medium ${
                        successRate >= 95 ? 'text-green-600' : 
                        successRate >= 90 ? 'text-yellow-600' : 'text-red-600'
                      }`}>
                        {formatPercentage(successRate)}
                      </p>
                      <p className="text-xs text-gray-500">Success</p>
                    </div>
                    
                    <div className="text-center">
                      <p className={`font-medium ${
                        avgResponseTime < 500 ? 'text-green-600' : 
                        avgResponseTime < 1000 ? 'text-yellow-600' : 'text-red-600'
                      }`}>
                        {formatDuration(avgResponseTime)}
                      </p>
                      <p className="text-xs text-gray-500">Avg Time</p>
                    </div>
                    
                    <div className="text-center">
                      <p className="font-medium text-gray-900">{metrics.errorCount}</p>
                      <p className="text-xs text-gray-500">Errors</p>
                    </div>
                  </div>
                </div>
              )
            })}
        </div>
      </div>

      {apiUsage.length === 0 && (
        <div className="text-center py-12">
          <Activity className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No API usage data</h3>
          <p className="mt-1 text-sm text-gray-500">
            API usage metrics will appear here once your workflows start making external API calls.
          </p>
        </div>
      )}
    </div>
  )
}