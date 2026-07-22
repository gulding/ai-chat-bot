# Pravni Asistent (BiH)

A Next.js-based AI legal assistant trained specifically on Bosnian law (Federation of BiH, Republika Srpska, and State Level). This application utilizes Retrieval-Augmented Generation (RAG) to provide accurate, context-aware answers to complex legal inquiries based on a customized vector database.

## 🚀 Features

*   **Jurisdiction Selection:** Users can tailor their queries to specific legal frameworks within Bosnia and Herzegovina (FBiH, RS, or State Level).
*   **Vector Search Retrieval:** Leverages OpenAI's text embeddings (`text-embedding-3-small`) to convert user queries into high-dimensional vectors, querying a Supabase pgvector database for the most relevant legal articles.
*   **Contextual Generation:** Uses OpenAI's `gpt-4o-mini` to synthesize a natural language response strictly based on the retrieved legal context, ensuring high accuracy and minimizing hallucinations.
*   **Citations:** Automatically cites the specific article IDs used to formulate the answer.
*   **Modern UI:** Built with React, Next.js App Router, and styled with Tailwind CSS for a responsive, clean interface.

## 🛠️ Tech Stack

*   **Frontend:** React, Next.js (App Router), Tailwind CSS
*   **Backend:** Next.js API Routes, Node.js
*   **Database:** Supabase (PostgreSQL with `pgvector`)
*   **AI/LLM:** OpenAI API (Embeddings & Chat Completions)
*   **Language:** TypeScript

## ⚙️ Local Development Setup

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/yourusername/ai-chat-bot.git
    cd ai-chat-bot
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Environment Variables:**
    Create a `.env.local` file in the root directory and add your API keys:
    ```env
    NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
    SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
    OPENAI_API_KEY=your_openai_api_key
    ```

4.  **Run the development server:**
    ```bash
    npm run dev
    ```

5.  **Open the application:**
    Navigate to `http://localhost:3000` in your browser.

## 🗺️ Future Roadmap

*   **Agentic Architecture:** Transition from rigid RAG to an Agent-based system using tools (function calling) for more autonomous decision-making and complex multi-step reasoning.
*   **Conversational Memory:** Implement multi-turn chat capabilities (e.g., using the Vercel AI SDK) to allow for follow-up questions and persistent context.
*   **User Feedback Loop:** Integrate thumbs-up/down rating mechanisms to capture user signals and continuously refine the retrieval accuracy.
*   **Proprietary Fine-Tuning:** Utilize captured chat logs and user corrections to eventually fine-tune a dedicated legal LLM.

## 📝 License

This project is licensed under the MIT License.
