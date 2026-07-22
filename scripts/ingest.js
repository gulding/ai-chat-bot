const fs = require('fs');
const { createClient } = require('@supabase/supabase-js');
const { OpenAI } = require('openai');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

async function ingest() {
  console.log("Starting ingestion process...");

  // 1. Read the text file
  const rawText = fs.readFileSync('zakon.txt', 'utf8');
  
  if (rawText.trim() === "") {
      console.log("❌ Error: zakon.txt is empty! Please paste your text and save the file.");
      return;
  }

  // 2. Split the text by "Član [number]." 
  // We use (?:Član|Clan) to handle potential missing accent marks (C vs Č)
  const parts = rawText.split(/(?:Član|Clan)\s+(\d+[a-z]?)\./i);
  
  let processedCount = 0;

  // 3. Loop through the parts. 
  // parts[0] is the preamble, parts[1] is the first number, parts[2] is the text, etc.
  for (let i = 1; i < parts.length; i += 2) {
    const articleNum = parts[i]; 
    const articleContent = parts[i + 1] ? parts[i + 1].trim() : "";
    
    if (!articleContent) continue;

    const articleId = `Clan_${articleNum}`;
    const fullText = `Član ${articleNum}.\n${articleContent}`;

    console.log(`Processing ${articleId}...`);

    try {
        // A. Send text to OpenAI to get the vector math (embedding)
        const response = await openai.embeddings.create({
          model: 'text-embedding-3-small',
          input: fullText,
        });
        
        // B. Send the text, embedding, and metadata to Supabase
        const { error } = await supabase.from('bosnian_laws').insert({
          text: fullText,
          jurisdiction: "FBiH",
          article_id: articleId,
          embedding: response.data[0].embedding
        });

        if (error) {
            console.error(`❌ Supabase error on ${articleId}:`, error.message);
        } else {
            processedCount++;
        }
    } catch (err) {
        console.error(`❌ OpenAI error on ${articleId}:`, err.message);
    }
  }
  
  console.log(`\n✅ Ingestion complete! Successfully added ${processedCount} articles to Supabase.`);
}

ingest();