import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Format duration in minutes to human readable format
export function formatDuration(minutes: number): string {
  if (minutes < 60) {
    return `${minutes} min`;
  }
  
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  
  if (remainingMinutes === 0) {
    return `${hours}h`;
  }
  
  return `${hours}h ${remainingMinutes}m`;
}

// Format date to human readable format
export function formatDate(date: Date | string): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return dateObj.toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

// Format relative time (e.g., "2 hours ago")
export function formatRelativeTime(date: Date | string): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - dateObj.getTime()) / 1000);

  if (diffInSeconds < 60) {
    return 'Just now';
  }

  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `${diffInMinutes} min ago`;
  }

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours}h ago`;
  }

  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) {
    return `${diffInDays}d ago`;
  }

  const diffInWeeks = Math.floor(diffInDays / 7);
  if (diffInWeeks < 4) {
    return `${diffInWeeks}w ago`;
  }

  const diffInMonths = Math.floor(diffInDays / 30);
  return `${diffInMonths}mo ago`;
}

// Calculate percentage with optional decimal places
export function calculatePercentage(value: number, total: number, decimals: number = 1): number {
  if (total === 0) return 0;
  return parseFloat(((value / total) * 100).toFixed(decimals));
}

// Generate random color for mind map nodes
export function generateRandomColor(): string {
  const colors = [
    '#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6',
    '#06B6D4', '#F97316', '#84CC16', '#EC4899', '#6366F1'
  ];
  return colors[Math.floor(Math.random() * colors.length)];
}

// Debounce function for search and input handling
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: NodeJS.Timeout;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
}

// Shuffle array (Fisher-Yates algorithm)
export function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

// Generate unique ID
export function generateId(prefix: string = ''): string {
  const timestamp = Date.now().toString(36);
  const randomPart = Math.random().toString(36).substring(2);
  return prefix ? `${prefix}_${timestamp}_${randomPart}` : `${timestamp}_${randomPart}`;
}

// Validate email format
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Sanitize HTML content
export function sanitizeHtml(html: string): string {
  // Basic HTML sanitization - in production, use a proper library like DOMPurify
  return html
    .replace(/<script[^>]*>.*?<\/script>/gi, '')
    .replace(/<iframe[^>]*>.*?<\/iframe>/gi, '')
    .replace(/javascript:/gi, '')
    .replace(/on\w+="[^"]*"/gi, '');
}

// Format score with color class
export function getScoreColorClass(percentage: number): string {
  if (percentage >= 90) return 'text-green-600 dark:text-green-400';
  if (percentage >= 75) return 'text-blue-600 dark:text-blue-400';
  if (percentage >= 60) return 'text-yellow-600 dark:text-yellow-400';
  if (percentage >= 40) return 'text-orange-600 dark:text-orange-400';
  return 'text-red-600 dark:text-red-400';
}

// Get difficulty badge color
export function getDifficultyColor(difficulty: string): string {
  switch (difficulty.toLowerCase()) {
    case 'easy':
      return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
    case 'medium':
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
    case 'hard':
      return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
  }
}

// Get subject color
export function getSubjectColor(subject: string): string {
  const colors: Record<string, string> = {
    'History': 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200',
    'Geography': 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200',
    'Polity': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    'Economics': 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
    'Environment': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    'Science & Technology': 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-200',
    'Current Affairs': 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
    'International Relations': 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200',
  };
  
  return colors[subject] || 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
}

// Local storage helpers with error handling
export const storage = {
  get: (key: string, defaultValue: any = null) => {
    try {
      if (typeof window === 'undefined') return defaultValue;
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      console.warn(`Error reading from localStorage for key "${key}":`, error);
      return defaultValue;
    }
  },
  
  set: (key: string, value: any) => {
    try {
      if (typeof window === 'undefined') return;
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.warn(`Error writing to localStorage for key "${key}":`, error);
    }
  },
  
  remove: (key: string) => {
    try {
      if (typeof window === 'undefined') return;
      localStorage.removeItem(key);
    } catch (error) {
      console.warn(`Error removing from localStorage for key "${key}":`, error);
    }
  }
};

// Format test type for display
export function formatTestType(type: string): string {
  switch (type) {
    case 'prelims':
      return 'Prelims';
    case 'mains':
      return 'Mains';
    case 'mock':
      return 'Mock Test';
    case 'custom':
      return 'Custom Test';
    default:
      return type;
  }
}

// Calculate reading time for content
export function calculateReadingTime(text: string): number {
  const wordsPerMinute = 200;
  const wordCount = text.trim().split(/\s+/).length;
  return Math.ceil(wordCount / wordsPerMinute);
}

// Check if user is on mobile device
export function isMobile(): boolean {
  if (typeof window === 'undefined') return false;
  return window.innerWidth <= 768;
}

// Truncate text with ellipsis
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength - 3) + '...';
}

// Convert seconds to MM:SS format
export function formatTime(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
}

// Deep clone object
export function deepClone<T>(obj: T): T {
  if (obj === null || typeof obj !== 'object') return obj;
  if (obj instanceof Date) return new Date(obj.getTime()) as any;
  if (obj instanceof Array) return obj.map(item => deepClone(item)) as any;
  if (typeof obj === 'object') {
    const clonedObj = {} as T;
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        clonedObj[key] = deepClone(obj[key]);
      }
    }
    return clonedObj;
  }
  return obj;
}