import { NextRequest, NextResponse } from 'next/server';
import { generateMindMap } from '@/lib/gemini';
import { GeminiMindMapRequest } from '@/types';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate request body
    const { subject, topic, depth, includeExamples } = body as GeminiMindMapRequest;
    
    if (!subject || !topic) {
      return NextResponse.json(
        { error: 'Missing required fields: subject, topic' },
        { status: 400 }
      );
    }

    const validDepth = depth || 3;
    if (validDepth < 1 || validDepth > 5) {
      return NextResponse.json(
        { error: 'Depth must be between 1 and 5' },
        { status: 400 }
      );
    }

    // Generate mind map using Gemini API
    const mindMapNodes = await generateMindMap({
      subject,
      topic,
      depth: validDepth,
      includeExamples: includeExamples || false
    });

    return NextResponse.json({
      success: true,
      data: {
        nodes: mindMapNodes,
        nodeCount: Object.keys(mindMapNodes).length
      },
      message: `Generated mind map with ${Object.keys(mindMapNodes).length} nodes successfully`
    });

  } catch (error: any) {
    console.error('Error generating mind map:', error);
    
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
        error: 'Failed to generate mind map. Please try again.',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Mind map generation endpoint. Use POST with subject, topic, depth, and includeExamples.',
    example: {
      subject: 'Geography',
      topic: 'Indian Monsoon System',
      depth: 3,
      includeExamples: true
    }
  });
}