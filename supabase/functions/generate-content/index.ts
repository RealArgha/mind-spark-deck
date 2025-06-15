
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { content, type, count = 10 } = await req.json();

    if (!openAIApiKey) {
      throw new Error('OpenAI API key not configured');
    }

    let systemPrompt = '';
    if (type === 'flashcards') {
      systemPrompt = `You are an expert educator. Create ${count} high-quality flashcards from the provided content. Return a JSON array where each object has:
      - "front": A clear, concise question or prompt
      - "back": A detailed answer or explanation
      - "difficulty": "easy", "medium", or "hard"
      
      Focus on key concepts, definitions, processes, and important facts. Make questions varied and educational.`;
    } else if (type === 'quiz') {
      systemPrompt = `You are an expert educator. Create ${count} multiple-choice quiz questions from the provided content. Return a JSON array where each object has:
      - "question": A clear, specific question
      - "options": An array of 4 possible answers
      - "correctAnswer": The index (0-3) of the correct answer
      - "explanation": A brief explanation of why the answer is correct
      
      Make questions challenging but fair, covering different aspects of the content.`;
    }

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: `Content to process:\n\n${content}` }
        ],
        temperature: 0.7,
        max_tokens: 3000,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    const generatedContent = data.choices[0].message.content;

    // Try to parse the JSON response
    let parsedContent;
    try {
      // Remove any markdown formatting
      const cleanContent = generatedContent.replace(/```json\n?|\n?```/g, '').trim();
      parsedContent = JSON.parse(cleanContent);
    } catch (parseError) {
      // If JSON parsing fails, return a structured error
      throw new Error('Failed to parse AI response as JSON');
    }

    return new Response(JSON.stringify({ 
      success: true, 
      data: parsedContent 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in generate-content function:', error);
    return new Response(JSON.stringify({ 
      success: false, 
      error: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
