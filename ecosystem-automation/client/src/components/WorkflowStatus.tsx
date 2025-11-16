import { Play, Pause, AlertCircle, CheckCircle, Clock, Zap } from 'lucide-react'
import { formatDuration, formatRelativeTime, getStatusColor } from '../lib/utils'
import type { Workflow } from '../types'

interface WorkflowStatusProps {
  workflows: Workflow[]
  isLoading: boolean
  onStatusChange?: (id: number, status: string) => void
}

export function WorkflowStatus({ workflows, isLoading, onStatusChange }: WorkflowStatusProps) {
  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Workflow Status</h3>
        <div className="space-y-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg animate-pulse">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
                <div>
                  <div className="h-4 bg-gray-200 rounded w-32 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-24"></div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <div className="h-6 bg-gray-200 rounded w-16"></div>
                <div className="h-8 bg-gray-200 rounded w-8"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <Play className="h-4 w-4 text-green-600" />
      case 'inactive':
        return <Pause className="h-4 w-4 text-gray-600" />
      case 'error':
        return <AlertCircle className="h-4 w-4 text-red-600" />
      case 'processing':
        return <Clock className="h-4 w-4 text-blue-600 animate-spin" />
      default:
        return <Zap className="h-4 w-4 text-gray-600" />
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active':
        return 'Active'
      case 'inactive':
        return 'Inactive'
      case 'error':
        return 'Error'
      case 'processing':
        return 'Processing'
      default:
        return 'Unknown'
    }
  }

  const getStatusBadge = (status: string) => {
    const colorClass = getStatusColor(status)
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${colorClass}`}>
        {getStatusIcon(status)}
        <span className="ml-1">{getStatusText(status)}</span>
      </span>
    )
  }

  const handleStatusToggle = (workflow: Workflow) => {
    if (onStatusChange) {
      const newStatus = workflow.status === 'active' ? 'inactive' : 'active'
      onStatusChange(workflow.id, newStatus)
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Workflow Status</h3>
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <span>Total: {workflows.length}</span>
          <span>•</span>
          <span className="text-green-600">
            Active: {workflows.filter(w => w.status === 'active').length}
          </span>
          <span>•</span>
          <span className="text-red-600">
            Errors: {workflows.filter(w => w.status === 'error').length}
          </span>
        </div>
      </div>

      <div className="space-y-3">
        {workflows.map((workflow) => (
          <div
            key={workflow.id}
            className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:shadow-sm transition-shadow duration-200"
          >
            <div className="flex items-center space-x-4 flex-1">
              <div className="flex-shrink-0">
                {getStatusIcon(workflow.status)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-3">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {workflow.name}
                  </p>
                  {getStatusBadge(workflow.status)}
                </div>
                {workflow.description && (
                  <p className="text-sm text-gray-600 mt-1 line-clamp-1">
                    {workflow.description}
                  </p>
                )}
                <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                  <span>
                    Last run: {workflow.lastRun 
                      ? formatRelativeTime(workflow.lastRun)
                      : 'Never'
                    }
                  </span>
                  {workflow.executionCount > 0 && (
                    <>
                      <span>•</span>
                      <span>{workflow.executionCount} executions</span>
                    </>
                  )}
                  {workflow.avgExecutionTime > 0 && (
                    <>
                      <span>•</span>
                      <span>Avg: {formatDuration(workflow.avgExecutionTime)}</span>
                    </>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              {/* Success Rate */}
              {Number(workflow.successRate) > 0 && (
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">
                    {Number(workflow.successRate).toFixed(1)}%
                  </p>
                  <p className="text-xs text-gray-500">Success Rate</p>
                </div>
              )}

              {/* Next Run */}
              {workflow.nextRun && (
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">
                    {formatRelativeTime(workflow.nextRun)}
                  </p>
                  <p className="text-xs text-gray-500">Next Run</p>
                </div>
              )}

              {/* Action Button */}
              <button
                onClick={() => handleStatusToggle(workflow)}
                className={`flex items-center justify-center w-8 h-8 rounded-full transition-colors duration-200 ${
                  workflow.status === 'active'
                    ? 'bg-red-100 hover:bg-red-200 text-red-600'
                    : 'bg-green-100 hover:bg-green-200 text-green-600'
                }`}
                title={workflow.status === 'active' ? 'Stop workflow' : 'Start workflow'}
              >
                {workflow.status === 'active' ? (
                  <Pause className="h-4 w-4" />
                ) : (
                  <Play className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>
        ))}
      </div>

      {workflows.length === 0 && (
        <div className="text-center py-12">
          <Zap className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No workflows</h3>
          <p className="mt-1 text-sm text-gray-500">
            Get started by creating your first automation workflow.
          </p>
        </div>
      )}
    </div>
  )
}