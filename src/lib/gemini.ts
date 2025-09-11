import { GoogleGenerativeAI } from '@google/generative-ai';
import { 
  GeminiQuestionRequest, 
  GeminiFlashcardRequest, 
  GeminiMindMapRequest,
  Question,
  Flashcard,
  MindMapNode
} from '@/types';

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

// Get the model
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

// Generate questions using Gemini AI
export async function generateQuestions(request: GeminiQuestionRequest): Promise<Question[]> {
  try {
    const { subject, topic, difficulty, type, count, previousQuestions = [] } = request;
    
    const prompt = createQuestionPrompt(subject, topic, difficulty, type, count, previousQuestions);
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Parse the response and convert to Question objects
    const questions = parseQuestionsFromResponse(text, subject, topic, difficulty, type);
    
    return questions.slice(0, count);
  } catch (error) {
    console.error('Error generating questions:', error);
    throw new Error('Failed to generate questions. Please try again.');
  }
}

// Generate flashcards using Gemini AI
export async function generateFlashcards(request: GeminiFlashcardRequest): Promise<Flashcard[]> {
  try {
    const { subject, topic, content, count } = request;
    
    const prompt = createFlashcardPrompt(subject, topic, content, count);
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Parse the response and convert to Flashcard objects
    const flashcards = parseFlashcardsFromResponse(text, subject, topic);
    
    return flashcards.slice(0, count);
  } catch (error) {
    console.error('Error generating flashcards:', error);
    throw new Error('Failed to generate flashcards. Please try again.');
  }
}

// Generate mind map using Gemini AI
export async function generateMindMap(request: GeminiMindMapRequest): Promise<Record<string, MindMapNode>> {
  try {
    const { subject, topic, depth, includeExamples } = request;
    
    const prompt = createMindMapPrompt(subject, topic, depth, includeExamples);
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Parse the response and convert to MindMapNode objects
    const mindMapNodes = parseMindMapFromResponse(text, topic);
    
    return mindMapNodes;
  } catch (error) {
    console.error('Error generating mind map:', error);
    throw new Error('Failed to generate mind map. Please try again.');
  }
}

// Create prompt for question generation
function createQuestionPrompt(
  subject: string,
  topic: string,
  difficulty: string,
  type: string,
  count: number,
  previousQuestions: string[]
): string {
  const excludeText = previousQuestions.length > 0 
    ? `\n\nAvoid creating questions similar to these previously generated questions:\n${previousQuestions.join('\n')}\n`
    : '';

  const questionTypeInstructions = type === 'mcq' 
    ? `Create multiple choice questions with 4 options each. Format each question as:
       Q: [Question text]
       A) [Option 1]
       B) [Option 2] 
       C) [Option 3]
       D) [Option 4]
       Correct Answer: [Letter]
       Explanation: [Detailed explanation]
       Marks: [Number of marks]`
    : `Create descriptive/essay type questions. Format each question as:
       Q: [Question text]
       Answer Guidelines: [Key points to cover in answer]
       Explanation: [Detailed explanation of the topic]
       Marks: [Number of marks based on complexity]`;

  return `You are an expert UPSC exam question generator. Create ${count} high-quality ${difficulty} level ${type} questions for the subject "${subject}" focusing on the topic "${topic}".

Requirements:
- Questions should be authentic and similar to actual UPSC ${subject} questions
- Difficulty level: ${difficulty}
- Each question should test specific knowledge and analytical thinking
- Include proper explanations with references where applicable
- Questions should be diverse and cover different aspects of the topic
- Use current and relevant examples where appropriate

${questionTypeInstructions}

${excludeText}

Generate exactly ${count} questions following the above format. Separate each question with "---" delimiter.`;
}

// Create prompt for flashcard generation
function createFlashcardPrompt(
  subject: string,
  topic: string,
  content: string,
  count: number
): string {
  return `You are an expert educator creating study flashcards for UPSC preparation. Create ${count} high-quality flashcards for the subject "${subject}" focusing on the topic "${topic}".

Context/Content: ${content}

Requirements:
- Each flashcard should have a clear, concise question/prompt on the front
- The answer should be comprehensive but easy to remember
- Focus on key facts, dates, concepts, and important details
- Make questions that test understanding, not just memorization
- Include mnemonics or memory aids where helpful
- Cover different difficulty levels and aspects of the topic

Format each flashcard as:
Front: [Question/Prompt]
Back: [Comprehensive answer]
Difficulty: [Easy/Medium/Hard]
Tags: [Relevant tags separated by commas]
---

Generate exactly ${count} flashcards following the above format.`;
}

// Create prompt for mind map generation
function createMindMapPrompt(
  subject: string,
  topic: string,
  depth: number,
  includeExamples: boolean
): string {
  const exampleText = includeExamples ? 'Include relevant examples and case studies in leaf nodes.' : '';
  
  return `You are an expert educator creating a mind map for UPSC preparation. Create a comprehensive mind map for the subject "${subject}" focusing on the central topic "${topic}".

Requirements:
- Create a hierarchical structure with ${depth} levels of depth
- Central node: "${topic}"
- Include main branches covering all important aspects
- Each level should break down into more specific subtopics
- Use clear, concise labels for each node
- ${exampleText}
- Organize information logically and pedagogically

Format the mind map as:
Central: [Central topic]
Level1: [Main branch 1]
  Level2: [Sub-branch 1.1]
    Level3: [Sub-sub-branch 1.1.1]
  Level2: [Sub-branch 1.2]
Level1: [Main branch 2]
  Level2: [Sub-branch 2.1]
---

Create a complete mind map structure with proper hierarchy and relationships.`;
}

// Parse questions from Gemini response
function parseQuestionsFromResponse(
  text: string,
  subject: string,
  topic: string,
  difficulty: string,
  type: string
): Question[] {
  const questions: Question[] = [];
  const questionBlocks = text.split('---').filter(block => block.trim());

  for (let i = 0; i < questionBlocks.length; i++) {
    const block = questionBlocks[i].trim();
    const lines = block.split('\n').map(line => line.trim()).filter(line => line);

    try {
      if (type === 'mcq') {
        const question = parseMCQQuestion(lines, subject, topic, difficulty, i);
        if (question) questions.push(question);
      } else {
        const question = parseDescriptiveQuestion(lines, subject, topic, difficulty, i);
        if (question) questions.push(question);
      }
    } catch (error) {
      console.warn(`Failed to parse question block ${i + 1}:`, error);
      continue;
    }
  }

  return questions;
}

// Parse MCQ question
function parseMCQQuestion(
  lines: string[],
  subject: string,
  topic: string,
  difficulty: string,
  index: number
): Question | null {
  try {
    let questionText = '';
    let options: string[] = [];
    let correctAnswer = '';
    let explanation = '';
    let marks = 2;

    for (const line of lines) {
      if (line.startsWith('Q:')) {
        questionText = line.substring(2).trim();
      } else if (line.match(/^[A-D]\)/)) {
        options.push(line.substring(3).trim());
      } else if (line.startsWith('Correct Answer:')) {
        correctAnswer = line.substring(15).trim();
      } else if (line.startsWith('Explanation:')) {
        explanation = line.substring(12).trim();
      } else if (line.startsWith('Marks:')) {
        marks = parseInt(line.substring(6).trim()) || 2;
      }
    }

    if (!questionText || options.length !== 4 || !correctAnswer || !explanation) {
      throw new Error('Incomplete question data');
    }

    // Convert correct answer letter to index
    const correctIndex = correctAnswer.toLowerCase().charCodeAt(0) - 'a'.charCodeAt(0);
    
    return {
      id: `q_${Date.now()}_${index}`,
      type: 'mcq',
      question: questionText,
      options,
      correctAnswer: correctIndex,
      explanation,
      difficulty: difficulty as 'easy' | 'medium' | 'hard',
      subject,
      topic,
      marks,
      references: []
    };
  } catch (error) {
    console.warn('Failed to parse MCQ question:', error);
    return null;
  }
}

// Parse descriptive question
function parseDescriptiveQuestion(
  lines: string[],
  subject: string,
  topic: string,
  difficulty: string,
  index: number
): Question | null {
  try {
    let questionText = '';
    let correctAnswer = '';
    let explanation = '';
    let marks = 10;

    for (const line of lines) {
      if (line.startsWith('Q:')) {
        questionText = line.substring(2).trim();
      } else if (line.startsWith('Answer Guidelines:')) {
        correctAnswer = line.substring(18).trim();
      } else if (line.startsWith('Explanation:')) {
        explanation = line.substring(12).trim();
      } else if (line.startsWith('Marks:')) {
        marks = parseInt(line.substring(6).trim()) || 10;
      }
    }

    if (!questionText || !correctAnswer || !explanation) {
      throw new Error('Incomplete question data');
    }

    return {
      id: `q_${Date.now()}_${index}`,
      type: 'descriptive',
      question: questionText,
      correctAnswer,
      explanation,
      difficulty: difficulty as 'easy' | 'medium' | 'hard',
      subject,
      topic,
      marks,
      references: []
    };
  } catch (error) {
    console.warn('Failed to parse descriptive question:', error);
    return null;
  }
}

// Parse flashcards from Gemini response
function parseFlashcardsFromResponse(
  text: string,
  subject: string,
  topic: string
): Flashcard[] {
  const flashcards: Flashcard[] = [];
  const cardBlocks = text.split('---').filter(block => block.trim());

  for (let i = 0; i < cardBlocks.length; i++) {
    const block = cardBlocks[i].trim();
    const lines = block.split('\n').map(line => line.trim()).filter(line => line);

    try {
      let question = '';
      let answer = '';
      let difficulty = 'medium';
      let tags: string[] = [];

      for (const line of lines) {
        if (line.startsWith('Front:')) {
          question = line.substring(6).trim();
        } else if (line.startsWith('Back:')) {
          answer = line.substring(5).trim();
        } else if (line.startsWith('Difficulty:')) {
          difficulty = line.substring(11).trim().toLowerCase();
        } else if (line.startsWith('Tags:')) {
          tags = line.substring(5).trim().split(',').map(tag => tag.trim());
        }
      }

      if (!question || !answer) {
        throw new Error('Incomplete flashcard data');
      }

      flashcards.push({
        id: `fc_${Date.now()}_${i}`,
        question,
        answer,
        subject,
        topic,
        difficulty: difficulty as 'easy' | 'medium' | 'hard',
        createdBy: '',
        createdAt: new Date(),
        reviewCount: 0,
        confidence: 3,
        tags
      });
    } catch (error) {
      console.warn(`Failed to parse flashcard ${i + 1}:`, error);
      continue;
    }
  }

  return flashcards;
}

// Parse mind map from Gemini response
function parseMindMapFromResponse(
  text: string,
  centralTopic: string
): Record<string, MindMapNode> {
  const nodes: Record<string, MindMapNode> = {};
  const lines = text.split('\n').map(line => line.trim()).filter(line => line);
  
  let rootId = '';
  const levelNodes: { [level: number]: string[] } = {};

  // Create central node
  const centralId = `node_${Date.now()}_central`;
  rootId = centralId;
  
  nodes[centralId] = {
    id: centralId,
    label: centralTopic,
    type: 'central',
    x: 0,
    y: 0,
    color: '#3B82F6',
    children: [],
    level: 0
  };

  let currentLevel = 0;
  let parentStack: string[] = [centralId];

  for (const line of lines) {
    if (line.startsWith('Central:')) continue;

    const levelMatch = line.match(/^(Level\d+):\s*(.+)/);
    if (levelMatch) {
      const level = parseInt(levelMatch[1].replace('Level', ''));
      const label = levelMatch[2].trim();
      
      const nodeId = `node_${Date.now()}_${Math.random()}`;
      
      // Determine parent based on level
      let parentId = rootId;
      if (level > 1 && levelNodes[level - 1]) {
        parentId = levelNodes[level - 1][levelNodes[level - 1].length - 1] || rootId;
      }

      // Create node
      nodes[nodeId] = {
        id: nodeId,
        label,
        type: level === 1 ? 'branch' : 'leaf',
        x: Math.random() * 200 - 100,
        y: Math.random() * 200 - 100,
        color: getNodeColor(level),
        children: [],
        parent: parentId,
        level
      };

      // Add to parent's children
      if (nodes[parentId]) {
        nodes[parentId].children.push(nodeId);
      }

      // Track nodes by level
      if (!levelNodes[level]) levelNodes[level] = [];
      levelNodes[level].push(nodeId);
    }
  }

  return nodes;
}

// Get color for mind map nodes based on level
function getNodeColor(level: number): string {
  const colors = [
    '#3B82F6', // Blue
    '#10B981', // Green
    '#F59E0B', // Yellow
    '#EF4444', // Red
    '#8B5CF6', // Purple
    '#06B6D4', // Cyan
  ];
  
  return colors[level % colors.length] || '#6B7280';
}

// Get subject-specific question templates
export function getSubjectQuestionTemplates(subject: string): string[] {
  const templates: Record<string, string[]> = {
    'History': [
      'Analyze the significance of [event/period] in Indian history',
      'Compare and contrast [historical figure A] and [historical figure B]',
      'Discuss the causes and consequences of [historical event]',
      'Evaluate the impact of [policy/movement] on Indian society'
    ],
    'Geography': [
      'Explain the formation and characteristics of [geographical feature]',
      'Analyze the distribution pattern of [resource/phenomenon]',
      'Discuss the environmental implications of [human activity]',
      'Compare the geographical features of [region A] and [region B]'
    ],
    'Polity': [
      'Analyze the constitutional provisions related to [topic]',
      'Discuss the powers and functions of [constitutional body]',
      'Evaluate the effectiveness of [policy/act/amendment]',
      'Compare the Indian system with [foreign system] regarding [aspect]'
    ],
    'Economics': [
      'Analyze the impact of [economic policy] on Indian economy',
      'Discuss the challenges and opportunities in [economic sector]',
      'Evaluate the effectiveness of [government scheme/program]',
      'Compare the economic indicators before and after [event/policy]'
    ]
  };

  return templates[subject] || templates['History'];
}