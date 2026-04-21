'use server'

import { GoogleGenerativeAI } from "@google/generative-ai";
import { supabase } from "@/lib/supabase-client";

if (!process.env.GEMINI_API_KEY) {
  throw new Error("GEMINI_API_KEY is not defined in environment variables.");
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

type HoroscopeResponse = 
  | { success: true; horoscope: string } 
  | { success: false; error: string };

const sleep = (ms: number) => new Promise((res) => setTimeout(res, ms));

export async function generateHoroscope(formData: FormData): Promise<HoroscopeResponse> {
  const name = formData.get("name") as string;
  const age = formData.get("age") as string;
  const zodiac = formData.get("zodiac") as string;

  const maxRetries = 3;
  const delayMs = 5000;

  let lastError: any = null;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      console.debug(`[Lab Log] Analysis Attempt ${attempt + 1} for ${name}...`);
      
      const model = genAI.getGenerativeModel({ model: "gemini-3-flash-preview" });
      const prompt = `Act as a cold, analytical AI. 
                      Write a 4-sentence mysterious horoscope for 
                      ${name}, age ${age}, zodiac ${zodiac}.`;
      
      const aiResult = await model.generateContent(prompt);
      const horoscopeText = aiResult.response.text();

      await supabase.from('horoscopes').insert([
        { 
          user_name: name, 
          user_age: parseInt(age), 
          zodiac_sign: zodiac, 
          horoscope_content: horoscopeText 
        }
      ]);

      return { success: true, horoscope: horoscopeText };

    } catch (err: any) {
      lastError = err;
      
      const isRetryable = err.status === 503 || err.status === 429;

      if (isRetryable && attempt < maxRetries) {
        console.warn(`Server high demand (503). Retrying in ${delayMs/1000}s...`);
        await sleep(delayMs);
        continue;
      }

      break;
    }
  }

  console.error("Final Lab Failure:", lastError);
  return { 
    success: false, 
    error: `System Overload: The lab attempted analysis ${maxRetries + 1} times but the servers are still unresponsive. Try again in a few minutes.` 
  };
}