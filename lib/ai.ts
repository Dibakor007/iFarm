
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// Simple In-memory Cache to prevent redundant calls
const insightCache = new Map<string, { response: string; expiry: number }>();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes cache

/**
 * Utility function for exponential backoff retry
 */
async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  retries = 3,
  delay = 1000
): Promise<T> {
  try {
    return await fn();
  } catch (error: any) {
    const status = error?.status || (error as any)?.response?.status;
    // Only retry on 429 (Rate Limit) or 5xx (Server Error)
    if (retries > 0 && (status === 429 || (status >= 500 && status <= 599))) {
      console.warn(`API error ${status}. Retrying in ${delay}ms... (${retries} attempts left)`);
      await new Promise((resolve) => setTimeout(resolve, delay));
      return retryWithBackoff(fn, retries - 1, delay * 2);
    }
    throw error;
  }
}

export async function getAgriInsights(prompt: string) {
  const now = Date.now();
  
  // 1. Check Cache
  const cached = insightCache.get(prompt);
  if (cached && cached.expiry > now) {
    return cached.response;
  }

  try {
    // 2. Execute with Retry Logic
    const response = await retryWithBackoff(async () => {
      return await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
        config: {
          systemInstruction: "You are an expert Bangladeshi agricultural consultant for iFarm. Provide concise, actionable advice in Bangla. Focus on cold storage optimization, crop health, and supply chain efficiency. Do not use markdown headers, keep it as plain text or simple bullet points.",
          temperature: 0.7,
        },
      });
    });

    const result = response.text || "";
    
    // 3. Update Cache
    if (result) {
      insightCache.set(prompt, { response: result, expiry: now + CACHE_TTL });
    }

    return result;
  } catch (error: any) {
    console.error("AI Insight Error:", error);
    
    const status = error?.status || (error as any)?.response?.status;
    if (status === 429) {
      return "দুঃখিত, বর্তমানে এআই সার্ভারটি অত্যন্ত ব্যস্ত (Quota Exceeded)। অনুগ্রহ করে কিছুক্ষণ পর পুনরায় চেষ্টা করুন।";
    }
    
    return "বর্তমানে এআই পরামর্শ পাওয়া যাচ্ছে না। অনুগ্রহ করে পরে চেষ্টা করুন।";
  }
}
