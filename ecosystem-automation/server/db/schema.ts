import { mysqlTable, int, varchar, text, timestamp, decimal, json, index } from 'drizzle-orm/mysql-core'
import { sql } from 'drizzle-orm'

// 1. Tabla de workflows
export const workflows = mysqlTable('workflows', {
  id: int('id').primaryKey().autoincrement(),
  name: varchar('name', { length: 255 }).notNull(),
  description: text('description'),
  status: varchar('status', { length: 50 }).notNull().default('inactive'), // active, inactive, error, processing
  lastRun: timestamp('last_run'),
  nextRun: timestamp('next_run'),
  executionCount: int('execution_count').default(0),
  successRate: decimal('success_rate', { precision: 5, scale: 2 }).default('0.00'),
  avgExecutionTime: int('avg_execution_time').default(0), // en segundos
  config: json('config'),
  createdAt: timestamp('created_at').default(sql`CURRENT_TIMESTAMP`),
  updatedAt: timestamp('updated_at').default(sql`CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP`),
}, (table) => ({
  statusIdx: index('workflows_status_idx').on(table.status),
  nameIdx: index('workflows_name_idx').on(table.name),
}))

// 2. Tabla de transacciones
export const transactions = mysqlTable('transactions', {
  id: int('id').primaryKey().autoincrement(),
  workflowId: int('workflow_id').notNull(),
  type: varchar('type', { length: 50 }).notNull(), // revenue, expense, commission, refund
  amount: decimal('amount', { precision: 10, scale: 2 }).notNull(),
  currency: varchar('currency', { length: 10 }).default('USD'),
  status: varchar('status', { length: 50 }).notNull(), // pending, completed, failed, cancelled
  source: varchar('source', { length: 100 }), // stripe, amazon, etc.
  sourceId: varchar('source_id', { length: 255 }),
  description: text('description'),
  metadata: json('metadata'),
  createdAt: timestamp('created_at').default(sql`CURRENT_TIMESTAMP`),
}, (table) => ({
  workflowIdx: index('transactions_workflow_idx').on(table.workflowId),
  statusIdx: index('transactions_status_idx').on(table.status),
  sourceIdx: index('transactions_source_idx').on(table.source),
  createdAtIdx: index('transactions_created_at_idx').on(table.createdAt),
}))

// 3. Tabla de métricas de afiliados
export const affiliateMetrics = mysqlTable('affiliate_metrics', {
  id: int('id').primaryKey().autoincrement(),
  workflowId: int('workflow_id').notNull(),
  trackingId: varchar('tracking_id', { length: 255 }).notNull(),
  region: varchar('region', { length: 10 }).notNull(),
  clicks: int('clicks').default(0),
  impressions: int('impressions').default(0),
  conversions: int('conversions').default(0),
  revenue: decimal('revenue', { precision: 10, scale: 2 }).default('0.00'),
  commission: decimal('commission', { precision: 10, scale: 2 }).default('0.00'),
  conversionRate: decimal('conversion_rate', { precision: 5, scale: 2 }).default('0.00'),
  performanceScore: int('performance_score').default(0), // 0-100
  date: timestamp('date').default(sql`CURRENT_TIMESTAMP`),
  metadata: json('metadata'),
}, (table) => ({
  workflowIdx: index('affiliate_workflow_idx').on(table.workflowId),
  trackingIdx: index('affiliate_tracking_idx').on(table.trackingId),
  regionIdx: index('affiliate_region_idx').on(table.region),
  dateIdx: index('affiliate_date_idx').on(table.date),
}))

// 4. Tabla de uso de API
export const apiUsage = mysqlTable('api_usage', {
  id: int('id').primaryKey().autoincrement(),
  workflowId: int('workflow_id').notNull(),
  endpoint: varchar('endpoint', { length: 255 }).notNull(),
  method: varchar('method', { length: 10 }).notNull(),
  statusCode: int('status_code'),
  responseTime: int('response_time'), // en ms
  requestSize: int('request_size'), // en bytes
  responseSize: int('response_size'), // en bytes
  success: varchar('success', { length: 10 }).notNull().default('false'),
  errorMessage: text('error_message'),
  timestamp: timestamp('timestamp').default(sql`CURRENT_TIMESTAMP`),
  metadata: json('metadata'),
}, (table) => ({
  workflowIdx: index('api_usage_workflow_idx').on(table.workflowId),
  endpointIdx: index('api_usage_endpoint_idx').on(table.endpoint),
  timestampIdx: index('api_usage_timestamp_idx').on(table.timestamp),
}))

// 5. Tabla de membresías
export const memberships = mysqlTable('memberships', {
  id: int('id').primaryKey().autoincrement(),
  userId: varchar('user_id', { length: 255 }).notNull(),
  workflowId: int('workflow_id').notNull(),
  tier: varchar('tier', { length: 50 }).notNull(), // basic, pro, enterprise
  status: varchar('status', { length: 50 }).notNull(), // active, cancelled, expired
  startDate: timestamp('start_date').default(sql`CURRENT_TIMESTAMP`),
  endDate: timestamp('end_date'),
  autoRenew: varchar('auto_renew', { length: 10 }).default('true'),
  amount: decimal('amount', { precision: 10, scale: 2 }).notNull(),
  currency: varchar('currency', { length: 10 }).default('USD'),
  stripeSubscriptionId: varchar('stripe_subscription_id', { length: 255 }),
  createdAt: timestamp('created_at').default(sql`CURRENT_TIMESTAMP`),
  updatedAt: timestamp('updated_at').default(sql`CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP`),
}, (table) => ({
  userIdx: index('memberships_user_idx').on(table.userId),
  workflowIdx: index('memberships_workflow_idx').on(table.workflowId),
  statusIdx: index('memberships_status_idx').on(table.status),
}))

// 6. Tabla de eventos de webhooks
export const webhookEvents = mysqlTable('webhook_events', {
  id: int('id').primaryKey().autoincrement(),
  workflowId: int('workflow_id').notNull(),
  source: varchar('source', { length: 50 }).notNull(), // n8n, make, stripe, etc.
  eventType: varchar('event_type', { length: 100 }).notNull(),
  payload: json('payload').notNull(),
  status: varchar('status', { length: 50 }).notNull().default('pending'), // pending, processed, failed
  processedAt: timestamp('processed_at'),
  errorMessage: text('error_message'),
  createdAt: timestamp('created_at').default(sql`CURRENT_TIMESTAMP`),
}, (table) => ({
  workflowIdx: index('webhook_workflow_idx').on(table.workflowId),
  sourceIdx: index('webhook_source_idx').on(table.source),
  eventTypeIdx: index('webhook_event_type_idx').on(table.eventType),
  statusIdx: index('webhook_status_idx').on(table.status),
  createdAtIdx: index('webhook_created_at_idx').on(table.createdAt),
}))

// 7. Tabla de alertas
export const alerts = mysqlTable('alerts', {
  id: int('id').primaryKey().autoincrement(),
  workflowId: int('workflow_id').notNull(),
  type: varchar('type', { length: 50 }).notNull(), // error, warning, info, success
  title: varchar('title', { length: 255 }).notNull(),
  message: text('message').notNull(),
  severity: varchar('severity', { length: 20 }).notNull().default('medium'), // low, medium, high, critical
  status: varchar('status', { length: 50 }).notNull().default('active'), // active, acknowledged, resolved
  acknowledgedAt: timestamp('acknowledged_at'),
  resolvedAt: timestamp('resolved_at'),
  createdAt: timestamp('created_at').default(sql`CURRENT_TIMESTAMP`),
}, (table) => ({
  workflowIdx: index('alerts_workflow_idx').on(table.workflowId),
  typeIdx: index('alerts_type_idx').on(table.type),
  severityIdx: index('alerts_severity_idx').on(table.severity),
  statusIdx: index('alerts_status_idx').on(table.status),
  createdAtIdx: index('alerts_created_at_idx').on(table.createdAt),
}))

// 8. Tabla de configuración de workflows
export const workflowConfig = mysqlTable('workflow_config', {
  id: int('id').primaryKey().autoincrement(),
  workflowId: int('workflow_id').notNull(),
  key: varchar('key', { length: 255 }).notNull(),
  value: json('value').notNull(),
  description: text('description'),
  isEncrypted: varchar('is_encrypted', { length: 10 }).default('false'),
  createdAt: timestamp('created_at').default(sql`CURRENT_TIMESTAMP`),
  updatedAt: timestamp('updated_at').default(sql`CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP`),
}, (table) => ({
  workflowIdx: index('workflow_config_workflow_idx').on(table.workflowId),
  keyIdx: index('workflow_config_key_idx').on(table.key),
}))

// 9. Tabla de tracking IDs de Amazon
export const amazonTrackingIds = mysqlTable('amazon_tracking_ids', {
  id: int('id').primaryKey().autoincrement(),
  trackingId: varchar('tracking_id', { length: 255 }).notNull().unique(),
  region: varchar('region', { length: 10 }).notNull(), // US, UK, DE, FR, etc.
  status: varchar('status', { length: 50 }).notNull().default('active'), // active, inactive, suspended
  performanceScore: int('performance_score').default(0), // 0-100
  totalClicks: int('total_clicks').default(0),
  totalConversions: int('total_conversions').default(0),
  totalRevenue: decimal('total_revenue', { precision: 10, scale: 2 }).default('0.00'),
  avgConversionRate: decimal('avg_conversion_rate', { precision: 5, scale: 2 }).default('0.00'),
  lastUsed: timestamp('last_used'),
  usageCount: int('usage_count').default(0),
  metadata: json('metadata'),
  createdAt: timestamp('created_at').default(sql`CURRENT_TIMESTAMP`),
  updatedAt: timestamp('updated_at').default(sql`CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP`),
}, (table) => ({
  trackingIdx: index('amazon_tracking_tracking_idx').on(table.trackingId),
  regionIdx: index('amazon_tracking_region_idx').on(table.region),
  statusIdx: index('amazon_tracking_status_idx').on(table.status),
  performanceIdx: index('amazon_tracking_performance_idx').on(table.performanceScore),
}))

// 10. Tabla de métricas en tiempo real
export const realTimeMetrics = mysqlTable('real_time_metrics', {
  id: int('id').primaryKey().autoincrement(),
  workflowId: int('workflow_id').notNull(),
  metricType: varchar('metric_type', { length: 100 }).notNull(), // execution_time, memory_usage, cpu_usage, etc.
  value: decimal('value', { precision: 15, scale: 2 }).notNull(),
  unit: varchar('unit', { length: 20 }), // seconds, bytes, percentage, etc.
  timestamp: timestamp('timestamp').default(sql`CURRENT_TIMESTAMP`),
  metadata: json('metadata'),
}, (table) => ({
  workflowIdx: index('realtime_workflow_idx').on(table.workflowId),
  metricTypeIdx: index('realtime_metric_type_idx').on(table.metricType),
  timestampIdx: index('realtime_timestamp_idx').on(table.timestamp),
}))

// Tipos para TypeScript
export type Workflow = typeof workflows.$inferSelect
export type NewWorkflow = typeof workflows.$inferInsert
export type Transaction = typeof transactions.$inferSelect
export type NewTransaction = typeof transactions.$inferInsert
export type AffiliateMetric = typeof affiliateMetrics.$inferSelect
export type NewAffiliateMetric = typeof affiliateMetrics.$inferInsert
export type ApiUsage = typeof apiUsage.$inferSelect
export type NewApiUsage = typeof apiUsage.$inferInsert
export type Membership = typeof memberships.$inferSelect
export type NewMembership = typeof memberships.$inferInsert
export type WebhookEvent = typeof webhookEvents.$inferSelect
export type NewWebhookEvent = typeof webhookEvents.$inferInsert
export type Alert = typeof alerts.$inferSelect
export type NewAlert = typeof alerts.$inferInsert
export type WorkflowConfig = typeof workflowConfig.$inferSelect
export type NewWorkflowConfig = typeof workflowConfig.$inferInsert
export type AmazonTrackingId = typeof amazonTrackingIds.$inferSelect
export type NewAmazonTrackingId = typeof amazonTrackingIds.$inferInsert
export type RealTimeMetric = typeof realTimeMetrics.$inferSelect
export type NewRealTimeMetric = typeof realTimeMetrics.$inferInsert