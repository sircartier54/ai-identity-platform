'use server'

import { GoogleGenerativeAI } from "@google/generative-ai";
import { supabase } from "@/lib/supabase-client";
import { SURVEY_DATA } from "@/constants/q-partner-test";

if (!process.env.GEMINI_API_KEY) {
  throw new Error("GEMINI_API_KEY is not defined in environment variables.");
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

type AnalyzeResult =
  | { success: true; analysis: string }
  | { success: false; error: string };

const sleep = (ms: number) => new Promise((res) => setTimeout(res, ms));

export async function analyzeRelationship(formData: FormData): Promise<AnalyzeResult> {
  // Build Q&A pairs from the canonical question list + submitted answers
  const answers = SURVEY_DATA.map((q) => {
    const answer = formData.get(q.id)?.toString() ?? "—";
    return { id: q.id, label: q.label, answer };
  });

  const qaPairs = answers
    .map((a) => `Q: ${a.label}\nA: ${a.answer}`)
    .join("\n\n");

  const prompt = `You are a warm, honest, and insightful relationship counselor. 
A user has completed a 24-question relationship self-assessment. 
Analyze their answers and give them a thoughtful, personalized evaluation.

Structure your response exactly like this:

**Overall Impression**
A 2–3 sentence summary of what the answers suggest about the relationship.

**Strengths**
What is genuinely working well based on their specific answers.

**Areas of Concern**
Honest observations about patterns that may be problematic. Be direct but kind.

**Key Takeaway**
One clear, actionable insight they can reflect on today.

Be empathetic but never generic. Ground every point in their actual answers.

Here are the user's answers:

${qaPairs}`;

  const maxRetries = 3;
  const delayMs = 5000;

  let lastError: any = null;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      console.debug(`[Lab Log] Relationship Analysis Attempt ${attempt + 1}...`);

      const model = genAI.getGenerativeModel({ model: "gemini-3-flash-preview" });

      const aiResult = await model.generateContent(prompt);
      const analysisText = aiResult.response.text();

      // Persist to Supabase — store answers as JSON alongside the result
      await supabase.from("partner_tests").insert([
        {
          answers: Object.fromEntries(
            answers.map((a) => [a.id, a.answer])
          ),
          analysis: analysisText,
        },
      ]);

      return { success: true, analysis: analysisText };

    } catch (err: any) {
      lastError = err;

      const isRetryable = err.status === 503 || err.status === 429;

      if (isRetryable && attempt < maxRetries) {
        console.warn(`[Lab Log] Server high demand (${err.status}). Retrying in ${delayMs / 1000}s...`);
        await sleep(delayMs);
        continue;
      }

      break;
    }
  }

  console.error("[Lab Log] Final Analysis Failure:", lastError);
  return {
    success: false,
    error: `System Overload: The lab attempted analysis ${maxRetries + 1} times but the servers are still unresponsive. Try again in a few minutes.`,
  };
}