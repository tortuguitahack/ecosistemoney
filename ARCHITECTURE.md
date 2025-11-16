# 🏗️ Architecture Overview

## Table of Contents

- [System Architecture](#system-architecture)
- [Technology Stack](#technology-stack)
- [Data Flow](#data-flow)
- [Database Design](#database-design)
- [API Architecture](#api-architecture)
- [Workflow Automation](#workflow-automation)
- [Security Model](#security-model)
- [Scalability Design](#scalability-design)
- [Performance Optimization](#performance-optimization)
- [Monitoring & Observability](#monitoring--observability)

## System Architecture

### High-Level Overview

```mermaid
graph TB
    subgraph "Frontend Layer"
        A[React Dashboard]
        B[TypeScript]
        C[Tailwind CSS]
        D[Recharts]
    end
    
    subgraph "API Gateway"
        E[tRPC Router]
        F[Express.js]
        G[Rate Limiting]
        H[Authentication]
    end
    
    subgraph "Business Logic"
        I[Workflow Engine]
        J[Payment Processing]
        K[Analytics Engine]
        L[Webhook Handler]
    end
    
    subgraph "External Services"
        M[OpenAI GPT-4]
        N[Stripe]
        O[n8n Automation]
        P[Amazon Associates]
        Q[Blockchain APIs]
    end
    
    subgraph "Data Layer"
        R[MySQL/TiDB]
        S[Redis Cache]
        T[IPFS Storage]
    end
    
    A --> E
    B --> F
    C --> G
    D --> H
    E --> I
    F --> J
    G --> K
    H --> L
    I --> M
    J --> N
    K --> O
    L --> P
    I --> Q
    I --> R
    J --> S
    K --> T
```

### Microservices Architecture

```mermaid
graph LR
    subgraph "User Interface"
        UI[React Dashboard]
    end
    
    subgraph "Core Services"
        API[API Gateway]
        AUTH[Authentication Service]
        WORKFLOW[Workflow Service]
        PAYMENT[Payment Service]
        ANALYTICS[Analytics Service]
    end
    
    subgraph "Data Services"
        DB[(Database)]
        CACHE[Redis Cache]
        QUEUE[Job Queue]
    end
    
    subgraph "External Integrations"
        N8N[n8n Workflows]
        STRIPE[Stripe]
        AI[OpenAI API]
        AMAZON[Amazon API]
    end
    
    UI --> API
    API --> AUTH
    API --> WORKFLOW
    API --> PAYMENT
    API --> ANALYTICS
    
    WORKFLOW --> QUEUE
    QUEUE --> N8N
    
    PAYMENT --> STRIPE
    ANALYTICS --> AI
    WORKFLOW --> AMAZON
    
    AUTH --> DB
    WORKFLOW --> DB
    PAYMENT --> DB
    ANALYTICS --> DB
    
    API --> CACHE
    QUEUE --> CACHE
```

## Technology Stack

### Frontend

| Technology | Purpose | Version |
|------------|---------|---------|
| **React** | UI Framework | 19.0+ |
| **TypeScript** | Type Safety | 5.0+ |
| **Tailwind CSS** | Styling | 4.0+ |
| **Vite** | Build Tool | 5.0+ |
| **tRPC** | API Layer | 11.0+ |
| **React Query** | Data Fetching | 5.0+ |
| **Recharts** | Data Visualization | 2.8+ |
| **React Hook Form** | Form Management | 7.0+ |
| **Zod** | Schema Validation | 3.0+ |

### Backend

| Technology | Purpose | Version |
|------------|---------|---------|
| **Node.js** | Runtime | 18.0+ |
| **Express.js** | Web Framework | 4.0+ |
| **TypeScript** | Language | 5.0+ |
| **tRPC** | API Framework | 11.0+ |
| **Drizzle ORM** | Database ORM | 0.27+ |
| **MySQL** | Primary Database | 8.0+ |
| **Redis** | Caching & Sessions | 7.0+ |
| **JSON Web Tokens** | Authentication | - |
| **Stripe** | Payment Processing | - |
| **Zod** | Validation | 3.0+ |

### Infrastructure

| Technology | Purpose | Version |
|------------|---------|---------|
| **Docker** | Containerization | 24.0+ |
| **Docker Compose** | Orchestration | 2.0+ |
| **nginx** | Reverse Proxy | 1.24+ |
| **n8n** | Workflow Automation | 1.0+ |
| **Prometheus** | Metrics Collection | 2.0+ |
| **Grafana** | Dashboards | 10.0+ |
| **Fluentd** | Log Aggregation | 1.16+ |
| **Elasticsearch** | Log Storage | 8.0+ |

### External APIs

| Service | Purpose | Integration |
|---------|---------|-------------|
| **OpenAI GPT-4** | AI Content Generation | REST API |
| **Stripe** | Payment Processing | Webhooks |
| **Amazon Associates** | Affiliate Tracking | Product API |
| **ElevenLabs** | Voice Generation | REST API |
| **Base Network** | Blockchain Integration | Web3 |
| **Pinata** | IPFS Storage | REST API |
| **Substack** | Newsletter Distribution | API |
| **Bandcamp** | Audio Distribution | API |

## Data Flow

### Workflow Execution Flow

```mermaid
sequenceDiagram
    participant User
    participant Dashboard
    participant API
    participant Workflow
    participant n8n
    participant External
    participant Database
    
    User->>Dashboard: Triggers Workflow
    Dashboard->>API: POST /workflows/start
    API->>Workflow: Execute Workflow
    Workflow->>n8n: Trigger Workflow
    n8n->>External: API Calls
    External-->>n8n: Response
    n8n->>Workflow: Webhook Callback
    Workflow->>Database: Store Results
    Workflow->>API: Update Status
    API->>Dashboard: Real-time Update
    Dashboard->>User: Success Notification
```

### Payment Processing Flow

```mermaid
sequenceDiagram
    participant User
    participant Frontend
    participant API
    participant Stripe
    participant Database
    participant Webhook
    
    User->>Frontend: Subscribe to Plan
    Frontend->>API: POST /payments/subscribe
    API->>Stripe: Create Customer
    Stripe-->>API: Customer Created
    API->>Frontend: Redirect to Stripe
    Frontend->>Stripe: Complete Payment
    Stripe->>Webhook: Payment Success
    Webhook->>Database: Update Membership
    Webhook->>API: Notify Success
    API->>Frontend: Subscription Active
    Frontend->>User: Welcome Email
```

## Database Design

### Entity Relationship Diagram

```mermaid
erDiagram
    WORKFLOWS ||--o{ TRANSACTIONS : generates
    WORKFLOWS ||--o{ WEBHOOK_EVENTS : triggers
    WORKFLOWS ||--o{ REVENUE_BY_WORKFLOW : produces
    WORKFLOWS ||--o{ ALERT_NOTIFICATIONS : creates
    
    WORKFLOWS {
        string id PK
        string name
        string category
        string status
        json configuration
        boolean is_active
    }
    
    TRANSACTIONS {
        string id PK
        string type
        decimal amount
        string status
        string workflow_id FK
        json metadata
    }
    
    AFFILIATE_METRICS {
        string id PK
        string region
        string tracking_id
        int clicks
        int conversions
        decimal revenue
        decimal commission
    }
    
    MEMBERSHIPS {
        string id PK
        string user_id
        string tier
        string status
        string stripe_subscription_id
        decimal price
    }
```

### Database Schema Overview

#### Core Tables

1. **workflows** - Workflow configurations and status
2. **transactions** - All financial transactions
3. **affiliate_metrics** - Amazon affiliate performance
4. **api_usage** - API quota and usage tracking
5. **memberships** - User subscription data
6. **amazon_tracking_ids** - Regional tracking IDs
7. **webhook_events** - n8n webhook logs
8. **revenue_by_workflow** - Financial analytics
9. **platform_connections** - External service tokens
10. **alert_notifications** - System alerts

#### Indexing Strategy

```sql
-- Performance critical indexes
CREATE INDEX idx_workflows_status ON workflows(status);
CREATE INDEX idx_workflows_category ON workflows(category);
CREATE INDEX idx_transactions_workflow ON transactions(workflow_id);
CREATE INDEX idx_transactions_date ON transactions(created_at);
CREATE INDEX idx_affiliate_metrics_region ON affiliate_metrics(region);
CREATE INDEX idx_revenue_workflow_date ON revenue_by_workflow(workflow_id, date);
```

## API Architecture

### tRPC API Structure

```typescript
// API Router Hierarchy
const appRouter = router({
  workflows: workflowRouter,
  transactions: transactionRouter,
  analytics: analyticsRouter,
  membership: membershipRouter,
  affiliates: affiliateRouter,
  webhooks: webhookRouter,
});

// Workflow Router
const workflowRouter = router({
  getAll: publicProcedure.query(getAllWorkflows),
  getById: publicProcedure.input(z.string()).query(getWorkflowById),
  update: protectedProcedure.input(workflowUpdateSchema).mutation(updateWorkflow),
  start: protectedProcedure.input(z.string()).mutation(startWorkflow),
  stop: protectedProcedure.input(z.string()).mutation(stopWorkflow),
  getStats: protectedProcedure.query(getWorkflowStats),
});
```

### API Endpoints

#### Public Endpoints
```
GET  /health                 - Health check
GET  /stats                  - Public statistics
GET  /workflows/public       - Public workflow info
```

#### Protected Endpoints
```
GET  /workflows              - User workflows
POST /workflows/start        - Start workflow
PUT  /workflows/:id          - Update workflow
GET  /transactions           - User transactions
GET  /analytics/revenue      - Revenue analytics
POST /webhooks/n8n           - n8n webhook handler
```

#### Admin Endpoints
```
GET  /admin/metrics          - System metrics
POST /admin/workflows        - Create workflows
PUT  /admin/amazon-tracking  - Update tracking IDs
GET  /admin/users            - User management
```

## Workflow Automation

### n8n Integration Architecture

```mermaid
graph TB
    subgraph "Master Orchestrator"
        A[Master Workflow]
        B[Schedule Trigger]
        C[Execute Slaves]
        D[Aggregate Results]
    end
    
    subgraph "Slave Workflows"
        E[Amazon Influencer]
        F[AI Stock Photos]
        G[Redbubble Products]
        H[NFT Base Mint]
        I[Audio Loops]
        J[Newsletter]
        K[DeFi Farming]
    end
    
    subgraph "External Services"
        L[OpenAI]
        M[Stripe]
        N[Amazon API]
        O[Blockchain]
    end
    
    B --> A
    A --> E
    A --> F
    A --> G
    A --> H
    A --> I
    A --> J
    A --> K
    
    E --> L
    F --> L
    G --> N
    H --> O
    J --> M
    
    E --> D
    F --> D
    G --> D
    H --> D
    I --> D
    J --> D
    K --> D
```

### Workflow Configuration

```json
{
  "workflows": {
    "amazon_influencer": {
      "schedule": "0 8,16 * * *",
      "timeout": "30m",
      "retryPolicy": {
        "maxRetries": 3,
        "backoff": "exponential"
      },
      "notifications": {
        "onSuccess": true,
        "onFailure": true,
        "webhookUrl": "/api/webhooks/n8n"
      }
    }
  }
}
```

## Security Model

### Authentication Flow

```mermaid
sequenceDiagram
    participant User
    participant Frontend
    participant API
    participant Auth
    participant Database
    
    User->>Frontend: Login Request
    Frontend->>API: POST /auth/login
    API->>Auth: Validate Credentials
    Auth->>Database: Check User
    Database-->>Auth: User Data
    Auth-->>API: JWT Token
    API-->>Frontend: Token + User Data
    Frontend-->>User: Login Success
```

### Security Layers

1. **Network Security**
   - HTTPS/TLS encryption
   - VPN for admin access
   - IP whitelisting for APIs

2. **Application Security**
   - JWT authentication
   - Rate limiting
   - Input validation with Zod
   - SQL injection protection

3. **Data Security**
   - Encrypted database connections
   - PII data encryption
   - Regular security audits

4. **API Security**
   - API key rotation
   - OAuth 2.0 integration
   - Webhook signature verification

## Scalability Design

### Horizontal Scaling

```mermaid
graph LR
    subgraph "Load Balancer"
        LB[nginx]
    end
    
    subgraph "Application Servers"
        APP1[App Instance 1]
        APP2[App Instance 2]
        APP3[App Instance 3]
    end
    
    subgraph "Database Cluster"
        DB1[Primary DB]
        DB2[Read Replica 1]
        DB3[Read Replica 2]
    end
    
    LB --> APP1
    LB --> APP2
    LB --> APP3
    
    APP1 --> DB1
    APP2 --> DB2
    APP3 --> DB3
```

### Caching Strategy

```mermaid
graph TB
    subgraph "Application Layer"
        A[React App]
    end
    
    subgraph "API Layer"
        B[tRPC API]
        C[Response Cache]
    end
    
    subgraph "Database Layer"
        D[(MySQL)]
        E[(Redis)]
    end
    
    A --> B
    B --> C
    B --> E
    B --> D
    E -.->|Cache Miss| D
```

### Database Scaling

1. **Read Replicas**
   - Multiple read replicas for analytics
   - Geographic distribution for latency

2. **Connection Pooling**
   - MySQL connection pool optimization
   - Connection pooling per service

3. **Query Optimization**
   - Query performance monitoring
   - Index optimization
   - Slow query analysis

## Performance Optimization

### Frontend Optimization

```typescript
// React Query for caching
const { data, isLoading } = useQuery({
  queryKey: ['workflows', userId],
  queryFn: () => api.workflows.getAll(),
  staleTime: 5 * 60 * 1000, // 5 minutes
  cacheTime: 10 * 60 * 1000, // 10 minutes
});
```

### Backend Optimization

```typescript
// Database query optimization
const workflows = await db
  .select({
    id: workflows.id,
    name: workflows.name,
    status: workflows.status,
    totalRevenue: sum(transactions.amount)
  })
  .from(workflows)
  .leftJoin(transactions, eq(workflows.id, transactions.workflowId))
  .groupBy(workflows.id)
  .limit(100)
  .execute();
```

### Caching Layers

1. **Browser Cache**
   - Static assets (CSS, JS)
   - Service worker for offline support

2. **CDN Cache**
   - Global content distribution
   - Edge caching for performance

3. **Application Cache**
   - Redis for session data
   - API response caching
   - Database query results

## Monitoring & Observability

### Metrics Collection

```mermaid
graph TB
    subgraph "Application Metrics"
        A[Business Metrics]
        B[Performance Metrics]
        C[Error Metrics]
    end
    
    subgraph "Infrastructure Metrics"
        D[System Metrics]
        E[Database Metrics]
        F[API Metrics]
    end
    
    subgraph "Storage & Visualization"
        G[Prometheus]
        H[Grafana]
        I[Elasticsearch]
    end
    
    A --> G
    B --> G
    C --> G
    D --> G
    E --> G
    F --> G
    
    G --> H
    G --> I
```

### Alerting Rules

```yaml
# Prometheus Alert Rules
groups:
  - name: automation_ecosystem
    rules:
      - alert: WorkflowFailureRate
        expr: rate(workflow_failures_total[5m]) > 0.1
        for: 2m
        labels:
          severity: critical
        annotations:
          summary: "High workflow failure rate detected"
      
      - alert: RevenueDrop
        expr: revenue_24h < revenue_7d_avg * 0.5
        for: 5m
        labels:
          severity: warning
        annotations:
          summary: "Significant revenue drop detected"
```

### Logging Strategy

```typescript
// Structured logging
import winston from 'winston';

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' }),
  ],
});
```

This architecture provides a solid foundation for a production-ready automation ecosystem with high performance, scalability, and observability.