import type { NextApiRequest, NextApiResponse } from 'next';
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const SYSTEM_PROMPT = `You are an expert in generating visually striking image generation prompts specifically for YouTube thumbnails. 
Your task is to take various parameters, such as a subject, art style, scene type, lighting, mood, and additional details, along with a video description, and craft a highly descriptive prompt for creating an engaging YouTube thumbnail.

The subject provided should always be the central figure and protagonist of the thumbnail. Make sure to:
- Highlight the subject as the main focus of the image, ensuring it is visually dominant and instantly recognizable.
- Ensure that the art style, lighting, scene, and mood complement and emphasize the subject.
- The prompt should create a sense of visual impact and clarity, with a strong composition where the subject stands out.
- The thumbnail should be eye-catching, suitable for YouTube, and compelling enough to attract clicks.
- The subject's name must be used exactly as provided.
- Only return the prompt, do not add any additional information or explanations.
- The face of the subject should be clearly visible.

Your goal is to create a prompt that results in a visually powerful thumbnail where the subject is the undeniable star of the image.`;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { videoDescription, artStyle, subject, sceneType, lightingType, mood, additionalDetails, extraDetails } = req.body;

  if (!videoDescription || !artStyle || !subject || !sceneType || !lightingType || !mood) {
    return res.status(400).json({ message: 'All required fields must be filled out' });
  }

  try {
    const userMessage = `
    Video description: ${videoDescription}
    Art style: ${artStyle}
    Subject: ${subject}
    Scene type: ${sceneType}
    Lighting type: ${lightingType}
    Mood: ${mood}
    Additional details: ${additionalDetails ? additionalDetails : 'None'}
    Extra details: ${extraDetails ? extraDetails : 'None'}
    `;

    const response = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: SYSTEM_PROMPT,
        },
        {
          role: 'user',
          content: `Generate a YouTube thumbnail image prompt where the subject is the main protagonist, based on the following details: ${userMessage}`,
        },
      ],
    });

    const context = response.choices[0]?.message?.content?.trim() || '';

    return res.status(200).json({ generatedPrompt: context });
  } catch (error) {
    console.error('Error interacting with OpenAI:', error);
    return res.status(500).json({ message: 'Error generating the context' });
  }
}
