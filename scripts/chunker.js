const fs = require('fs');

// 1. Read your newly saved zakon.txt file
const rawLegalText = fs.readFileSync('zakon.txt', 'utf8');

// 2. The Updated Regex Magic
// This splits the text exactly at "Član [number]." OR "Član [number][letter]." (like Član 20a.)
const parts = rawLegalText.split(/(Član \d+[a-z]?\.)/g);

const processedChunks = [];

// 3. Loop through the split parts
// parts[0] is the title page. parts[1] is "Član 1.", parts[2] is the text of Član 1, etc.
for (let i = 1; i < parts.length; i += 2) {
  const articleIdText = parts[i]; 
  const articleContent = parts[i + 1] ? parts[i + 1].trim() : "";

  // Extract just the exact ID (e.g., "1" or "20a")
  const articleNumberMatch = articleIdText.match(/Član (\d+[a-z]?)\./);
  const articleId = articleNumberMatch ? `Clan_${articleNumberMatch[1]}` : "Clan_Unknown";

  // Recombine the "Član" title with its text so the AI has the full context to read
  const fullText = `${articleIdText}\n${articleContent}`;

  processedChunks.push({
    text: fullText,
    metadata: {
      jurisdiction: "FBiH",
      document_type: "Zakon_o_radu",
      article_id: articleId
    }
  });
}

console.log(JSON.stringify(processedChunks, null, 2));