import { NextRequest, NextResponse } from 'next/server';
import { generateQuestions } from '@/lib/gemini';
import { GeminiQuestionRequest } from '@/types';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate request body
    const { subject, topic, difficulty, type, count } = body as GeminiQuestionRequest;
    
    if (!subject || !topic || !difficulty || !type || !count) {
      return NextResponse.json(
        { error: 'Missing required fields: subject, topic, difficulty, type, count' },
        { status: 400 }
      );
    }

    if (!['easy', 'medium', 'hard'].includes(difficulty)) {
      return NextResponse.json(
        { error: 'Difficulty must be one of: easy, medium, hard' },
        { status: 400 }
      );
    }

    if (!['mcq', 'descriptive'].includes(type)) {
      return NextResponse.json(
        { error: 'Type must be one of: mcq, descriptive' },
        { status: 400 }
      );
    }

    if (count < 1 || count > 20) {
      return NextResponse.json(
        { error: 'Count must be between 1 and 20' },
        { status: 400 }
      );
    }

    // Generate questions using Gemini API
    const questions = await generateQuestions({
      subject,
      topic,
      difficulty,
      type,
      count,
      previousQuestions: body.previousQuestions || []
    });

    return NextResponse.json({
      success: true,
      data: questions,
      message: `Generated ${questions.length} questions successfully`
    });

  } catch (error: any) {
    console.error('Error generating questions:', error);
    
    // Handle specific error types
    if (error.message?.includes('API key')) {
      return NextResponse.json(
        { error: 'Invalid or missing API key configuration' },
        { status: 401 }
      );
    }
    
    if (error.message?.includes('quota') || error.message?.includes('limit')) {
      return NextResponse.json(
        { error: 'API quota exceeded. Please try again later.' },
        { status: 429 }
      );
    }

    return NextResponse.json(
      { 
        error: 'Failed to generate questions. Please try again.',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Question generation endpoint. Use POST with subject, topic, difficulty, type, and count.',
    example: {
      subject: 'History',
      topic: 'Ancient India',
      difficulty: 'medium',
      type: 'mcq',
      count: 5
    }
  });
}