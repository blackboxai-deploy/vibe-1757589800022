import { NextRequest, NextResponse } from 'next/server';
import { generateFlashcards } from '@/lib/gemini';
import { GeminiFlashcardRequest } from '@/types';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate request body
    const { subject, topic, content, count } = body as GeminiFlashcardRequest;
    
    if (!subject || !topic || !count) {
      return NextResponse.json(
        { error: 'Missing required fields: subject, topic, count' },
        { status: 400 }
      );
    }

    if (count < 1 || count > 50) {
      return NextResponse.json(
        { error: 'Count must be between 1 and 50' },
        { status: 400 }
      );
    }

    // Generate flashcards using Gemini API
    const flashcards = await generateFlashcards({
      subject,
      topic,
      content: content || '',
      count
    });

    return NextResponse.json({
      success: true,
      data: flashcards,
      message: `Generated ${flashcards.length} flashcards successfully`
    });

  } catch (error: any) {
    console.error('Error generating flashcards:', error);
    
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
        error: 'Failed to generate flashcards. Please try again.',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Flashcard generation endpoint. Use POST with subject, topic, content, and count.',
    example: {
      subject: 'History',
      topic: 'Mughal Empire',
      content: 'The Mughal Empire was founded by Babur in 1526...',
      count: 10
    }
  });
}