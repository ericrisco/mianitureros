'use client';

import { useState, ChangeEvent, FormEvent } from 'react';
import Image from 'next/image';

export default function Home() {
  const [artStyle, setArtStyle] = useState<string>('ignore');
  const [subject, setSubject] = useState<string>('WILLYREX_AVATAR');
  const [sceneType, setSceneType] = useState<string>('ignore');
  const [lightingType, setLightingType] = useState<string>('ignore');
  const [mood, setMood] = useState<string>('ignore');
  const [prompt, setPrompt] = useState<string>(''); // Descripción del video
  const [resultImage, setResultImage] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [retriesLeft, setRetriesLeft] = useState<number>(0);

  // Polling function to check the status of the prediction
  const pollForImage = async (predictionId: string) => {
    let attempts = 0;
    const maxAttempts = 30;
    const delay = 10000; // 10 seconds

    setRetriesLeft(maxAttempts);

    while (attempts < maxAttempts) {
      const imageResponse = await fetch(`/api/get-image?predictionId=${predictionId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const imageData = await imageResponse.json();

      if (imageResponse.ok && imageData.status === 'succeeded') {
        setResultImage(imageData.imageUrl[0]);
        setIsLoading(false);
        return;
      }

      attempts += 1;
      setRetriesLeft(maxAttempts - attempts); // Update retries left in button
      await new Promise(resolve => setTimeout(resolve, delay));
    }

    setErrorMessage('Error: No se pudo generar la imagen después de varios intentos.');
    setIsLoading(false);
  };

  // Submit function to start the prediction process
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage('');
    setResultImage('');

    try {
      const response = await fetch('/api/generate-image', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ model: subject, prompt: prompt }),
      });

      if (!response.ok) {
        throw new Error('Error al iniciar la predicción');
      }

      const data = await response.json();
      const predictionId = data.predictionId;

      // Start polling for the result
      await pollForImage(predictionId);

    } catch (error) {
      console.error('Error:', error);
      setErrorMessage((error as Error).message);
      setIsLoading(false);
    }
  };

  // Verificación para habilitar o deshabilitar el botón
  const isFormValid = prompt.trim() !== ''; // Comprueba si la descripción está vacía

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center py-10">
      <div className="bg-white rounded-lg shadow-lg p-10 max-w-5xl w-full">
        <h1 className="text-3xl font-bold text-center mb-6">Generador de Miniaturas para YouTube</h1>
        <div className="mb-6">
          <label className="block mb-2 text-gray-700">Descripción del Video:</label>
          <textarea
            value={prompt}
            onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setPrompt(e.target.value)}
            className="w-full p-2 border rounded-md text-gray-700"
            rows={4}
            placeholder="Escribe aquí el prompt para la imagen"
          />
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Protagonista de la miniatura */}
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

          {/* Estilo de arte */}
          <label className="block">
            <span className="text-gray-700">Estilo de Arte:</span>
            <select
              value={artStyle}
              onChange={(e: ChangeEvent<HTMLSelectElement>) => setArtStyle(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            >
              <option value="">Selecciona un estilo</option>
              <option value="ignore">Ignorar estilo</option>
              <option value="digital art">Arte Digital</option>
              <option value="comic style">Estilo Cómic</option>
              <option value="3D rendering">Renderizado 3D</option>
              <option value="photorealism">Fotorealismo</option>
              <option value="neon retro">Retro Neón</option>
              <option value="anime style">Estilo Anime</option>
            </select>
          </label>

          {/* Tipo de escena */}
          <label className="block">
            <span className="text-gray-700">Tipo de Escena:</span>
            <select
              value={sceneType}
              onChange={(e: ChangeEvent<HTMLSelectElement>) => setSceneType(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            >
              <option value="">Selecciona un tipo de escena</option>
              <option value="ignore">Ignorar estilo</option>
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

          {/* Tipo de iluminación */}
          <label className="block">
            <span className="text-gray-700">Tipo de Iluminación:</span>
            <select
              value={lightingType}
              onChange={(e: ChangeEvent<HTMLSelectElement>) => setLightingType(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            >
              <option value="">Selecciona un tipo de iluminación</option>
              <option value="ignore">Ignorar estilo</option>
              <option value="dramatic spotlight">Foco Dramático</option>
              <option value="neon backlight">Iluminación de Fondo Neón</option>
              <option value="fiery glow">Brillo Ardiente</option>
              <option value="ethereal moonlight">Luz de Luna Etérea</option>
              <option value="strobe lights">Luces Estroboscópicas</option>
            </select>
          </label>

          {/* Estado de ánimo */}
          <label className="block">
            <span className="text-gray-700">Estado de Ánimo:</span>
            <select
              value={mood}
              onChange={(e: ChangeEvent<HTMLSelectElement>) => setMood(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            >
              <option value="">Selecciona un estado de ánimo</option>
              <option value="ignore">Ignorar estilo</option>
              <option value="intense and exciting">Intenso y Emocionante</option>
              <option value="mysterious and thrilling">Misterioso y Emocionante</option>
              <option value="lighthearted and fun">Alegre y Divertido</option>
              <option value="epic and heroic">Épico y Heroico</option>
              <option value="suspenseful and dramatic">Suspense y Drama</option>
            </select>
          </label>

          {/* Botón de envío con texto dinámico */}
          <button
            type="submit"
            className={`w-full py-2 px-4 font-bold rounded-md shadow ${
              isFormValid && !isLoading ? 'bg-indigo-600 text-white hover:bg-indigo-700' : 'bg-gray-400 text-gray-200 cursor-not-allowed'
            }`}
            disabled={!isFormValid || isLoading} // El botón estará inactivo si el formulario no es válido o está cargando
          >
            {isLoading ? `Generando... (${retriesLeft} intentos restantes)` : 'Generar Miniatura'}
          </button>

          {errorMessage && (
            <div className="mt-6 text-red-500">
              <p>Error: {errorMessage}</p>
            </div>
          )}

          {resultImage && (
            <div className="mt-6">
              <Image src={resultImage} alt="Generated Thumbnail" className="mt-4 w-full rounded-lg shadow" width={1000} height={500} />
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
