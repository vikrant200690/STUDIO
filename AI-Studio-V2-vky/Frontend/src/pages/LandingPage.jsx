import React, { useState, useEffect } from 'react';
import { Sparkles, BarChart3, MessageSquare, Zap, Lock, Box, Code, TrendingUp, ChevronRight, Menu, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';

export default function LandingPage() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleStarted = ()=>{
    console.log("login called");
    navigate('/login');
  }
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    // Prevent horizontal scroll
    document.body.style.overflowX = 'hidden';
    return () => {
      window.removeEventListener('scroll', handleScroll);
      document.body.style.overflowX = 'auto';
    };
  }, []);

  const features = [
    {
      icon: <MessageSquare className="w-6 h-6" />,
      title: "AI Chat Interface",
      description: "Engage with powerful AI models through an intuitive conversational interface"
    },
    {
      icon: <Box className="w-6 h-6" />,
      title: "Model Playground",
      description: "Discover and test AI models with real-time configuration and comparison"
    },
    {
      icon: <BarChart3 className="w-6 h-6" />,
      title: "Analytics Dashboard",
      description: "Monitor API usage, costs, and performance metrics in real-time"
    },
    {
      icon: <Code className="w-6 h-6" />,
      title: "Plugins & Scripts",
      description: "Extend functionality with custom plugins and automation scripts"
    },
    {
      icon: <Lock className="w-6 h-6" />,
      title: "Scripts Marketplace",
      description: ""
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: "Startup Templates",
      description: "Access documentation and resources to maximize your AI experience"
    }
  ];

  const stats = [
    { value: "98%", label: "Model Accuracy" },
    { value: "10+", label: "AI Models" },
    { value: "24/7", label: "Uptime" },
    { value: "<3s", label: "Response Time" }
  ];

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white overflow-x-hidden">
      {/* Navigation */}
      <nav className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? 'bg-slate-950/80 backdrop-blur-lg border-b border-purple-500/20' : 'bg-transparent'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-600 rounded-lg flex items-center justify-center font-bold">
                N
              </div>
              <span className="text-xl font-bold">NEXUS AI</span>
            </div>
            
            <div className="hidden md:flex items-center gap-8">
              <a href="#features" className="hover:text-purple-400 transition-colors">Features</a>
              <a href="#models" className="hover:text-purple-400 transition-colors">Models</a>
              <a href="#pricing" className="hover:text-purple-400 transition-colors">Pricing</a>
              <a href="#docs" className="hover:text-purple-400 transition-colors">Docs</a>
              <button className="px-6 py-2 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg hover:scale-105 transition-transform font-medium" onClick={handleStarted}>
                Get Started
              </button>
            </div>

            <button 
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-slate-900 border-t border-purple-500/20">
            <div className="px-4 sm:px-6 py-4 flex flex-col gap-4">
              <a href="#features" className="hover:text-purple-400 transition-colors">Features</a>
              <a href="#models" className="hover:text-purple-400 transition-colors">Models</a>
              <a href="#pricing" className="hover:text-purple-400 transition-colors">Pricing</a>
              <a href="#docs" className="hover:text-purple-400 transition-colors">Docs</a>
              <button className="px-6 py-2 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg font-medium">
                Get Started
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-500/10 border border-purple-500/20 rounded-full mb-6">
              <Sparkles className="w-4 h-4 text-purple-400" />
              <span className="text-sm text-purple-300">Next-Generation AI Platform</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-purple-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent leading-tight">
              The All-in-One AI Platform for Developers
            </h1>
            
            <p className="text-xl text-slate-300 mb-8 leading-relaxed">
              Explore powerful AI models, chat with advanced assistants, and monitor your usage with real-time analytics. 
              Everything you need to experiment with AI in one place.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <DotLottieReact
                src="https://lottie.host/4b3688a7-62d6-4cdc-9fb6-6719ddaf51f0/2lJS6tb22N.lottie"
                loop
                autoplay
                />
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-20">
              {stats.map((stat, i) => (
                <div key={i} className="text-center">
                  <div className="text-3xl md:text-4xl font-bold text-purple-400 mb-2">{stat.value}</div>
                  <div className="text-slate-400">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 sm:px-6 bg-slate-900/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Everything You Need</h2>
            <p className="text-xl text-slate-400">Powerful tools to explore, test, and monitor AI models</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, i) => (
              <div 
                key={i}
                className="p-6 bg-slate-800/50 border border-slate-700 rounded-xl hover:border-purple-500/50 transition-all hover:scale-105 group"
              >
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <div className="text-purple-400">
                    {feature.icon}
                  </div>
                </div>
                <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                <p className="text-slate-400">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Model Showcase */}
      <section id="models" className="py-20 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Available AI Models</h2>
            <p className="text-xl text-slate-400">Choose from our curated selection of AI models</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-8 bg-gradient-to-br from-blue-900/30 to-slate-800 border border-blue-500/30 rounded-xl">
              <div className="w-16 h-16 bg-blue-500 rounded-xl flex items-center justify-center mb-4">
                <Box className="w-8 h-8" />
              </div>
              <div className="text-sm text-blue-400 mb-2">AI Sales Assistant</div>
              <h3 className="text-2xl font-bold mb-2">Hyundai Sales AI</h3>
              <p className="text-slate-300 mb-4">Personalized car buying assistant with budget checks</p>
              <div className="flex items-center gap-4 text-sm">
                <span className="text-green-400">94.9% accuracy</span>
                <span className="text-slate-400">1.6s response</span>
              </div>
            </div>

            <div className="p-8 bg-gradient-to-br from-purple-900/30 to-slate-800 border border-purple-500/30 rounded-xl">
              <div className="w-16 h-16 bg-purple-500 rounded-xl flex items-center justify-center mb-4">
                <Box className="w-8 h-8" />
              </div>
              <div className="text-sm text-purple-400 mb-2">AI Entertainment</div>
              <h3 className="text-2xl font-bold mb-2">Nova</h3>
              <p className="text-slate-300 mb-4">Movie suggestions and real-time ticket booking</p>
              <div className="flex items-center gap-4 text-sm">
                <span className="text-green-400">87.9% accuracy</span>
                <span className="text-slate-400">1.6s response</span>
              </div>
            </div>

            <div className="p-8 bg-gradient-to-br from-pink-900/30 to-slate-800 border border-pink-500/30 rounded-xl">
              <div className="w-16 h-16 bg-pink-500 rounded-xl flex items-center justify-center mb-4">
                <Box className="w-8 h-8" />
              </div>
              <div className="text-sm text-pink-400 mb-2">Knowledge Intelligence</div>
              <h3 className="text-2xl font-bold mb-2">KnowledgeWeaver</h3>
              <p className="text-slate-300 mb-4">Transforms data into queryable knowledge graph</p>
              <div className="flex items-center gap-4 text-sm">
                <span className="text-green-400">90.4% accuracy</span>
                <span className="text-slate-400">2.1s response</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 bg-gradient-to-r from-purple-900/20 to-blue-900/20 border-y border-purple-500/20">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">Ready to Explore AI?</h2>
          <p className="text-xl text-slate-300 mb-8">
            Join thousands of developers testing and experimenting with AI models
          </p>
          <button className="px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg hover:scale-105 transition-transform font-medium text-lg shadow-lg shadow-purple-500/20 inline-flex items-center gap-2">
            Get Started Now
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 sm:px-6 border-t border-slate-800">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-blue-600 rounded-lg flex items-center justify-center font-bold text-sm">
                  N
                </div>
                <span className="font-bold">NEXUS AI</span>
              </div>
              <p className="text-slate-400 text-sm">Explore and test AI models with ease</p>
            </div>
            
            <div>
              <h4 className="font-bold mb-4">Product</h4>
              <div className="flex flex-col gap-2 text-slate-400 text-sm">
                <a href="#" className="hover:text-purple-400 transition-colors">Features</a>
                <a href="#" className="hover:text-purple-400 transition-colors">Models</a>
                <a href="#" className="hover:text-purple-400 transition-colors">Pricing</a>
                <a href="#" className="hover:text-purple-400 transition-colors">API</a>
              </div>
            </div>
            
            <div>
              <h4 className="font-bold mb-4">Resources</h4>
              <div className="flex flex-col gap-2 text-slate-400 text-sm">
                <a href="#" className="hover:text-purple-400 transition-colors">Documentation</a>
                <a href="#" className="hover:text-purple-400 transition-colors">Tutorials</a>
                <a href="#" className="hover:text-purple-400 transition-colors">Blog</a>
                <a href="#" className="hover:text-purple-400 transition-colors">Support</a>
              </div>
            </div>
            
            <div>
              <h4 className="font-bold mb-4">Company</h4>
              <div className="flex flex-col gap-2 text-slate-400 text-sm">
                <a href="#" className="hover:text-purple-400 transition-colors">About</a>
                <a href="#" className="hover:text-purple-400 transition-colors">Careers</a>
                <a href="#" className="hover:text-purple-400 transition-colors">Contact</a>
                <a href="#" className="hover:text-purple-400 transition-colors">Legal</a>
              </div>
            </div>
          </div>
          
          <div className="pt-8 border-t border-slate-800 text-center text-slate-400 text-sm">
            <p>© 2025 NEXUS AI. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}