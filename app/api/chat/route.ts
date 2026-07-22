import { createClient } from '@supabase/supabase-js';
import OpenAI from 'openai';
import { NextResponse } from 'next/server';

// 1. Connect to Supabase and OpenAI
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(req: Request) {
  try {
    const { question, jurisdiction } = await req.json();

    // 2. Turn the user's question into math (embedding)
    const embeddingResponse = await openai.embeddings.create({
      model: 'text-embedding-3-small',
      input: question,
    });
    const queryEmbedding = embeddingResponse.data[0].embedding;

    // 3. Search Supabase for the closest matching laws
    const { data: documents, error } = await supabase.rpc('match_laws', {
      query_embedding: queryEmbedding,
      match_jurisdiction: jurisdiction,
      match_count: 5, // Get the top 5 most relevant articles
    });

    if (error) throw error;

    if (!documents || documents.length === 0) {
      return NextResponse.json({ answer: "I cannot find relevant laws in this jurisdiction for your question." });
    }

    // 4. Combine the retrieved laws into a single text block
    const contextText = documents
      .map((doc: any) => `[${doc.article_id}]: ${doc.text}`)
      .join('\n\n');

    // 5. Send the laws AND the question to ChatGPT to get a human-readable answer
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: `You are a legal assistant for Bosnia and Herzegovina. Answer STRICTLY using the provided context. Cite the article ID for every claim. If the answer is not in the context, say "I do not know."\n\nContext:\n${contextText}`,
        },
        { role: 'user', content: question },
      ],
    });

    // 6. Send the answer back to the frontend
    return NextResponse.json({ answer: completion.choices[0].message.content });

  } catch (error: any) {
    console.error("API Error:", error.message);
    return NextResponse.json({ answer: "An error occurred while searching the legal database." }, { status: 500 });
  }
}