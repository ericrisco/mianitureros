import type { NextApiRequest, NextApiResponse } from 'next';

const REPLICATE_API_URL = 'https://api.replicate.com/v1/predictions';
const API_KEY = process.env.REPLICATE_API_KEY;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { model, prompt } = req.body;

  if (!model || !prompt) {
    return res.status(400).json({ message: 'Model and prompt are required.' });
  }

  let replicate_model: `${string}/${string}:${string}` = '' as `${string}/${string}:${string}`;
  if (model === 'WILLYREX_AVATAR')
    replicate_model = 'ericrisco-at/willyrex:cf3f35c9fc7c495596ff94b6a1e0b8ec263b46c9be0610d33088d65a5dbc3471';

  if (model === 'MARCURGELL_AVATAR')
    replicate_model = 'ericrisco-at/marcurgell:d31340ddc9a3b242d7835de9db42b0fabdac8421e1d4187c2b804c0672b06580';

  try {
    // Step 1: Create the prediction
    const response = await fetch(REPLICATE_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        version: replicate_model,
        input: {
          model: 'dev',
          prompt: prompt,
          lora_scale: 1,
          num_outputs: 1,
          aspect_ratio: '16:9',
          output_format: 'png',
          guidance_scale: 3.5,
          output_quality: 40,
          prompt_strength: 0.8,
          extra_lora_scale: 1,
          num_inference_steps: 28,
        }
      })
    });

    const data = await response.json();
    return res.status(200).json({ predictionId: data.id });
  } catch (error) {
    console.error('Error generating image with Replicate:', error);
    return res.status(500).json({ message: 'Error generating the image' });
  }
}
