export type WorkflowStatus = 'active' | 'inactive' | 'error' | 'processing'
export type TransactionType = 'revenue' | 'expense' | 'commission' | 'refund'
export type TransactionStatus = 'pending' | 'completed' | 'failed' | 'cancelled'
export type MembershipTier = 'basic' | 'pro' | 'enterprise'
export type MembershipStatus = 'active' | 'cancelled' | 'expired'
export type AlertSeverity = 'low' | 'medium' | 'high' | 'critical'
export type AlertType = 'error' | 'warning' | 'info' | 'success'

export interface DashboardStats {
  totalRevenue: number
  activeWorkflows: number
  totalTransactions: number
  successRate: number
  todayRevenue: number
  monthRevenue: number
  apiCalls: number
  activeMembers: number
}

export interface WorkflowExecution {
  id: string
  workflowId: number
  status: 'running' | 'completed' | 'failed'
  startTime: Date
  endTime?: Date
  duration?: number
  output?: any
  error?: string
}

export interface RevenueData {
  date: string
  revenue: number
  transactions: number
  workflows: number
}

export interface AffiliatePerformance {
  trackingId: string
  region: string
  clicks: number
  conversions: number
  revenue: number
  conversionRate: number
  performanceScore: number
}

export interface ApiMetric {
  endpoint: string
  method: string
  calls: number
  avgResponseTime: number
  successRate: number
  errors: number
}

export interface MembershipData {
  tier: MembershipTier
  count: number
  revenue: number
  churnRate: number
}

export interface AlertData {
  id: number
  workflowId: number
  type: AlertType
  title: string
  message: string
  severity: AlertSeverity
  status: 'active' | 'acknowledged' | 'resolved'
  createdAt: Date
  acknowledgedAt?: Date
  resolvedAt?: Date
}

export interface WebhookEventData {
  id: number
  workflowId: number
  source: string
  eventType: string
  payload: any
  status: 'pending' | 'processed' | 'failed'
  createdAt: Date
  processedAt?: Date
}

export interface RealTimeMetricData {
  id: number
  workflowId: number
  metricType: string
  value: number
  unit: string
  timestamp: Date
}

export interface AmazonTrackingData {
  id: number
  trackingId: string
  region: string
  status: string
  performanceScore: number
  totalClicks: number
  totalConversions: number
  totalRevenue: number
  usageCount: number
  lastUsed?: Date
}