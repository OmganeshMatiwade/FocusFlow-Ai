import type { EngagementChallenge } from '../types';

// Read API key from environment. Note: calling Google GenAI from browser bundles
// the server-only `@google/genai` package and will cause runtime errors. We
// therefore avoid importing or instantiating the SDK at module load time in
// browser environments. If no API key is set, we use the mock challenge.
const API_KEY = process.env.API_KEY;

if (!API_KEY) {
    console.warn("Gemini API key not found. Using mock data.");
}

// A mock challenge for when the API fails or is not available.
const getMockChallenge = async (): Promise<EngagementChallenge> => {
    return {
        type: 'fun_fact',
        fact: "The AI is napping! Did you know honey never spoils? Archaeologists found pots of honey in ancient Egyptian tombs over 3,000 years old that were still edible."
    };
}

export const getEngagementChallenge = async (): Promise<EngagementChallenge> => {
    // Never attempt to import and use the official Google GenAI SDK from the
    // browser because it depends on Node built-ins and will crash the client
    // bundle. Only use the SDK when an API key is present AND we're running in
    // a non-browser environment (i.e. server). In all other cases, return the
    // mock challenge.
    if (!API_KEY || typeof window !== 'undefined') {
        return getMockChallenge();
    }

    try {
        // Dynamically import the SDK so it is only required on the server side.
        const genai = await import('@google/genai');
        const { GoogleGenAI } = genai as any;
        const ai = new GoogleGenAI({ apiKey: API_KEY });

        // Step 1: Generate the challenge type and content text in one call
        const challengePrompt = `
You are an AI assistant designed to create a brief, engaging micro-challenge to help a distracted student re-focus.
Choose one of the following challenge types: 'joke', 'fun_fact', or 'counting'.
Based on your choice, create the content for the challenge.
Return a single, valid JSON object with a "type" field and the corresponding content fields.

The required structures are:
- For 'joke': { "type": "joke", "question": "A short, classroom-appropriate joke question.", "punchline": "The punchline." }
- For 'fun_fact': { "type": "fun_fact", "fact": "A surprising and interesting fun fact, in a single sentence." }
- For 'counting': { "type": "counting", "imagePrompt": "A simple prompt for an AI image generator, e.g., 'Three cartoon robots waving'", "question": "A question asking to count the items.", "correctAnswer": a number between 2 and 9 }
`;

        const challengeResponse = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: challengePrompt,
            config: {
                responseMimeType: "application/json",
            }
        });

        const challengeJson = JSON.parse(challengeResponse.text);

        if (challengeJson.type === 'counting') {
            // Step 2 (for counting only): Generate the image based on the prompt
            const { imagePrompt, correctAnswer, question } = challengeJson;

            const imageResponse = await ai.models.generateImages({
                model: 'imagen-4.0-generate-001',
                prompt: imagePrompt,
                config: {
                    numberOfImages: 1,
                    outputMimeType: 'image/png',
                    aspectRatio: '16:9'
                },
            });

            const base64ImageBytes = imageResponse.generatedImages[0].image.imageBytes;
            const imageUrl = `data:image/png;base64,${base64ImageBytes}`;

            return { type: 'counting', question, correctAnswer, imageUrl };
        }

        // For joke or fun_fact, the object is already complete
        return challengeJson as EngagementChallenge;

    } catch (error) {
        console.error("Error generating engagement challenge from Gemini API:", error);
        return getMockChallenge(); // Fallback to mock on any API error
    }
};

/**
 * Mocks a call to a Flask backend to apply an idle penalty.
 * In a real application, this would be a fetch() call to an endpoint like '/api/calculate_idle_penalty'.
 * @param currentScore The current engagement score (0.0 to 1.0).
 * @returns A Promise that resolves to the new, decayed score.
 */
export const calculateIdlePenalty = async (currentScore: number): Promise<number> => {
  console.log(`Mock Backend: Applying 2% idle penalty to score of ${currentScore}.`);
  
  // Simulate network latency of a backend call
  await new Promise(resolve => setTimeout(resolve, 300));

  // The backend's logic: apply a 2% penalty.
  const newScore = Math.max(0, currentScore - 0.02);

  console.log(`Mock Backend: New score is ${newScore}.`);
  return newScore;
};