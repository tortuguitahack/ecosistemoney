import { useState } from 'react'
import { ChevronDown, ChevronUp, DollarSign, ArrowUpRight, ArrowDownRight, ExternalLink } from 'lucide-react'
import { formatCurrency, formatRelativeTime, getStatusColor } from '../lib/utils'
import type { Transaction } from '../types'

interface TransactionsTableProps {
  transactions: Transaction[]
  isLoading: boolean
}

type SortField = 'createdAt' | 'amount' | 'status'
type SortDirection = 'asc' | 'desc'

export function TransactionsTable({ transactions, isLoading }: TransactionsTableProps) {
  const [sortField, setSortField] = useState<SortField>('createdAt')
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc')

  const handleSort = (field: SortField) => {
    if (field === sortField) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDirection('desc')
    }
  }

  const sortedTransactions = [...transactions].sort((a, b) => {
    let aValue: any = a[sortField]
    let bValue: any = b[sortField]

    if (sortField === 'createdAt') {
      aValue = new Date(aValue).getTime()
      bValue = new Date(bValue).getTime()
    }

    if (sortField === 'amount') {
      aValue = Number(aValue)
      bValue = Number(bValue)
    }

    if (sortDirection === 'asc') {
      return aValue < bValue ? -1 : aValue > bValue ? 1 : 0
    } else {
      return aValue > bValue ? -1 : aValue < bValue ? 1 : 0
    }
  })

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'revenue':
        return <ArrowUpRight className="h-4 w-4 text-green-600" />
      case 'expense':
        return <ArrowDownRight className="h-4 w-4 text-red-600" />
      case 'commission':
        return <DollarSign className="h-4 w-4 text-blue-600" />
      case 'refund':
        return <ArrowDownRight className="h-4 w-4 text-orange-600" />
      default:
        return <DollarSign className="h-4 w-4 text-gray-600" />
    }
  }

  const getTransactionTypeText = (type: string) => {
    switch (type) {
      case 'revenue':
        return 'Revenue'
      case 'expense':
        return 'Expense'
      case 'commission':
        return 'Commission'
      case 'refund':
        return 'Refund'
      default:
        return type.charAt(0).toUpperCase() + type.slice(1)
    }
  }

  const SortButton = ({ field, children }: { field: SortField; children: React.ReactNode }) => (
    <button
      onClick={() => handleSort(field)}
      className="flex items-center space-x-1 text-left w-full hover:text-gray-900 transition-colors duration-200"
    >
      <span>{children}</span>
      {sortField === field && (
        sortDirection === 'asc' ? 
          <ChevronUp className="h-3 w-3" /> : 
          <ChevronDown className="h-3 w-3" />
      )}
    </button>
  )

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Transactions</h3>
        <div className="space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg animate-pulse">
              <div className="flex items-center space-x-4">
                <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
                <div>
                  <div className="h-4 bg-gray-200 rounded w-32 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-24"></div>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="h-6 bg-gray-200 rounded w-16"></div>
                <div className="h-6 bg-gray-200 rounded w-20"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Recent Transactions</h3>
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <span>Total: {transactions.length}</span>
          <span>•</span>
          <span className="text-green-600">
            Revenue: {transactions.filter(t => t.type === 'revenue').length}
          </span>
          <span>•</span>
          <span className="text-red-600">
            Expenses: {transactions.filter(t => t.type === 'expense').length}
          </span>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-3 px-4 font-medium text-gray-700">
                <SortButton field="createdAt">Date</SortButton>
              </th>
              <th className="text-left py-3 px-4 font-medium text-gray-700">Type</th>
              <th className="text-left py-3 px-4 font-medium text-gray-700">Source</th>
              <th className="text-left py-3 px-4 font-medium text-gray-700">Description</th>
              <th className="text-right py-3 px-4 font-medium text-gray-700">
                <SortButton field="amount">Amount</SortButton>
              </th>
              <th className="text-center py-3 px-4 font-medium text-gray-700">
                <SortButton field="status">Status</SortButton>
              </th>
              <th className="text-center py-3 px-4 font-medium text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody>
            {sortedTransactions.map((transaction) => (
              <tr
                key={transaction.id}
                className="border-b border-gray-100 hover:bg-gray-50 transition-colors duration-150"
              >
                <td className="py-4 px-4">
                  <div className="text-sm">
                    <p className="font-medium text-gray-900">
                      {formatRelativeTime(transaction.createdAt)}
                    </p>
                    <p className="text-gray-500">
                      {new Date(transaction.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </td>
                <td className="py-4 px-4">
                  <div className="flex items-center space-x-2">
                    {getTransactionIcon(transaction.type)}
                    <span className="text-sm font-medium text-gray-900">
                      {getTransactionTypeText(transaction.type)}
                    </span>
                  </div>
                </td>
                <td className="py-4 px-4">
                  <div className="flex items-center space-x-1">
                    <span className="text-sm text-gray-600 capitalize">
                      {transaction.source}
                    </span>
                    {transaction.sourceId && (
                      <ExternalLink className="h-3 w-3 text-gray-400" />
                    )}
                  </div>
                </td>
                <td className="py-4 px-4">
                  <p className="text-sm text-gray-900 max-w-xs truncate">
                    {transaction.description || 'No description'}
                  </p>
                </td>
                <td className="py-4 px-4 text-right">
                  <span className={`text-sm font-medium ${
                    transaction.type === 'revenue' || transaction.type === 'commission'
                      ? 'text-green-600'
                      : 'text-red-600'
                  }`}>
                    {transaction.type === 'expense' || transaction.type === 'refund' ? '-' : '+'}
                    {formatCurrency(Number(transaction.amount), transaction.currency)}
                  </span>
                </td>
                <td className="py-4 px-4 text-center">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                    getStatusColor(transaction.status)
                  }`}>
                    {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                  </span>
                </td>
                <td className="py-4 px-4 text-center">
                  <button
                    className="text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors duration-200"
                    title="View details"
                  >
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {transactions.length === 0 && (
        <div className="text-center py-12">
          <DollarSign className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No transactions</h3>
          <p className="mt-1 text-sm text-gray-500">
            Transaction data will appear here once your workflows start generating revenue.
          </p>
        </div>
      )}
    </div>
  )
}