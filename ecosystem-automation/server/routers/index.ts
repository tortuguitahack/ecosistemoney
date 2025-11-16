import { initTRPC } from '@trpc/server'
import type { InferSelectModel } from 'drizzle-orm'
import { workflows, transactions, affiliateMetrics, apiUsage, memberships, webhookEvents, alerts, workflowConfig, amazonTrackingIds, realTimeMetrics } from '../db/schema.js'
import { and, desc, eq, gte, lte, count, sum, avg } from 'drizzle-orm'
import { z } from 'zod'

const t = initTRPC.create()

// Schemas de validación
const CreateWorkflowSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  config: z.record(z.any()).optional(),
})

const CreateTransactionSchema = z.object({
  workflowId: z.number(),
  type: z.enum(['revenue', 'expense', 'commission', 'refund']),
  amount: z.number(),
  currency: z.string().default('USD'),
  source: z.string(),
  sourceId: z.string().optional(),
  description: z.string().optional(),
  metadata: z.record(z.any()).optional(),
})

const CreateAffiliateMetricSchema = z.object({
  workflowId: z.number(),
  trackingId: z.string(),
  region: z.string(),
  clicks: z.number().default(0),
  impressions: z.number().default(0),
  conversions: z.number().default(0),
  revenue: z.number().default(0),
  commission: z.number().default(0),
  metadata: z.record(z.any()).optional(),
})

const CreateAmazonTrackingIdSchema = z.object({
  trackingId: z.string(),
  region: z.string(),
  metadata: z.record(z.any()).optional(),
})

const CreateAlertSchema = z.object({
  workflowId: z.number(),
  type: z.enum(['error', 'warning', 'info', 'success']),
  title: z.string(),
  message: z.string(),
  severity: z.enum(['low', 'medium', 'high', 'critical']).default('medium'),
})

// Procedures
export const appRouter = t.router({
  // Workflows
  workflows: t.router({
    getAll: t.procedure
      .query(async ({ ctx }) => {
        const result = await ctx.db.select().from(workflows).orderBy(desc(workflows.updatedAt))
        return result
      }),
    
    getById: t.procedure
      .input(z.object({ id: z.number() }))
      .query(async ({ ctx, input }) => {
        const [result] = await ctx.db.select().from(workflows).where(eq(workflows.id, input.id))
        return result
      }),
    
    create: t.procedure
      .input(CreateWorkflowSchema)
      .mutation(async ({ ctx, input }) => {
        const result = await ctx.db.insert(workflows).values({
          ...input,
          status: 'inactive',
          executionCount: 0,
          successRate: '0.00',
          avgExecutionTime: 0,
        }).returning()
        return result[0]
      }),
    
    update: t.procedure
      .input(z.object({ 
        id: z.number(),
        name: z.string().optional(),
        description: z.string().optional(),
        status: z.enum(['active', 'inactive', 'error', 'processing']).optional(),
        config: z.record(z.any()).optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        const { id, ...updateData } = input
        const result = await ctx.db.update(workflows)
          .set(updateData)
          .where(eq(workflows.id, id))
          .returning()
        return result[0]
      }),
    
    delete: t.procedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ ctx, input }) => {
        await ctx.db.delete(workflows).where(eq(workflows.id, input.id))
        return { success: true }
      }),
    
    getStats: t.procedure
      .query(async ({ ctx }) => {
        const [totalWorkflows] = await ctx.db.select({ count: count() }).from(workflows)
        const [activeWorkflows] = await ctx.db.select({ count: count() })
          .from(workflows).where(eq(workflows.status, 'active'))
        const [avgSuccessRate] = await ctx.db.select({ 
          avg: avg(workflows.successRate) 
        }).from(workflows)
        
        return {
          total: totalWorkflows.count,
          active: activeWorkflows.count,
          avgSuccessRate: Number(avgSuccessRate.avg || 0),
        }
      }),
  }),

  // Dashboard Stats
  dashboard: t.router({
    getStats: t.procedure
      .query(async ({ ctx }) => {
        // Total revenue
        const [totalRevenue] = await ctx.db.select({
          total: sum(transactions.amount)
        }).from(transactions)
          .where(eq(transactions.status, 'completed'))
        
        // Today revenue
        const today = new Date()
        today.setHours(0, 0, 0, 0)
        const [todayRevenue] = await ctx.db.select({
          total: sum(transactions.amount)
        }).from(transactions)
          .where(and(
            eq(transactions.status, 'completed'),
            gte(transactions.createdAt, today)
          ))
        
        // Active workflows
        const [activeWorkflows] = await ctx.db.select({ count: count() })
          .from(workflows).where(eq(workflows.status, 'active'))
        
        // Total transactions
        const [totalTransactions] = await ctx.db.select({ count: count() })
          .from(transactions)
        
        // This month revenue
        const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1)
        const [monthRevenue] = await ctx.db.select({
          total: sum(transactions.amount)
        }).from(transactions)
          .where(and(
            eq(transactions.status, 'completed'),
            gte(transactions.createdAt, firstDayOfMonth)
          ))
        
        // Success rate promedio
        const [avgSuccessRate] = await ctx.db.select({
          avg: avg(workflows.successRate)
        }).from(workflows)
        
        return {
          totalRevenue: Number(totalRevenue.total || 0),
          todayRevenue: Number(todayRevenue.total || 0),
          monthRevenue: Number(monthRevenue.total || 0),
          activeWorkflows: activeWorkflows.count,
          totalTransactions: totalTransactions.count,
          successRate: Number(avgSuccessRate.avg || 0),
        }
      }),
  }),

  // Transactions
  transactions: t.router({
    getAll: t.procedure
      .input(z.object({ 
        limit: z.number().default(50),
        offset: z.number().default(0),
        workflowId: z.number().optional(),
      }).optional())
      .query(async ({ ctx, input }) => {
        const limit = input?.limit || 50
        const offset = input?.offset || 0
        
        let query = ctx.db.select().from(transactions).orderBy(desc(transactions.createdAt)).limit(limit).offset(offset)
        
        if (input?.workflowId) {
          query = ctx.db.select().from(transactions)
            .where(eq(transactions.workflowId, input.workflowId))
            .orderBy(desc(transactions.createdAt))
            .limit(limit)
            .offset(offset)
        }
        
        return await query
      }),
    
    create: t.procedure
      .input(CreateTransactionSchema)
      .mutation(async ({ ctx, input }) => {
        const result = await ctx.db.insert(transactions).values({
          ...input,
          status: 'pending',
        }).returning()
        return result[0]
      }),
    
    getRevenueByDate: t.procedure
      .input(z.object({
        startDate: z.date(),
        endDate: z.date(),
      }))
      .query(async ({ ctx, input }) => {
        const result = await ctx.db.select({
          date: transactions.createdAt,
          total: sum(transactions.amount),
          count: count(),
        }).from(transactions)
        .where(and(
          eq(transactions.status, 'completed'),
          gte(transactions.createdAt, input.startDate),
          lte(transactions.createdAt, input.endDate)
        ))
        .groupBy(transactions.createdAt)
        .orderBy(transactions.createdAt)
        
        return result
      }),
  }),

  // Affiliate Metrics
  affiliateMetrics: t.router({
    getAll: t.procedure
      .input(z.object({
        workflowId: z.number().optional(),
        region: z.string().optional(),
      }).optional())
      .query(async ({ ctx, input }) => {
        let query = ctx.db.select().from(affiliateMetrics)
        
        if (input?.workflowId) {
          query = ctx.db.select().from(affiliateMetrics)
            .where(eq(affiliateMetrics.workflowId, input.workflowId))
        }
        
        return await query.orderBy(desc(affiliateMetrics.date))
      }),
    
    create: t.procedure
      .input(CreateAffiliateMetricSchema)
      .mutation(async ({ ctx, input }) => {
        const conversionRate = input.impressions > 0 
          ? (input.conversions / input.impressions) * 100 
          : 0
        
        const result = await ctx.db.insert(affiliateMetrics).values({
          ...input,
          conversionRate: conversionRate.toFixed(2),
        }).returning()
        return result[0]
      }),
    
    getTopPerformers: t.procedure
      .input(z.object({ limit: z.number().default(10) }))
      .query(async ({ ctx, input }) => {
        const result = await ctx.db.select({
          trackingId: affiliateMetrics.trackingId,
          region: affiliateMetrics.region,
          totalRevenue: sum(affiliateMetrics.revenue),
          totalConversions: sum(affiliateMetrics.conversions),
          avgConversionRate: avg(affiliateMetrics.conversionRate),
        }).from(affiliateMetrics)
        .groupBy(affiliateMetrics.trackingId, affiliateMetrics.region)
        .orderBy(desc(sum(affiliateMetrics.revenue)))
        .limit(input.limit)
        
        return result
      }),
  }),

  // API Usage
  apiUsage: t.router({
    getAll: t.procedure
      .input(z.object({
        workflowId: z.number().optional(),
        startDate: z.date().optional(),
        endDate: z.date().optional(),
      }).optional())
      .query(async ({ ctx, input }) => {
        let query = ctx.db.select().from(apiUsage)
        
        if (input?.workflowId) {
          query = ctx.db.select().from(apiUsage).where(eq(apiUsage.workflowId, input.workflowId))
        }
        
        if (input?.startDate && input?.endDate) {
          query = ctx.db.select().from(apiUsage).where(and(
            gte(apiUsage.timestamp, input.startDate),
            lte(apiUsage.timestamp, input.endDate)
          ))
        }
        
        return await query.orderBy(desc(apiUsage.timestamp))
      }),
    
    getSummary: t.procedure
      .query(async ({ ctx }) => {
        const [totalCalls] = await ctx.db.select({ count: count() }).from(apiUsage)
        const [successCalls] = await ctx.db.select({ count: count() }).from(apiUsage)
          .where(eq(apiUsage.success, 'true'))
        const [avgResponseTime] = await ctx.db.select({
          avg: avg(apiUsage.responseTime)
        }).from(apiUsage)
        
        return {
          totalCalls: totalCalls.count,
          successCalls: successCalls.count,
          avgResponseTime: Number(avgResponseTime.avg || 0),
          successRate: totalCalls.count > 0 
            ? (successCalls.count / totalCalls.count) * 100 
            : 0,
        }
      }),
  }),

  // Memberships
  memberships: t.router({
    getAll: t.procedure
      .query(async ({ ctx }) => {
        return await ctx.db.select().from(memberships).orderBy(desc(memberships.createdAt))
      }),
    
    getSummary: t.procedure
      .query(async ({ ctx }) => {
        const basic = await ctx.db.select({ count: count() }).from(memberships)
          .where(eq(memberships.tier, 'basic'))
        const pro = await ctx.db.select({ count: count() }).from(memberships)
          .where(eq(memberships.tier, 'pro'))
        const enterprise = await ctx.db.select({ count: count() }).from(memberships)
          .where(eq(memberships.tier, 'enterprise'))
        
        return {
          basic: basic[0].count,
          pro: pro[0].count,
          enterprise: enterprise[0].count,
        }
      }),
  }),

  // Alerts
  alerts: t.router({
    getAll: t.procedure
      .input(z.object({
        status: z.enum(['active', 'acknowledged', 'resolved']).optional(),
        workflowId: z.number().optional(),
      }).optional())
      .query(async ({ ctx, input }) => {
        let query = ctx.db.select().from(alerts)
        
        if (input?.status) {
          query = ctx.db.select().from(alerts).where(eq(alerts.status, input.status))
        }
        
        if (input?.workflowId) {
          query = ctx.db.select().from(alerts).where(eq(alerts.workflowId, input.workflowId))
        }
        
        return await query.orderBy(desc(alerts.createdAt))
      }),
    
    create: t.procedure
      .input(CreateAlertSchema)
      .mutation(async ({ ctx, input }) => {
        const result = await ctx.db.insert(alerts).values(input).returning()
        return result[0]
      }),
    
    acknowledge: t.procedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ ctx, input }) => {
        const result = await ctx.db.update(alerts)
          .set({ 
            status: 'acknowledged',
            acknowledgedAt: new Date()
          })
          .where(eq(alerts.id, input.id))
          .returning()
        return result[0]
      }),
    
    resolve: t.procedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ ctx, input }) => {
        const result = await ctx.db.update(alerts)
          .set({ 
            status: 'resolved',
            resolvedAt: new Date()
          })
          .where(eq(alerts.id, input.id))
          .returning()
        return result[0]
      }),
  }),

  // Amazon Tracking IDs
  amazonTracking: t.router({
    getAll: t.procedure
      .query(async ({ ctx }) => {
        return await ctx.db.select().from(amazonTrackingIds)
          .orderBy(desc(amazonTrackingIds.performanceScore))
      }),
    
    create: t.procedure
      .input(CreateAmazonTrackingIdSchema)
      .mutation(async ({ ctx, input }) => {
        const result = await ctx.db.insert(amazonTrackingIds).values(input).returning()
        return result[0]
      }),
    
    updatePerformance: t.procedure
      .input(z.object({
        id: z.number(),
        performanceScore: z.number(),
        totalClicks: z.number().optional(),
        totalConversions: z.number().optional(),
        totalRevenue: z.number().optional(),
        usageCount: z.number().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        const { id, ...updateData } = input
        const result = await ctx.db.update(amazonTrackingIds)
          .set(updateData)
          .where(eq(amazonTrackingIds.id, id))
          .returning()
        return result[0]
      }),
    
    getBestPerforming: t.procedure
      .input(z.object({ region: z.string() }))
      .query(async ({ ctx, input }) => {
        const result = await ctx.db.select().from(amazonTrackingIds)
          .where(eq(amazonTrackingIds.region, input.region))
          .orderBy(desc(amazonTrackingIds.performanceScore))
          .limit(5)
        
        return result
      }),
  }),

  // Real-time metrics
  realTime: t.router({
    getLatest: t.procedure
      .input(z.object({
        workflowId: z.number().optional(),
        metricType: z.string().optional(),
      }).optional())
      .query(async ({ ctx, input }) => {
        let query = ctx.db.select().from(realTimeMetrics)
        
        if (input?.workflowId) {
          query = ctx.db.select().from(realTimeMetrics)
            .where(eq(realTimeMetrics.workflowId, input.workflowId))
        }
        
        if (input?.metricType) {
          query = ctx.db.select().from(realTimeMetrics)
            .where(eq(realTimeMetrics.metricType, input.metricType))
        }
        
        return await query.orderBy(desc(realTimeMetrics.timestamp))
      }),
    
    addMetric: t.procedure
      .input(z.object({
        workflowId: z.number(),
        metricType: z.string(),
        value: z.number(),
        unit: z.string(),
        metadata: z.record(z.any()).optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        const result = await ctx.db.insert(realTimeMetrics).values(input).returning()
        return result[0]
      }),
  }),
})

export type AppRouter = typeof appRouter