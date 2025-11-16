#!/usr/bin/env node

/**
 * Automation Ecosystem - Database Seed Script
 * 
 * This script populates the database with initial data including:
 * - Workflow configurations
 * - Amazon tracking IDs by region
 * - Sample transactions and metrics
 * - Platform connections
 * - User memberships
 * 
 * Usage: npm run db:seed
 */

import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';
import * as schema from '../db/schema.js';
import { eq } from 'drizzle-orm';

const {
  workflows,
  amazonTrackingIds,
  transactions,
  revenueByWorkflow,
  affiliateMetrics,
  apiUsage,
  platformConnections,
  memberships,
  alertNotifications,
  performanceMetrics
} = schema;

// Database connection
let connection;

// Sample data generators
function generateWorkflowData() {
  return [
    {
      id: 'workflow-amazon-influencer',
      name: 'Amazon Influencer Shorts',
      description: 'Automated product review shorts for YouTube with affiliate links',
      category: 'affiliate_marketing',
      status: 'active',
      frequency: 'daily',
      successRate: '94.50',
      totalRuns: 127,
      isActive: true,
      configuration: {
        platforms: ['youtube', 'amazon'],
        regions: ['US', 'UK', 'DE'],
        affiliateCommission: 8.5,
        contentTypes: ['shorts', 'reviews'],
        aiModel: 'gpt-4'
      }
    },
    {
      id: 'workflow-stock-photos',
      name: 'AI Stock Photos',
      description: 'Generate and sell AI-created stock photography',
      category: 'content_creation',
      status: 'active',
      frequency: 'daily',
      successRate: '89.20',
      totalRuns: 95,
      isActive: true,
      configuration: {
        platforms: ['shutterstock', 'adobe', 'getty'],
        imageTypes: ['abstract', 'business', 'nature'],
        resolutions: ['4k', '8k'],
        aiModel: 'dall-e-3'
      }
    },
    {
      id: 'workflow-redbubble-bulk',
      name: 'Redbubble Bulk Products',
      description: 'Design and upload products in bulk to Redbubble',
      category: 'print_on_demand',
      status: 'active',
      frequency: 'weekly',
      successRate: '94.00',
      totalRuns: 43,
      isActive: true,
      configuration: {
        productTypes: ['t-shirts', 'mugs', 'stickers', 'posters'],
        designStyles: ['minimalist', 'vintage', 'modern'],
        categories: ['tech', 'gaming', 'fitness'],
        commissionRate: 20.0
      }
    },
    {
      id: 'workflow-nft-base',
      name: 'NFT Base Lazy Mint',
      description: 'Create and mint NFT collections on Base blockchain',
      category: 'nft_minting',
      status: 'active',
      frequency: 'weekly',
      successRate: '89.00',
      totalRuns: 28,
      isActive: true,
      configuration: {
        blockchain: 'base',
        collectionSize: 100,
        mintPrice: '0.05',
        royaltyRate: 7.5,
        ipfsGateway: 'pinata'
      }
    },
    {
      id: 'workflow-audio-loops',
      name: 'Audio Loops Bandcamp',
      description: 'Produce and sell royalty-free audio loops',
      category: 'audio_production',
      status: 'active',
      frequency: 'daily',
      successRate: '91.00',
      totalRuns: 78,
      isActive: true,
      configuration: {
        genres: ['lo-fi', 'trap', 'ambient', 'synthwave'],
        formats: ['wav', 'mp3', 'flac'],
        quality: '24-bit',
        priceRange: '12.99-22.99'
      }
    },
    {
      id: 'workflow-newsletter',
      name: 'Newsletter Substack',
      description: 'Automated newsletter creation and distribution',
      category: 'content_marketing',
      status: 'active',
      frequency: 'weekly',
      successRate: '87.00',
      totalRuns: 156,
      isActive: true,
      configuration: {
        platforms: ['substack'],
        contentTypes: ['analysis', 'tips', 'case_studies'],
        frequency: '3x per week',
        engagement: {
          openRate: 35,
          clickRate: 8,
          conversionRate: 12
        }
      }
    },
    {
      id: 'workflow-defi-farming',
      name: 'DeFi Yield Farming',
      description: 'Automated DeFi investment strategies',
      category: 'defi_investment',
      status: 'active',
      frequency: 'continuous',
      successRate: '83.00',
      totalRuns: 234,
      isActive: true,
      configuration: {
        protocols: ['compound', 'aave', 'uniswap', 'yearn'],
        chains: ['ethereum', 'polygon', 'arbitrum'],
        riskTolerance: 'medium',
        minApy: 5.0
      }
    },
    {
      id: 'workflow-master-orchestrator',
      name: 'Master Orchestrator',
      description: 'Coordinates all workflows for optimal performance',
      category: 'orchestration',
      status: 'active',
      frequency: 'continuous',
      successRate: '96.00',
      totalRuns: 345,
      isActive: true,
      configuration: {
        workflows: [
          'workflow-amazon-influencer',
          'workflow-stock-photos',
          'workflow-redbubble-bulk',
          'workflow-nft-base',
          'workflow-audio-loops',
          'workflow-newsletter',
          'workflow-defi-farming'
        ],
        scheduling: {
          peakHours: ['8-10', '14-16', '18-20'],
          timezone: 'America/New_York'
        }
      }
    }
  ];
}

function generateAmazonTrackingIds() {
  return [
    {
      id: 'amazon-tracking-us',
      region: 'US',
      trackingId: 'your-us-tag-20',
      associateTag: 'yourusafili-20',
      isActive: true,
      isPrimary: true,
      performance: {
        clicks: 12547,
        conversions: 389,
        revenue: 15420.75,
        commission: 1310.75
      }
    },
    {
      id: 'amazon-tracking-uk',
      region: 'UK',
      trackingId: 'your-uk-tag-21',
      associateTag: 'yourukamaz-21',
      isActive: true,
      isPrimary: false,
      performance: {
        clicks: 8932,
        conversions: 267,
        revenue: 11234.50,
        commission: 1012.50
      }
    },
    {
      id: 'amazon-tracking-de',
      region: 'DE',
      trackingId: 'your-de-tag-22',
      associateTag: 'yourdeamaz-22',
      isActive: true,
      isPrimary: false,
      performance: {
        clicks: 7654,
        conversions: 234,
        revenue: 9876.25,
        commission: 888.25
      }
    },
    {
      id: 'amazon-tracking-ca',
      region: 'CA',
      trackingId: 'your-ca-tag-20',
      associateTag: 'yourcaamaz-20',
      isActive: true,
      isPrimary: false,
      performance: {
        clicks: 5432,
        conversions: 156,
        revenue: 6789.00,
        commission: 610.00
      }
    },
    {
      id: 'amazon-tracking-fr',
      region: 'FR',
      trackingId: 'your-fr-tag-21',
      associateTag: 'yourframaz-21',
      isActive: true,
      isPrimary: false,
      performance: {
        clicks: 4321,
        conversions: 123,
        revenue: 5432.75,
        commission: 489.75
      }
    }
  ];
}

function generateSampleTransactions() {
  const workflows = [
    'workflow-amazon-influencer',
    'workflow-stock-photos',
    'workflow-redbubble-bulk',
    'workflow-nft-base',
    'workflow-audio-loops',
    'workflow-newsletter',
    'workflow-defi-farming'
  ];

  const transactionTypes = ['affiliate_commission', 'subscription', 'one_time', 'royalty', 'yield'];
  const statuses = ['completed', 'pending', 'failed', 'refunded'];

  const transactions = [];

  // Generate 50 sample transactions
  for (let i = 0; i < 50; i++) {
    const workflowId = workflows[Math.floor(Math.random() * workflows.length)];
    const type = transactionTypes[Math.floor(Math.random() * transactionTypes.length)];
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    
    let amount = 0;
    switch (type) {
      case 'affiliate_commission':
        amount = (Math.random() * 500 + 10).toFixed(2);
        break;
      case 'subscription':
        amount = (Math.random() * 97 + 9).toFixed(2);
        break;
      case 'one_time':
        amount = (Math.random() * 200 + 25).toFixed(2);
        break;
      case 'royalty':
        amount = (Math.random() * 100 + 5).toFixed(2);
        break;
      case 'yield':
        amount = (Math.random() * 50 + 2).toFixed(2);
        break;
    }

    transactions.push({
      id: `tx-${Date.now()}-${i}`,
      type,
      amount: amount,
      currency: 'USD',
      status,
      workflowId,
      paymentMethod: type === 'subscription' ? 'stripe' : 'bank_transfer',
      metadata: {
        source: 'automation_ecosystem',
        workflow_version: '2025.1.0'
      }
    });
  }

  return transactions;
}

function generateRevenueData() {
  const workflows = [
    { id: 'workflow-amazon-influencer', name: 'Amazon Influencer Shorts', revenue: 4250, runs: 127 },
    { id: 'workflow-stock-photos', name: 'AI Stock Photos', revenue: 3120, runs: 95 },
    { id: 'workflow-redbubble-bulk', name: 'Redbubble Bulk Products', revenue: 2847, runs: 43 },
    { id: 'workflow-nft-base', name: 'NFT Base Lazy Mint', revenue: 4250, runs: 28 },
    { id: 'workflow-audio-loops', name: 'Audio Loops Bandcamp', revenue: 1850, runs: 78 },
    { id: 'workflow-newsletter', name: 'Newsletter Substack', revenue: 2875, runs: 156 },
    { id: 'workflow-defi-farming', name: 'DeFi Yield Farming', revenue: 892, runs: 234 }
  ];

  const revenueData = [];

  workflows.forEach(workflow => {
    const daysBack = 30;
    for (let i = 0; i < daysBack; i++) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      
      const dailyRevenue = (workflow.revenue / 30) * (0.8 + Math.random() * 0.4);
      const expenses = dailyRevenue * (0.1 + Math.random() * 0.2);
      const profit = dailyRevenue - expenses;
      const profitMargin = (profit / dailyRevenue) * 100;

      revenueData.push({
        id: `rev-${workflow.id}-${i}`,
        workflowId: workflow.id,
        workflowName: workflow.name,
        date: date.toISOString().split('T')[0],
        revenue: dailyRevenue.toFixed(2),
        expenses: expenses.toFixed(2),
        profit: profit.toFixed(2),
        profitMargin: profitMargin.toFixed(2),
        runs: Math.floor(Math.random() * 5) + 1,
        successRate: (85 + Math.random() * 15).toFixed(2),
        avgRevenuePerRun: (dailyRevenue / (Math.random() * 5 + 1)).toFixed(2)
      });
    }
  });

  return revenueData;
}

function generateAPIUsageData() {
  const services = [
    { name: 'openai', quota: 1000000, currentUsage: 756420 },
    { name: 'stripe', quota: 100000, currentUsage: 23450 },
    { name: 'amazon_associates', quota: 50000, currentUsage: 12340 },
    { name: 'elevenlabs', quota: 10000, currentUsage: 2340 },
    { name: 'n8n', quota: 1000000, currentUsage: 45670 }
  ];

  return services.map(service => ({
    id: `api-${service.name}`,
    service: service.name,
    endpoint: '/v1/completions',
    requests: service.currentUsage,
    successRequests: Math.floor(service.currentUsage * 0.98),
    errorRequests: Math.floor(service.currentUsage * 0.02),
    totalCost: (service.currentUsage * 0.001).toFixed(4),
    quota: service.quota,
    quotaUsed: service.currentUsage,
    date: new Date().toISOString().split('T')[0]
  }));
}

function generatePlatformConnections() {
  return [
    {
      id: 'conn-openai',
      platform: 'openai',
      accountId: 'org-openai-account',
      accountName: 'Automation Ecosystem AI',
      isActive: true,
      lastUsedAt: new Date().toISOString(),
      metadata: {
        model: 'gpt-4',
        totalRequests: 756420,
        costThisMonth: 1250.75
      }
    },
    {
      id: 'conn-stripe',
      platform: 'stripe',
      accountId: 'acct_stripe_account',
      accountName: 'Automation Ecosystem Payments',
      isActive: true,
      lastUsedAt: new Date().toISOString(),
      metadata: {
        monthlyRevenue: 12450.80,
        totalCustomers: 234,
        activeSubscriptions: 187
      }
    },
    {
      id: 'conn-n8n',
      platform: 'n8n',
      accountId: 'n8n-instance',
      accountName: 'Automation Workflows',
      isActive: true,
      lastUsedAt: new Date().toISOString(),
      metadata: {
        workflowsActive: 8,
        executionsToday: 45,
        successRate: 89.2
      }
    }
  ];
}

async function seedDatabase() {
  try {
    console.log('🌱 Starting database seed...');

    // Create connection
    connection = await mysql.createConnection({
      uri: process.env.DATABASE_URL || 'mysql://root:password@localhost:3306/automation_ecosystem'
    });

    // Initialize Drizzle
    const db = drizzle(connection, { schema });

    console.log('📊 Inserting workflows...');
    const workflowData = generateWorkflowData();
    await db.insert(workflows).values(workflowData).onDuplicateKeyUpdate({
      set: {
        name: workflowData[0].name,
        description: workflowData[0].description,
        status: workflowData[0].status,
        updatedAt: new Date()
      }
    });

    console.log('🏪 Inserting Amazon tracking IDs...');
    const trackingData = generateAmazonTrackingIds();
    await db.insert(amazonTrackingIds).values(trackingData).onDuplicateKeyUpdate({
      set: {
        trackingId: trackingData[0].trackingId,
        isActive: trackingData[0].isActive,
        updatedAt: new Date()
      }
    });

    console.log('💰 Inserting sample transactions...');
    const transactionData = generateSampleTransactions();
    await db.insert(transactions).values(transactionData);

    console.log('📈 Inserting revenue data...');
    const revenueData = generateRevenueData();
    await db.insert(revenueByWorkflow).values(revenueData);

    console.log('🔌 Inserting API usage data...');
    const apiData = generateAPIUsageData();
    await db.insert(apiUsage).values(apiData);

    console.log('🔗 Inserting platform connections...');
    const connectionData = generatePlatformConnections();
    await db.insert(platformConnections).values(connectionData).onDuplicateKeyUpdate({
      set: {
        isActive: connectionData[0].isActive,
        lastUsedAt: connectionData[0].lastUsedAt,
        updatedAt: new Date()
      }
    });

    // Generate additional sample data
    console.log('📊 Generating affiliate metrics...');
    const affiliateMetricsData = [];
    const regions = ['US', 'UK', 'DE', 'CA', 'FR'];
    
    for (let i = 0; i < 30; i++) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      
      regions.forEach(region => {
        affiliateMetricsData.push({
          id: `affiliate-${region}-${i}`,
          region,
          trackingId: `tracking-${region.toLowerCase()}`,
          clicks: Math.floor(Math.random() * 500) + 100,
          conversions: Math.floor(Math.random() * 50) + 10,
          revenue: (Math.random() * 1000 + 100).toFixed(2),
          commission: (Math.random() * 100 + 10).toFixed(2),
          conversionRate: (Math.random() * 10 + 2).toFixed(2),
          averageOrderValue: (Math.random() * 200 + 50).toFixed(2),
          date: date.toISOString().split('T')[0]
        });
      });
    }
    
    await db.insert(affiliateMetrics).values(affiliateMetricsData);

    // Insert sample alert notifications
    console.log('🚨 Inserting sample alerts...');
    const alertData = [
      {
        id: 'alert-workflow-1',
        type: 'workflow_failure',
        severity: 'high',
        title: 'Amazon Influencer Workflow Failed',
        message: 'Workflow execution failed due to API rate limit',
        workflowId: 'workflow-amazon-influencer',
        isRead: false,
        data: { error: 'rate_limit_exceeded', retryCount: 3 }
      },
      {
        id: 'alert-revenue-1',
        type: 'revenue_milestone',
        severity: 'info',
        title: 'Monthly Revenue Target Achieved',
        message: 'You have reached 110% of your monthly revenue target',
        workflowId: null,
        isRead: false,
        data: { target: 20000, achieved: 22084, percentage: 110.42 }
      }
    ];
    
    await db.insert(alertNotifications).values(alertData);

    console.log('✅ Database seeded successfully!');
    
    // Print summary
    console.log('\n📊 Seed Summary:');
    console.log(`   • ${workflowData.length} workflows`);
    console.log(`   • ${trackingData.length} Amazon tracking IDs`);
    console.log(`   • ${transactionData.length} sample transactions`);
    console.log(`   • ${revenueData.length} revenue records`);
    console.log(`   • ${apiData.length} API usage records`);
    console.log(`   • ${connectionData.length} platform connections`);
    console.log(`   • ${affiliateMetricsData.length} affiliate metrics`);
    console.log(`   • ${alertData.length} alert notifications`);

  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  seedDatabase();
}

export { seedDatabase };