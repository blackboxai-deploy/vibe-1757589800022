'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { formatRelativeTime, calculatePercentage } from '@/lib/utils';

interface DashboardStats {
  testsAttempted: number;
  averageScore: number;
  totalTimeLearning: number;
  flashcardsReviewed: number;
  currentStreak: number;
  recentTests: any[];
  upcomingGoals: string[];
}

export default function DashboardPage() {
  const { currentUser, logout } = useAuth();
  const router = useRouter();
  const [stats, setStats] = useState<DashboardStats>({
    testsAttempted: 0,
    averageScore: 0,
    totalTimeLearning: 0,
    flashcardsReviewed: 0,
    currentStreak: 0,
    recentTests: [],
    upcomingGoals: []
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!currentUser) {
      router.push('/auth/login');
      return;
    }

    // Load user dashboard data
    loadDashboardData();
  }, [currentUser, router]);

  const loadDashboardData = async () => {
    try {
      setIsLoading(true);
      // TODO: Fetch actual data from Firebase
      // For now, using mock data
      setStats({
        testsAttempted: 15,
        averageScore: 78,
        totalTimeLearning: 120,
        flashcardsReviewed: 450,
        currentStreak: 7,
        recentTests: [
          {
            id: '1',
            title: 'History Mock Test - Ancient India',
            score: 85,
            date: new Date('2024-01-10'),
            subject: 'History'
          },
          {
            id: '2', 
            title: 'Geography Practice - Climate',
            score: 72,
            date: new Date('2024-01-09'),
            subject: 'Geography'
          }
        ],
        upcomingGoals: [
          'Complete 5 more History tests',
          'Review 100 Geography flashcards',
          'Improve Economics score by 10%'
        ]
      });
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      router.push('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  if (!currentUser) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-950 dark:via-blue-950 dark:to-indigo-950">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center h-96">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-950 dark:via-blue-950 dark:to-indigo-950">
      {/* Navigation Header */}
      <header className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <img 
                src="https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/af8c95bf-1798-4041-b74f-02d1538b4ad3.png" 
                alt="UPSC Portal"
                className="rounded-lg"
              />
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                UPSC Portal
              </h1>
            </div>

            <nav className="hidden md:flex items-center space-x-6">
              <Link href="/tests" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">
                Tests
              </Link>
              <Link href="/flashcards" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">
                Flashcards
              </Link>
              <Link href="/mindmaps" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">
                Mind Maps
              </Link>
              <Link href="/analytics" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">
                Analytics
              </Link>
            </nav>

            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <img 
                  src={currentUser.photoURL || `https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/b47833ba-3b10-4457-9918-5ff83e4dceac.png || 'U'}`}
                  alt={currentUser.displayName || 'User'}
                  className="w-8 h-8 rounded-full"
                />
                <span className="hidden md:block text-sm font-medium text-gray-700 dark:text-gray-300">
                  {currentUser.displayName || 'User'}
                </span>
              </div>
              <Button variant="outline" size="sm" onClick={handleLogout}>
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Welcome back, {currentUser.displayName?.split(' ')[0] || 'User'}! 👋
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Continue your UPSC preparation journey. You're doing great!
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <Card className="upsc-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Tests Attempted</p>
                  <p className="text-2xl font-bold text-blue-600">{stats.testsAttempted}</p>
                </div>
                <div className="text-3xl">📝</div>
              </div>
            </CardContent>
          </Card>

          <Card className="upsc-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Average Score</p>
                  <p className="text-2xl font-bold text-green-600">{stats.averageScore}%</p>
                </div>
                <div className="text-3xl">🎯</div>
              </div>
            </CardContent>
          </Card>

          <Card className="upsc-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Hours Studied</p>
                  <p className="text-2xl font-bold text-purple-600">{stats.totalTimeLearning}h</p>
                </div>
                <div className="text-3xl">⏰</div>
              </div>
            </CardContent>
          </Card>

          <Card className="upsc-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Flashcards</p>
                  <p className="text-2xl font-bold text-orange-600">{stats.flashcardsReviewed}</p>
                </div>
                <div className="text-3xl">🗂️</div>
              </div>
            </CardContent>
          </Card>

          <Card className="upsc-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Current Streak</p>
                  <p className="text-2xl font-bold text-red-600">{stats.currentStreak} days</p>
                </div>
                <div className="text-3xl">🔥</div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {/* Quick Actions */}
          <Card className="upsc-card">
            <CardHeader>
              <CardTitle className="flex items-center">
                <span className="mr-2">⚡</span>
                Quick Actions
              </CardTitle>
              <CardDescription>
                Jump right into your preparation
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Link href="/tests/create">
                <Button className="w-full upsc-btn-primary justify-start">
                  🧠 Generate AI Questions
                </Button>
              </Link>
              
              <Link href="/tests">
                <Button variant="outline" className="w-full justify-start">
                  📝 Take Mock Test
                </Button>
              </Link>
              
              <Link href="/flashcards">
                <Button variant="outline" className="w-full justify-start">
                  🗂️ Review Flashcards
                </Button>
              </Link>
              
              <Link href="/mindmaps/create">
                <Button variant="outline" className="w-full justify-start">
                  🌐 Create Mind Map
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Recent Tests */}
          <Card className="upsc-card">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center">
                  <span className="mr-2">📊</span>
                  Recent Tests
                </span>
                <Link href="/tests/history">
                  <Button variant="ghost" size="sm">View All</Button>
                </Link>
              </CardTitle>
              <CardDescription>
                Your latest test performances
              </CardDescription>
            </CardHeader>
            <CardContent>
              {stats.recentTests.length > 0 ? (
                <div className="space-y-3">
                  {stats.recentTests.map((test) => (
                    <div key={test.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <div className="flex-1">
                        <p className="font-medium text-sm">{test.title}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {formatRelativeTime(test.date)}
                        </p>
                      </div>
                      <div className={`text-sm font-semibold px-2 py-1 rounded-full ${
                        test.score >= 80 ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                        test.score >= 60 ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
                        'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                      }`}>
                        {test.score}%
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-4">
                  <p className="text-gray-500 dark:text-gray-400 text-sm">No tests taken yet</p>
                  <Link href="/tests">
                    <Button size="sm" className="mt-2">Take Your First Test</Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Study Goals */}
          <Card className="upsc-card">
            <CardHeader>
              <CardTitle className="flex items-center">
                <span className="mr-2">🎯</span>
                Study Goals
              </CardTitle>
              <CardDescription>
                Your preparation milestones
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {stats.upcomingGoals.map((goal, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <input 
                      type="checkbox" 
                      className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500" 
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">{goal}</span>
                  </div>
                ))}
                
                <Button variant="ghost" size="sm" className="w-full mt-4 text-blue-600">
                  + Add New Goal
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Subject Progress */}
        <div className="mt-8">
          <Card className="upsc-card">
            <CardHeader>
              <CardTitle className="flex items-center">
                <span className="mr-2">📈</span>
                Subject-wise Progress
              </CardTitle>
              <CardDescription>
                Track your performance across different subjects
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { subject: 'History', progress: 85, color: 'bg-blue-500' },
                  { subject: 'Geography', progress: 72, color: 'bg-green-500' },
                  { subject: 'Polity', progress: 68, color: 'bg-purple-500' },
                  { subject: 'Economics', progress: 75, color: 'bg-orange-500' },
                ].map((item) => (
                  <div key={item.subject} className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="font-medium">{item.subject}</span>
                      <span className="text-gray-500">{item.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${item.color}`}
                        style={{ width: `${item.progress}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}