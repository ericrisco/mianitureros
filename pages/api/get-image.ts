import type { NextApiRequest, NextApiResponse } from 'next';

const REPLICATE_API_URL = 'https://api.replicate.com/v1/predictions';
const API_KEY = process.env.REPLICATE_API_KEY;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { predictionId } = req.query;

  if (!predictionId) {
    return res.status(400).json({ message: 'Prediction ID is required.' });
  }

  try {
    const response = await fetch(`${REPLICATE_API_URL}/${predictionId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
      }
    });

    const data = await response.json();

    if (data.status === 'succeeded') {
      return res.status(200).json({ imageUrl: data.output, status: 'succeeded' });
    }

    return res.status(200).json({ status: data.status });
  } catch (error) {
    console.error('Error fetching prediction status:', error);
    return res.status(500).json({ message: 'Error fetching the prediction status' });
  }
}
