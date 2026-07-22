'use client';
import { useState } from 'react';

export default function Home() {
  const [jurisdiction, setJurisdiction] = useState('FBiH');
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [loading, setLoading] = useState(false);

  const askAI = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setAnswer('');

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question, jurisdiction }),
      });
      
      const data = await res.json();
      setAnswer(data.answer);
    } catch (err) {
      setAnswer("Failed to connect to the server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-10 font-sans">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Pravni Asistent (BiH)</h1>
      <p className="text-gray-600 mb-8">RAG AI trained on Bosnian Law</p>

      <form onSubmit={askAI} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Select Jurisdiction</label>
          <select 
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-black bg-white"
            value={jurisdiction} 
            onChange={(e) => setJurisdiction(e.target.value)}
          >
            <option value="FBiH">Federation of BiH (FBiH)</option>
            <option value="RS">Republika Srpska (RS)</option>
            <option value="BiH_State">State Level (BiH)</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Your Legal Question</label>
          <input
            type="text"
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-black bg-white"
            placeholder="Koliko traje godišnji odmor?"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            required
          />
        </div>
        
        <button 
          type="submit" 
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition duration-200 disabled:opacity-50"
        >
          {loading ? 'Searching legal database...' : 'Ask Assistant'}
        </button>
      </form>

      {answer && (
        <div className="mt-8 p-6 bg-blue-50 border border-blue-100 rounded-lg">
          <h3 className="text-sm font-bold text-blue-900 mb-2">AI Response:</h3>
          <p className="text-gray-800 leading-relaxed whitespace-pre-wrap">{answer}</p>
        </div>
      )}
    </div>
  );
}