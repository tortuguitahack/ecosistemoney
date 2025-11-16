import { Router } from 'express'
import { db } from '../db.js'
import { webhookEvents, workflows, realTimeMetrics } from '../db/schema.js'
import { eq } from 'drizzle-orm'

const router = Router()

// Webhook endpoint para n8n
router.post('/n8n', async (req, res) => {
  try {
    const { 
      workflowId, 
      eventType, 
      payload, 
      executionId,
      status,
      executionTime,
      output,
      error
    } = req.body

    // Validar que el workflow existe
    const workflow = await db.select().from(workflows)
      .where(eq(workflows.id, workflowId))

    if (workflow.length === 0) {
      return res.status(404).json({ 
        error: 'Workflow not found',
        workflowId 
      })
    }

    // Insertar evento de webhook
    await db.insert(webhookEvents).values({
      workflowId,
      source: 'n8n',
      eventType: eventType || 'execution',
      payload: {
        ...payload,
        executionId,
        status,
        output,
        error,
        receivedAt: new Date().toISOString(),
      },
      status: 'pending',
    })

    // Actualizar métricas en tiempo real si hay información de ejecución
    if (executionTime !== undefined) {
      await db.insert(realTimeMetrics).values({
        workflowId,
        metricType: 'execution_time',
        value: executionTime,
        unit: 'milliseconds',
        metadata: {
          executionId,
          source: 'n8n',
          status,
        },
      })
    }

    // Actualizar estado del workflow si hay información
    if (status) {
      await db.update(workflows)
        .set({
          status: status === 'completed' ? 'active' : status === 'failed' ? 'error' : 'processing',
          lastRun: new Date(),
          executionCount: workflows.executionCount + 1,
        })
        .where(eq(workflows.id, workflowId))
    }

    console.log(`📡 n8n webhook received for workflow ${workflowId}: ${eventType}`)
    
    res.json({ 
      success: true, 
      message: 'Webhook processed successfully',
      workflowId,
      eventType,
    })

  } catch (error) {
    console.error('❌ n8n webhook error:', error)
    res.status(500).json({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    })
  }
})

// Webhook endpoint para Make (anteriormente Integromat)
router.post('/make', async (req, res) => {
  try {
    const { 
      workflowId, 
      eventType, 
      payload, 
      scenarioId,
      executionId,
      status,
      duration,
      result,
      error
    } = req.body

    // Validar que el workflow existe
    const workflow = await db.select().from(workflows)
      .where(eq(workflows.id, workflowId))

    if (workflow.length === 0) {
      return res.status(404).json({ 
        error: 'Workflow not found',
        workflowId 
      })
    }

    // Insertar evento de webhook
    await db.insert(webhookEvents).values({
      workflowId,
      source: 'make',
      eventType: eventType || 'scenario_execution',
      payload: {
        ...payload,
        scenarioId,
        executionId,
        status,
        duration,
        result,
        error,
        receivedAt: new Date().toISOString(),
      },
      status: 'pending',
    })

    // Actualizar métricas en tiempo real si hay información de duración
    if (duration !== undefined) {
      await db.insert(realTimeMetrics).values({
        workflowId,
        metricType: 'execution_duration',
        value: duration,
        unit: 'seconds',
        metadata: {
          scenarioId,
          executionId,
          source: 'make',
          status,
        },
      })
    }

    // Actualizar estado del workflow
    if (status) {
      await db.update(workflows)
        .set({
          status: status === 'done' ? 'active' : status === 'error' ? 'error' : 'processing',
          lastRun: new Date(),
          executionCount: workflows.executionCount + 1,
        })
        .where(eq(workflows.id, workflowId))
    }

    console.log(`🔧 Make webhook received for workflow ${workflowId}: ${eventType}`)
    
    res.json({ 
      success: true, 
      message: 'Make webhook processed successfully',
      workflowId,
      eventType,
    })

  } catch (error) {
    console.error('❌ Make webhook error:', error)
    res.status(500).json({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    })
  }
})

// Webhook endpoint para Stripe
router.post('/stripe', async (req, res) => {
  try {
    const signature = req.headers['stripe-signature']
    const payload = req.body

    // En producción, verificar la firma de Stripe aquí
    // const event = stripe.webhooks.constructEvent(payload, signature, webhookSecret)

    console.log('💳 Stripe webhook received:', payload.type)

    // Procesar diferentes tipos de eventos de Stripe
    switch (payload.type) {
      case 'payment_intent.succeeded':
        // Insertar transacción de revenue
        await db.insert(webhookEvents).values({
          workflowId: 1, // Workflow de monetización principal
          source: 'stripe',
          eventType: 'payment_succeeded',
          payload: payload.data.object,
          status: 'processed',
          processedAt: new Date(),
        })
        break

      case 'customer.subscription.created':
      case 'customer.subscription.updated':
      case 'customer.subscription.deleted':
        // Manejar cambios en suscripciones
        await db.insert(webhookEvents).values({
          workflowId: 1,
          source: 'stripe',
          eventType: payload.type,
          payload: payload.data.object,
          status: 'processed',
          processedAt: new Date(),
        })
        break

      case 'invoice.payment_succeeded':
        // Registrar ingreso por suscripción
        await db.insert(webhookEvents).values({
          workflowId: 1,
          source: 'stripe',
          eventType: 'subscription_payment',
          payload: payload.data.object,
          status: 'processed',
          processedAt: new Date(),
        })
        break

      default:
        console.log('📝 Unhandled Stripe event type:', payload.type)
    }

    res.json({ received: true })

  } catch (error) {
    console.error('❌ Stripe webhook error:', error)
    res.status(400).send(`Webhook Error: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
})

// Webhook endpoint genérico para otros servicios
router.post('/generic', async (req, res) => {
  try {
    const { 
      workflowId, 
      source, 
      eventType, 
      payload 
    } = req.body

    if (!workflowId || !source || !eventType) {
      return res.status(400).json({ 
        error: 'Missing required fields: workflowId, source, eventType' 
      })
    }

    // Insertar evento de webhook
    await db.insert(webhookEvents).values({
      workflowId,
      source: source.toLowerCase(),
      eventType,
      payload: {
        ...payload,
        receivedAt: new Date().toISOString(),
      },
      status: 'pending',
    })

    console.log(`🔄 Generic webhook received from ${source} for workflow ${workflowId}`)
    
    res.json({ 
      success: true, 
      message: 'Generic webhook processed successfully',
    })

  } catch (error) {
    console.error('❌ Generic webhook error:', error)
    res.status(500).json({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    })
  }
})

// Endpoint para procesar webhooks pendientes
router.post('/process-pending', async (req, res) => {
  try {
    const pendingEvents = await db.select().from(webhookEvents)
      .where(eq(webhookEvents.status, 'pending'))
      .limit(100)

    for (const event of pendingEvents) {
      // Aquí se procesaría cada evento pendiente
      // Por ejemplo, actualizar métricas, enviar notificaciones, etc.
      
      await db.update(webhookEvents)
        .set({ 
          status: 'processed',
          processedAt: new Date()
        })
        .where(eq(webhookEvents.id, event.id))
    }

    res.json({ 
      success: true, 
      message: `Processed ${pendingEvents.length} pending webhooks`
    })

  } catch (error) {
    console.error('❌ Process pending webhooks error:', error)
    res.status(500).json({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    })
  }
})

export default router