// src/composables/useGemini.js
import axios from 'axios';
import { ref } from 'vue';

export function useGemini() {
  const answer = ref('');
  const error = ref(null);
  const loading = ref(false);

  async function ask(question) {
    loading.value = true;
    error.value = null;

    try {
      const apiKey = 'AIzaSyAxDALFH6DeB1jt4WauABmOfURUOC4TDIQ';
      const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`;

      const payload = {
        contents: [
          {
            parts: [
              { text: `You are TrippAI, an expert in real estate and the Tripp platform. Answer concisely.\nUser: ${question}` }
            ]
          }
        ]
      };

      const response = await axios.post(url, payload, {
        headers: { 'Content-Type': 'application/json' }
      });

      // Gemini returns the answer in content[0].text
      answer.value = response.data?.candidates?.[0]?.content?.[0]?.text || 'No response';
    } catch (err) {
      error.value = err.message;
    } finally {
      loading.value = false;
    }
  }

  return { answer, error, loading, ask };
}
