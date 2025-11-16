import express from 'express'
import cors from 'cors'
import { createTRPCProxyClient, httpBatchLink } from '@trpc/client'
import { createExpressMiddleware } from '@trpc/server/adapters/express'
import { WebSocketServer } from 'ws'
import { db } from './db.js'
import { appRouter } from './routers/index.js'
import type { CreateExpressContextOptions } from '@trpc/server/adapters/express'
import webhookRoutes from './webhooks/index.js'

const app = express()
const PORT = process.env.PORT || 3001

// Middleware
app.use(cors({
  origin: ['http://localhost:3000', 'http://127.0.0.1:3000'],
  credentials: true,
}))

app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))

// Contexto para tRPC
const createContext = (opts: CreateExpressContextOptions) => {
  return {
    req: opts.req,
    res: opts.res,
    db,
  }
}

// Routes de tRPC
app.use('/api/trpc', createExpressMiddleware({
  router: appRouter,
  createContext,
}))

// Routes de webhooks
app.use('/api/webhooks', webhookRoutes)

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    services: {
      database: 'connected',
      server: 'running',
    }
  })
})

// Server HTTP tradicional
const server = app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`)
  console.log(`📊 Dashboard: http://localhost:3000`)
  console.log(`🔗 tRPC API: http://localhost:${PORT}/api/trpc`)
})

// WebSocket Server para actualizaciones en tiempo real
const wss = new WebSocketServer({ server })

wss.on('connection', (ws) => {
  console.log('📡 Client connected to WebSocket')
  
  ws.send(JSON.stringify({
    type: 'connection',
    message: 'Connected to real-time updates',
    timestamp: new Date().toISOString()
  }))

  // Enviar datos iniciales
  ws.send(JSON.stringify({
    type: 'init',
    data: {
      connected: true,
      serverTime: new Date().toISOString()
    }
  }))

  ws.on('message', (message) => {
    try {
      const data = JSON.parse(message.toString())
      
      if (data.type === 'ping') {
        ws.send(JSON.stringify({
          type: 'pong',
          timestamp: new Date().toISOString()
        }))
      }
      
      if (data.type === 'subscribe') {
        // Manejar suscripciones a workflows específicos
        console.log('📝 Subscription requested for workflow:', data.workflowId)
      }
    } catch (error) {
      console.error('WebSocket message error:', error)
    }
  })

  ws.on('close', () => {
    console.log('📴 Client disconnected from WebSocket')
  })

  ws.on('error', (error) => {
    console.error('WebSocket error:', error)
  })
})

// Manejo graceful de shutdown
process.on('SIGINT', async () => {
  console.log('\n🛑 Shutting down gracefully...')
  
  // Cerrar WebSocket server
  wss.close(() => {
    console.log('📴 WebSocket server closed')
  })
  
  // Cerrar servidor HTTP
  server.close(() => {
    console.log('🌐 HTTP server closed')
  })
  
  // Cerrar conexiones de base de datos
  await import('./db.js').then(({ closeDbConnection }) => {
    closeDbConnection()
    console.log('🗄️ Database connections closed')
  })
  
  process.exit(0)
})

export { app, wss }