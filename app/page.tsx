'use client';

import { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import Image from 'next/image';

export default function Home() {
  const [artStyle, setArtStyle] = useState<string>('digital art');
  const [subject, setSubject] = useState<string>('WILLYREX_AVATAR');
  const [sceneType, setSceneType] = useState<string>('an explosive cityscape');
  const [lightingType, setLightingType] = useState<string>('dramatic spotlight');
  const [mood, setMood] = useState<string>('intense and exciting');
  const [additionalDetails] = useState<string>('with bright, vivid colors');
  const [extraDetails] = useState<string>('');
  const [, setPrompt] = useState<string>('');
  const [resultImage, setResultImage] = useState<string>('');
  const [isFormValid, setIsFormValid] = useState<boolean>(false);
  const [videoDescription, setVideoDescription] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    setIsFormValid(
      videoDescription.trim() !== '' &&
      artStyle !== '' &&
      subject !== '' &&
      sceneType !== '' &&
      lightingType !== '' &&
      mood !== ''
    );
  }, [videoDescription, artStyle, subject, sceneType, lightingType, mood, additionalDetails, extraDetails]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    setResultImage('');

    try {
      const response = await fetch('/api/generate-prompt', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ videoDescription, artStyle, subject, sceneType, lightingType, mood, additionalDetails, extraDetails }),
      });

      if (!response.ok) {
        throw new Error('Error al generar el prompt');
      }

      const data = await response.json();
      setPrompt(data.generatedPrompt);

      const imageResponse = await fetch('/api/generate-image', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ model: subject, prompt: data.generatedPrompt }),
      });

      if (!imageResponse.ok) {
        throw new Error('Error en la generación de la imagen');
      }

      const imageData = await imageResponse.json();
      setResultImage(imageData.imageUrl[0]);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center py-10">
      <div className="bg-white rounded-lg shadow-lg p-10 max-w-5xl w-full">
        <h1 className="text-3xl font-bold text-center mb-6">Generador de Miniaturas para YouTube</h1>
        <div className="mb-6">
          <label className="block mb-2 text-gray-700">Descripción del Video:</label>
          <textarea
            value={videoDescription}
            onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setVideoDescription(e.target.value)}
            className="w-full p-2 border rounded-md text-gray-700"
            rows={4}
            placeholder="Ejemplo: 'Partida de Call Of Duty con amigos en el mapa Nuketown'."
          />
          <small className="text-gray-600">Describe qué pasa en tu video y qué te gustaría que apareciera en la miniatura.</small>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Protagonista de la miniatura como primer campo */}
          <label className="block">
            <span className="text-gray-700">Protagonista de la miniatura:</span>
            <select
              value={subject}
              onChange={(e: ChangeEvent<HTMLSelectElement>) => setSubject(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            >
              <option value="">Selecciona un sujeto</option>
              <option value="WILLYREX_AVATAR">Willyrex</option>
              <option value="MARCURGELL_AVATAR">Marc Urgell</option>
            </select>
          </label>

          <label className="block">
            <span className="text-gray-700">Estilo de Arte:</span>
            <select
              value={artStyle}
              onChange={(e: ChangeEvent<HTMLSelectElement>) => setArtStyle(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            >
              <option value="">Selecciona un estilo</option>
              <option value="digital art">Arte Digital</option>
              <option value="comic style">Estilo Cómic</option>
              <option value="3D rendering">Renderizado 3D</option>
              <option value="photorealism">Fotorealismo</option>
              <option value="neon retro">Retro Neón</option>
              <option value="anime style">Estilo Anime</option>
            </select>
          </label>

          <label className="block">
            <span className="text-gray-700">Tipo de Escena:</span>
            <select
              value={sceneType}
              onChange={(e: ChangeEvent<HTMLSelectElement>) => setSceneType(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            >
              <option value="">Selecciona un tipo de escena</option>
              <option value="an explosive cityscape">Un Paisaje Urbano Explosivo</option>
              <option value="a vibrant carnival">Un Carnaval Vibrante</option>
              <option value="a magical forest at dusk">Un Bosque Mágico al Atardecer</option>
              <option value="a futuristic arena">Una Arena Futurista</option>
              <option value="a vast desert with a storm">Un Desierto con Tormenta</option>
              <option value="a battle royale island">Una Isla de Battle Royale</option>
              <option value="a medieval castle under siege">Un Castillo Medieval Bajo Asedio</option>
              <option value="a racing track with neon lights">Una Pista de Carreras con Luces de Neón</option>
              <option value="a bustling space station">Una Estación Espacial Bulliciosa</option>
              <option value="a haunted mansion">Una Mansión Embrujada</option>
              <option value="an enchanted village">Una Aldea Encantada</option>
              <option value="a futuristic city skyline">Un Horizonte Urbano Futurista</option>
            </select>
          </label>

          <label className="block">
            <span className="text-gray-700">Tipo de Iluminación:</span>
            <select
              value={lightingType}
              onChange={(e: ChangeEvent<HTMLSelectElement>) => setLightingType(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            >
              <option value="">Selecciona un tipo de iluminación</option>
              <option value="dramatic spotlight">Foco Dramático</option>
              <option value="neon backlight">Iluminación de Fondo Neón</option>
              <option value="fiery glow">Brillo Ardiente</option>
              <option value="ethereal moonlight">Luz de Luna Etérea</option>
              <option value="strobe lights">Luces Estroboscópicas</option>
            </select>
          </label>

          <label className="block">
            <span className="text-gray-700">Estado de Ánimo:</span>
            <select
              value={mood}
              onChange={(e: ChangeEvent<HTMLSelectElement>) => setMood(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            >
              <option value="">Selecciona un estado de ánimo</option>
              <option value="intense and exciting">Intenso y Emocionante</option>
              <option value="mysterious and thrilling">Misterioso y Emocionante</option>
              <option value="lighthearted and fun">Alegre y Divertido</option>
              <option value="epic and heroic">Épico y Heroico</option>
              <option value="suspenseful and dramatic">Suspense y Drama</option>
            </select>
          </label>

          <button
            type="submit"
            className={`w-full py-2 px-4 font-bold rounded-md shadow ${
              isFormValid ? 'bg-indigo-600 text-white hover:bg-indigo-700' : 'bg-gray-400 text-gray-200 cursor-not-allowed'
            }`}
            disabled={!isFormValid || isLoading}
          >
            {isLoading ? 'Generando...' : 'Generar Miniatura'}
          </button>
        </form>

        {resultImage && (
          <div className="mt-6">
            <Image src={resultImage} alt="Generated Thumbnail" className="mt-4 w-full rounded-lg shadow" width={1000} height={500} />
          </div>
        )}
      </div>
    </div>
  );
}
