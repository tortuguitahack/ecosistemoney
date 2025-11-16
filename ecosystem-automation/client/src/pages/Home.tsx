import { Play, Zap, TrendingUp, Shield, Clock, Globe } from 'lucide-react'

export function Home() {
  const features = [
    {
      icon: Zap,
      title: '8 Automated Workflows',
      description: 'Complete automation ecosystem covering Amazon, Stock AI, Notion, Redbubble, NFT, Audio, Newsletter, and DeFi platforms.',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      icon: TrendingUp,
      title: 'Real-time Dashboard',
      description: 'Monitor all workflows, revenue, and performance metrics in real-time with interactive charts and analytics.',
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      icon: Shield,
      title: 'Secure & Reliable',
      description: 'Enterprise-grade security with Stripe integration, webhook monitoring, and automated error handling.',
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
    },
    {
      icon: Clock,
      title: '24/7 Automation',
      description: 'Your workflows run continuously with smart scheduling, retry logic, and performance optimization.',
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
    },
    {
      icon: Globe,
      title: 'Multi-platform Integration',
      description: 'Seamlessly integrates with n8n, Make, Stripe, Amazon Associates, and 50+ other platforms.',
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50',
    },
    {
      icon: Play,
      title: 'Instant Deployment',
      description: 'Get started in minutes with pre-configured workflows, one-click deployment, and guided setup.',
      color: 'text-red-600',
      bgColor: 'bg-red-50',
    },
  ]

  const stats = [
    { label: 'Active Workflows', value: '8', color: 'text-blue-600' },
    { label: 'Monthly Revenue', value: '$12.5K', color: 'text-green-600' },
    { label: 'Success Rate', value: '99.2%', color: 'text-purple-600' },
    { label: 'API Calls/Day', value: '50K+', color: 'text-orange-600' },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <Play className="h-4 w-4 text-white" />
              </div>
              <h1 className="text-xl font-bold text-gray-900">Ecosystem Automation</h1>
            </div>
            <nav className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-gray-600 hover:text-gray-900 transition-colors">Features</a>
              <a href="#pricing" className="text-gray-600 hover:text-gray-900 transition-colors">Pricing</a>
              <a href="#dashboard" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                View Dashboard
              </a>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-20 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Automate Your
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                {' '}Digital Empire
              </span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Complete ecosystem of 8 automated workflows that generate revenue 24/7 across Amazon, 
              Stock Photography, Notion, Redbubble, NFTs, Audio, Newsletter, and DeFi platforms.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold">
                Start Free Trial
              </button>
              <button className="border border-gray-300 text-gray-700 px-8 py-3 rounded-lg hover:bg-gray-50 transition-colors font-semibold">
                Watch Demo
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className={`text-3xl md:text-4xl font-bold ${stat.color} mb-2`}>
                  {stat.value}
                </div>
                <div className="text-gray-600 font-medium">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Everything You Need to Automate Success
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our comprehensive automation ecosystem handles everything from content creation 
              to revenue generation, so you can focus on scaling your business.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon
              return (
                <div
                  key={index}
                  className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 hover:shadow-lg transition-shadow duration-200"
                >
                  <div className={`${feature.bgColor} rounded-lg p-3 ${feature.color} w-fit mb-6`}>
                    <Icon className="h-8 w-8" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Workflows Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              8 Revenue-Generating Workflows
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Each workflow is optimized for maximum revenue and operates independently 
              while contributing to your overall automation ecosystem.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { name: 'Amazon Influencer', status: 'Active', revenue: '$3.2K', color: 'orange' },
              { name: 'Stock AI Photos', status: 'Active', revenue: '$1.8K', color: 'blue' },
              { name: 'Notion + Gumroad', status: 'Active', revenue: '$2.1K', color: 'purple' },
              { name: 'Redbubble Bulk', status: 'Active', revenue: '$1.5K', color: 'green' },
              { name: 'NFT Lazy Mint', status: 'Active', revenue: '$900', color: 'indigo' },
              { name: 'Audio Loops', status: 'Active', revenue: '$1.2K', color: 'red' },
              { name: 'Newsletter', status: 'Active', revenue: '$1.6K', color: 'yellow' },
              { name: 'DeFi Farming', status: 'Active', revenue: '$2.3K', color: 'emerald' },
            ].map((workflow, index) => (
              <div
                key={index}
                className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-gray-900">{workflow.name}</h3>
                  <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Status:</span>
                    <span className="text-green-600 font-medium">{workflow.status}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Monthly Revenue:</span>
                    <span className="text-gray-900 font-medium">{workflow.revenue}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Automate Your Success?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join thousands of entrepreneurs who are already generating passive income 
            with our automation ecosystem. Start your free trial today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-blue-600 px-8 py-3 rounded-lg hover:bg-gray-50 transition-colors font-semibold">
              Start Free Trial
            </button>
            <button className="border border-white text-white px-8 py-3 rounded-lg hover:bg-white hover:text-blue-600 transition-colors font-semibold">
              Schedule Demo
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center space-x-2 mb-8">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <Play className="h-4 w-4 text-white" />
            </div>
            <h3 className="text-xl font-bold">Ecosystem Automation</h3>
          </div>
          <div className="text-center text-gray-400">
            <p>&copy; 2025 MiniMax Agent. Built with React, TypeScript, and Tailwind CSS.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}