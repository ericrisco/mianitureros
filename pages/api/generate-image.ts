import type { NextApiRequest, NextApiResponse } from 'next';

const REPLICATE_API_URL = 'https://api.replicate.com/v1/predictions';
const API_KEY = process.env.REPLICATE_API_KEY;

async function createPrediction(replicate_model: string, prompt: string) {
  const response = await fetch(REPLICATE_API_URL, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${API_KEY}`,
      'Content-Type': 'application/json',
      'Prefer': 'wait=30',  // Wait for up to 30 seconds for completion
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
  return data;
}

async function getPredictionStatus(predictionId: string) {
  const response = await fetch(`${REPLICATE_API_URL}/${predictionId}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${API_KEY}`,
    }
  });

  const data = await response.json();
  return data;
}

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
    // Step 1: Call the inference API to create a prediction
    const prediction = await createPrediction(replicate_model, prompt);
    const predictionId = prediction.id;

    // Step 2: Wait for 30 seconds and check the initial status
    let predictionStatus = prediction;
    if (prediction.status !== 'succeeded') {
      let attempts = 0;
      const maxAttempts = 30;
      const checkInterval = 10000; // 10 seconds

      // Step 3: Poll every 10 seconds up to 30 times if not completed
      while (predictionStatus.status !== 'succeeded' && attempts < maxAttempts) {
        await new Promise((resolve) => setTimeout(resolve, checkInterval));
        predictionStatus = await getPredictionStatus(predictionId);
        attempts += 1;
      }
    }

    // Step 4: If the prediction succeeded, return the output
    if (predictionStatus.status === 'succeeded') {
      return res.status(200).json({ imageUrl: predictionStatus.output });
    } else {
      throw new Error('Prediction did not complete successfully');
    }
  } catch (error) {
    console.error('Error generating image with Replicate:', error);
    return res.status(500).json({ message: 'Error generating the image' });
  }
}
