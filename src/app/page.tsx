'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function HomePage() {
  const { currentUser, loading } = useAuth();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!loading && currentUser && mounted) {
      router.push('/dashboard');
    }
  }, [currentUser, loading, router, mounted]);

  if (loading || !mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (currentUser) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="container mx-auto px-4 py-20">
          <div className="text-center">
            <div className="mb-8">
              <img 
                src="https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/dc65eb5c-ccaf-4ce8-85cf-003a5ff9c198.png" 
                alt="UPSC Portal Logo - Comprehensive Exam Preparation Platform"
                className="mx-auto rounded-full shadow-lg"
              />
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
              Master UPSC with AI
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
              Your complete preparation platform with AI-powered question generation, 
              personalized flashcards, interactive mind maps, and comprehensive analytics.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <Link href="/auth/register">
                <Button size="lg" className="upsc-btn-primary text-lg px-8 py-3">
                  Start Your Journey
                </Button>
              </Link>
              
              <Link href="/auth/login">
                <Button variant="outline" size="lg" className="text-lg px-8 py-3">
                  Sign In
                </Button>
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-16 max-w-4xl mx-auto">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600">10K+</div>
                <div className="text-gray-600 dark:text-gray-400">AI Questions</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600">500+</div>
                <div className="text-gray-600 dark:text-gray-400">Mock Tests</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600">1K+</div>
                <div className="text-gray-600 dark:text-gray-400">Flashcards</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-orange-600">95%</div>
                <div className="text-gray-600 dark:text-gray-400">Success Rate</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white/50 dark:bg-gray-900/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Complete UPSC Preparation Suite
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Everything you need to crack UPSC in one intelligent platform
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="upsc-card hover:scale-105 transition-transform">
              <CardHeader>
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center mb-4">
                  <span className="text-2xl">🧠</span>
                </div>
                <CardTitle>AI Question Generation</CardTitle>
                <CardDescription>
                  Gemini AI generates unlimited Prelims & Mains questions tailored to your preparation level
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                  <li>• Subject-wise question banks</li>
                  <li>• Adaptive difficulty levels</li>
                  <li>• Previous year pattern analysis</li>
                  <li>• Detailed explanations</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="upsc-card hover:scale-105 transition-transform">
              <CardHeader>
                <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center mb-4">
                  <span className="text-2xl">📊</span>
                </div>
                <CardTitle>Performance Analytics</CardTitle>
                <CardDescription>
                  Real-time insights into your preparation with detailed performance tracking
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                  <li>• Subject-wise analysis</li>
                  <li>• Progress tracking</li>
                  <li>• Weakness identification</li>
                  <li>• Improvement suggestions</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="upsc-card hover:scale-105 transition-transform">
              <CardHeader>
                <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center mb-4">
                  <span className="text-2xl">🗂️</span>
                </div>
                <CardTitle>Smart Flashcards</CardTitle>
                <CardDescription>
                  AI-generated flashcards for efficient revision and memory retention
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                  <li>• Auto-generated content</li>
                  <li>• Spaced repetition</li>
                  <li>• Custom deck creation</li>
                  <li>• Progress tracking</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="upsc-card hover:scale-105 transition-transform">
              <CardHeader>
                <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900 rounded-lg flex items-center justify-center mb-4">
                  <span className="text-2xl">🌐</span>
                </div>
                <CardTitle>Interactive Mind Maps</CardTitle>
                <CardDescription>
                  Visual learning with AI-created mind maps for complex topics
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                  <li>• Visual concept mapping</li>
                  <li>• Topic relationships</li>
                  <li>• Interactive exploration</li>
                  <li>• Easy sharing</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="upsc-card hover:scale-105 transition-transform">
              <CardHeader>
                <div className="w-12 h-12 bg-red-100 dark:bg-red-900 rounded-lg flex items-center justify-center mb-4">
                  <span className="text-2xl">⏱️</span>
                </div>
                <CardTitle>Timed Mock Tests</CardTitle>
                <CardDescription>
                  Realistic exam simulation with comprehensive result analysis
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                  <li>• Full-length mock tests</li>
                  <li>• Sectional tests</li>
                  <li>• Auto-evaluation</li>
                  <li>• Detailed feedback</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="upsc-card hover:scale-105 transition-transform">
              <CardHeader>
                <div className="w-12 h-12 bg-cyan-100 dark:bg-cyan-900 rounded-lg flex items-center justify-center mb-4">
                  <span className="text-2xl">📱</span>
                </div>
                <CardTitle>Mobile Responsive</CardTitle>
                <CardDescription>
                  Study anywhere, anytime with our responsive design
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                  <li>• Cross-platform support</li>
                  <li>• Offline capabilities</li>
                  <li>• Sync across devices</li>
                  <li>• Touch-friendly interface</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Ready to Transform Your UPSC Preparation?
            </h2>
            
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
              Join thousands of successful candidates who chose our AI-powered platform
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link href="/auth/register">
                <Button size="lg" className="upsc-btn-primary text-lg px-10 py-4">
                  Get Started Free
                </Button>
              </Link>
              
              <Link href="/features">
                <Button variant="outline" size="lg" className="text-lg px-10 py-4">
                  Learn More
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">UPSC Portal</h3>
              <p className="text-gray-400 text-sm">
                Your comprehensive AI-powered UPSC preparation platform
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-3">Platform</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link href="/features" className="hover:text-white">Features</Link></li>
                <li><Link href="/tests" className="hover:text-white">Mock Tests</Link></li>
                <li><Link href="/flashcards" className="hover:text-white">Flashcards</Link></li>
                <li><Link href="/mindmaps" className="hover:text-white">Mind Maps</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-3">Support</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link href="/help" className="hover:text-white">Help Center</Link></li>
                <li><Link href="/contact" className="hover:text-white">Contact</Link></li>
                <li><Link href="/faq" className="hover:text-white">FAQ</Link></li>
                <li><Link href="/feedback" className="hover:text-white">Feedback</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-3">Legal</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link href="/privacy" className="hover:text-white">Privacy Policy</Link></li>
                <li><Link href="/terms" className="hover:text-white">Terms of Service</Link></li>
                <li><Link href="/cookies" className="hover:text-white">Cookie Policy</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-400">
            <p>&copy; 2024 UPSC Portal. All rights reserved. Built with AI for UPSC Success.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}