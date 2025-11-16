import { mysqlTable, varchar, int, decimal, datetime, boolean, text, json, timestamp, index } from 'drizzle-orm/mysql-core';
import { relations } from 'drizzle-orm';

// Workflows Table
export const workflows = mysqlTable('workflows', {
  id: varchar('id', { length: 255 }).primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  description: text('description'),
  category: varchar('category', { length: 100 }).notNull(),
  status: varchar('status', { length: 50 }).notNull().default('inactive'),
  frequency: varchar('frequency', { length: 50 }).notNull(),
  lastRunAt: datetime('last_run_at'),
  nextRunAt: datetime('next_run_at'),
  successRate: decimal('success_rate', { precision: 5, scale: 2 }).default('0.00'),
  totalRuns: int('total_runs').default(0),
  configuration: json('configuration'),
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow().onUpdateNow()
}, (table) => ({
  statusIdx: index('workflows_status_idx').on(table.status),
  categoryIdx: index('workflows_category_idx').on(table.category),
  activeIdx: index('workflows_active_idx').on(table.isActive)
}));

// Transactions Table
export const transactions = mysqlTable('transactions', {
  id: varchar('id', { length: 255 }).primaryKey(),
  type: varchar('type', { length: 100 }).notNull(),
  amount: decimal('amount', { precision: 12, scale: 2 }).notNull(),
  currency: varchar('currency', { length: 10 }).notNull().default('USD'),
  status: varchar('status', { length: 50 }).notNull(),
  workflowId: varchar('workflow_id', { length: 255 }).notNull(),
  stripeTransactionId: varchar('stripe_transaction_id', { length: 255 }),
  paymentMethod: varchar('payment_method', { length: 50 }),
  metadata: json('metadata'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow().onUpdateNow()
}, (table) => ({
  typeIdx: index('transactions_type_idx').on(table.type),
  statusIdx: index('transactions_status_idx').on(table.status),
  workflowIdx: index('transactions_workflow_idx').on(table.workflowId),
  amountIdx: index('transactions_amount_idx').on(table.amount)
}));

// Affiliate Metrics Table
export const affiliateMetrics = mysqlTable('affiliate_metrics', {
  id: varchar('id', { length: 255 }).primaryKey(),
  region: varchar('region', { length: 10 }).notNull(),
  trackingId: varchar('tracking_id', { length: 255 }).notNull(),
  clicks: int('clicks').default(0),
  conversions: int('conversions').default(0),
  revenue: decimal('revenue', { precision: 12, scale: 2 }).default('0.00'),
  commission: decimal('commission', { precision: 12, scale: 2 }).default('0.00'),
  conversionRate: decimal('conversion_rate', { precision: 5, scale: 2 }).default('0.00'),
  averageOrderValue: decimal('average_order_value', { precision: 10, scale: 2 }).default('0.00'),
  date: datetime('date').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow().onUpdateNow()
}, (table) => ({
  regionIdx: index('affiliate_metrics_region_idx').on(table.region),
  trackingIdx: index('affiliate_metrics_tracking_idx').on(table.trackingId),
  dateIdx: index('affiliate_metrics_date_idx').on(table.date)
}));

// API Usage Table
export const apiUsage = mysqlTable('api_usage', {
  id: varchar('id', { length: 255 }).primaryKey(),
  service: varchar('service', { length: 100 }).notNull(),
  endpoint: varchar('endpoint', { length: 255 }).notNull(),
  requests: int('requests').default(0),
  successRequests: int('success_requests').default(0),
  errorRequests: int('error_requests').default(0),
  totalCost: decimal('total_cost', { precision: 8, scale: 4 }).default('0.0000'),
  quota: int('quota').notNull(),
  quotaUsed: int('quota_used').default(0),
  quotaResetAt: datetime('quota_reset_at'),
  rateLimit: int('rate_limit'),
  rateLimitRemaining: int('rate_limit_remaining'),
  date: datetime('date').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow().onUpdateNow()
}, (table) => ({
  serviceIdx: index('api_usage_service_idx').on(table.service),
  dateIdx: index('api_usage_date_idx').on(table.date),
  quotaIdx: index('api_usage_quota_idx').on(table.quotaUsed, table.quota)
}));

// Memberships Table
export const memberships = mysqlTable('memberships', {
  id: varchar('id', { length: 255 }).primaryKey(),
  userId: varchar('user_id', { length: 255 }).notNull(),
  tier: varchar('tier', { length: 50 }).notNull(),
  status: varchar('status', { length: 50 }).notNull(),
  stripeCustomerId: varchar('stripe_customer_id', { length: 255 }),
  stripeSubscriptionId: varchar('stripe_subscription_id', { length: 255 }),
  price: decimal('price', { precision: 8, scale: 2 }).notNull(),
  currency: varchar('currency', { length: 10 }).notNull().default('USD'),
  features: json('features'),
  startedAt: datetime('started_at'),
  expiresAt: datetime('expires_at'),
  autoRenew: boolean('auto_renew').default(true),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow().onUpdateNow()
}, (table) => ({
  userIdx: index('memberships_user_idx').on(table.userId),
  tierIdx: index('memberships_tier_idx').on(table.tier),
  statusIdx: index('memberships_status_idx').on(table.status)
}));

// Amazon Tracking IDs Table
export const amazonTrackingIds = mysqlTable('amazon_tracking_ids', {
  id: varchar('id', { length: 255 }).primaryKey(),
  region: varchar('region', { length: 10 }).notNull(),
  trackingId: varchar('tracking_id', { length: 255 }).notNull(),
  associateTag: varchar('associate_tag', { length: 255 }),
  isActive: boolean('is_active').default(true),
  isPrimary: boolean('is_primary').default(false),
  performance: json('performance'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow().onUpdateNow()
}, (table) => ({
  regionIdx: index('amazon_tracking_region_idx').on(table.region),
  primaryIdx: index('amazon_tracking_primary_idx').on(table.isPrimary)
}));

// Webhook Events Table
export const webhookEvents = mysqlTable('webhook_events', {
  id: varchar('id', { length: 255 }).primaryKey(),
  source: varchar('source', { length: 100 }).notNull(),
  eventType: varchar('event_type', { length: 100 }).notNull(),
  workflowId: varchar('workflow_id', { length: 255 }),
  data: json('data'),
  status: varchar('status', { length: 50 }).notNull(),
  processedAt: datetime('processed_at'),
  error: text('error'),
  retryCount: int('retry_count').default(0),
  createdAt: timestamp('created_at').defaultNow()
}, (table) => ({
  sourceIdx: index('webhook_events_source_idx').on(table.source),
  eventTypeIdx: index('webhook_events_type_idx').on(table.eventType),
  workflowIdx: index('webhook_events_workflow_idx').on(table.workflowId),
  statusIdx: index('webhook_events_status_idx').on(table.status)
}));

// Revenue by Workflow Table
export const revenueByWorkflow = mysqlTable('revenue_by_workflow', {
  id: varchar('id', { length: 255 }).primaryKey(),
  workflowId: varchar('workflow_id', { length: 255 }).notNull(),
  workflowName: varchar('workflow_name', { length: 255 }).notNull(),
  date: datetime('date').notNull(),
  revenue: decimal('revenue', { precision: 12, scale: 2 }).default('0.00'),
  expenses: decimal('expenses', { precision: 12, scale: 2 }).default('0.00'),
  profit: decimal('profit', { precision: 12, scale: 2 }).default('0.00'),
  profitMargin: decimal('profit_margin', { precision: 5, scale: 2 }).default('0.00'),
  runs: int('runs').default(0),
  successRate: decimal('success_rate', { precision: 5, scale: 2 }).default('0.00'),
  avgRevenuePerRun: decimal('avg_revenue_per_run', { precision: 10, scale: 2 }).default('0.00'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow().onUpdateNow()
}, (table) => ({
  workflowIdx: index('revenue_workflow_idx').on(table.workflowId),
  dateIdx: index('revenue_date_idx').on(table.date)
}));

// Platform Connections Table
export const platformConnections = mysqlTable('platform_connections', {
  id: varchar('id', { length: 255 }).primaryKey(),
  platform: varchar('platform', { length: 100 }).notNull(),
  accountId: varchar('account_id', { length: 255 }),
  accountName: varchar('account_name', { length: 255 }),
  accessToken: text('access_token'),
  refreshToken: text('refresh_token'),
  expiresAt: datetime('expires_at'),
  scopes: text('scopes'),
  isActive: boolean('is_active').default(true),
  lastUsedAt: datetime('last_used_at'),
  metadata: json('metadata'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow().onUpdateNow()
}, (table) => ({
  platformIdx: index('platform_connections_platform_idx').on(table.platform),
  accountIdx: index('platform_connections_account_idx').on(table.accountId),
  activeIdx: index('platform_connections_active_idx').on(table.isActive)
}));

// Alert Notifications Table
export const alertNotifications = mysqlTable('alert_notifications', {
  id: varchar('id', { length: 255 }).primaryKey(),
  type: varchar('type', { length: 100 }).notNull(),
  severity: varchar('severity', { length: 50 }).notNull(),
  title: varchar('title', { length: 255 }).notNull(),
  message: text('message').notNull(),
  workflowId: varchar('workflow_id', { length: 255 }),
  isRead: boolean('is_read').default(false),
  isDismissed: boolean('is_dismissed').default(false),
  data: json('data'),
  expiresAt: datetime('expires_at'),
  createdAt: timestamp('created_at').defaultNow()
}, (table) => ({
  typeIdx: index('alerts_type_idx').on(table.type),
  severityIdx: index('alerts_severity_idx').on(table.severity),
  workflowIdx: index('alerts_workflow_idx').on(table.workflowId),
  readIdx: index('alerts_read_idx').on(table.isRead)
}));

// Performance Metrics Table
export const performanceMetrics = mysqlTable('performance_metrics', {
  id: varchar('id', { length: 255 }).primaryKey(),
  metric: varchar('metric', { length: 100 }).notNull(),
  value: decimal('value', { precision: 15, scale: 6 }).notNull(),
  unit: varchar('unit', { length: 50 }),
  source: varchar('source', { length: 100 }),
  tags: json('tags'),
  timestamp: timestamp('timestamp').defaultNow(),
  createdAt: timestamp('created_at').defaultNow()
}, (table) => ({
  metricIdx: index('performance_metrics_metric_idx').on(table.metric),
  sourceIdx: index('performance_metrics_source_idx').on(table.source),
  timestampIdx: index('performance_metrics_timestamp_idx').on(table.timestamp)
}));

// User Sessions Table
export const userSessions = mysqlTable('user_sessions', {
  id: varchar('id', { length: 255 }).primaryKey(),
  userId: varchar('user_id', { length: 255 }).notNull(),
  sessionToken: varchar('session_token', { length: 255 }).notNull(),
  ipAddress: varchar('ip_address', { length: 50 }),
  userAgent: text('user_agent'),
  expiresAt: datetime('expires_at').notNull(),
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow().onUpdateNow()
}, (table) => ({
  userIdx: index('user_sessions_user_idx').on(table.userId),
  tokenIdx: index('user_sessions_token_idx').on(table.sessionToken),
  activeIdx: index('user_sessions_active_idx').on(table.isActive)
}));

// Relations
export const workflowsRelations = relations(workflows, ({ many }) => ({
  transactions: many(transactions),
  webhookEvents: many(webhookEvents),
  revenueByWorkflow: many(revenueByWorkflow),
  alertNotifications: many(alertNotifications)
}));

export const transactionsRelations = relations(transactions, ({ one }) => ({
  workflow: one(workflows, {
    fields: [transactions.workflowId],
    references: [workflows.id]
  })
}));

export const webhookEventsRelations = relations(webhookEvents, ({ one }) => ({
  workflow: one(workflows, {
    fields: [webhookEvents.workflowId],
    references: [workflows.id]
  })
}));

export const revenueByWorkflowRelations = relations(revenueByWorkflow, ({ one }) => ({
  workflow: one(workflows, {
    fields: [revenueByWorkflow.workflowId],
    references: [workflows.id]
  })
}));

// Export types for TypeScript
export type Workflow = typeof workflows.$inferSelect;
export type NewWorkflow = typeof workflows.$inferInsert;
export type Transaction = typeof transactions.$inferSelect;
export type NewTransaction = typeof transactions.$inferInsert;
export type AffiliateMetric = typeof affiliateMetrics.$inferSelect;
export type NewAffiliateMetric = typeof affiliateMetrics.$inferInsert;
export type APIUsage = typeof apiUsage.$inferSelect;
export type NewAPIUsage = typeof apiUsage.$inferInsert;
export type Membership = typeof memberships.$inferSelect;
export type NewMembership = typeof memberships.$inferInsert;
export type AmazonTrackingId = typeof amazonTrackingIds.$inferSelect;
export type NewAmazonTrackingId = typeof amazonTrackingIds.$inferInsert;
export type WebhookEvent = typeof webhookEvents.$inferSelect;
export type NewWebhookEvent = typeof webhookEvents.$inferInsert;
export type RevenueByWorkflow = typeof revenueByWorkflow.$inferSelect;
export type NewRevenueByWorkflow = typeof revenueByWorkflow.$inferInsert;
export type PlatformConnection = typeof platformConnections.$inferSelect;
export type NewPlatformConnection = typeof platformConnections.$inferInsert;
export type AlertNotification = typeof alertNotifications.$inferSelect;
export type NewAlertNotification = typeof alertNotifications.$inferInsert;
export type PerformanceMetric = typeof performanceMetrics.$inferSelect;
export type NewPerformanceMetric = typeof performanceMetrics.$inferInsert;
export type UserSession = typeof userSessions.$inferSelect;
export type NewUserSession = typeof userSessions.$inferInsert;