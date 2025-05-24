import React, { useEffect, useRef, useState } from 'react';

const apiKey = import.meta.env.VITE_OPENAI_API_KEY;

export default function CameraImageDescriber() {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [streaming, setStreaming] = useState(false);
  const [loading, setLoading] = useState(false);
  const [description, setDescription] = useState('');
  const [error, setError] = useState(null);
  const [timeLeft, setTimeLeft] = useState(10);

  console.log("[STATE] Streaming:", streaming);

  useEffect(() => {
    let timer;
    if (streaming && timeLeft > 0) {
      timer = setTimeout(() => {
        console.log(`[TIMER] Tiempo restante: ${timeLeft - 1}s`);
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && streaming) {
      console.log("[EVENT] Tiempo terminado, capturando imagen...");
      captureImage();
    }

    return () => clearTimeout(timer);
  }, [streaming, timeLeft]);

  useEffect(() => {
    if (streaming && videoRef.current) {
      videoRef.current.play().catch((err) => {
        console.error('[ERROR] Error al reproducir video:', err);
        setError('No se pudo reproducir el video');
        setStreaming(false);
      });
    }
  }, [streaming]);

  const startCamera = async () => {
    console.log('[ACTION] Iniciando cámara...');
    try {
      setDescription('');
      setError(null);
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
        setStreaming(true);
        setTimeLeft(10);
        console.log('[SUCCESS] Cámara iniciada correctamente');
      }
    } catch (err) {
      console.error('[ERROR] Error al iniciar cámara:', err);
      setError('No se pudo acceder a la cámara');
    }
  };

  const stopCamera = () => {
    console.log('[ACTION] Deteniendo cámara...');
    const stream = videoRef.current?.srcObject;
    if (stream) {
      stream.getTracks().forEach((track) => {
        track.stop();
        console.log(`[STREAM] Track detenido: ${track.kind}`);
      });
    }
    setStreaming(false);
  };

  const captureImage = async () => {
    console.log('[ACTION] Capturando imagen...');
    if (!videoRef.current || !canvasRef.current) {
      console.warn('[WARNING] Referencias no disponibles para captura');
      return;
    }

    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext('2d').drawImage(video, 0, 0);
    const imageData = canvas.toDataURL('image/jpeg');

    stopCamera();
    await describeImage(imageData);
  };

  const describeImage = async (imageDataUrl) => {
    console.log('[API] Enviando imagen a OpenAI para descripción...');
    try {
      setLoading(true);
      setError(null);
      setDescription('');

      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4o',
          messages: [
            {
              role: 'user',
              content: [
                { type: 'text', text: 'Describe en detalle lo que ves en esta imagen.' },
                { type: 'image_url', image_url: { url: imageDataUrl } },
              ],
            },
          ],
          max_tokens: 300,
        }),
      });

      const data = await response.json();
      const content = data?.choices?.[0]?.message?.content;

      if (content) {
        console.log('[API] Descripción recibida:', content);
        setDescription(content);
      } else {
        console.error('[ERROR] Respuesta inválida de la API:', data);
        setError('No se pudo obtener una descripción válida.');
      }
    } catch (err) {
      console.error('[ERROR] Error en describeImage:', err);
      setError('Error al comunicarse con OpenAI.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative p-4 bg-white rounded-xl shadow-md w-full max-w-md mx-auto">
      {!streaming && !loading && (
        <button
          onClick={startCamera}
          className="w-full bg-blue-600 text-white text-lg font-semibold py-4 rounded-xl hover:bg-blue-700 transition"
        >
          Activar cámara y capturar en 10s
        </button>
      )}

      {/* Video SIEMPRE montado, solo oculto si no streaming */}
      <div className={`relative ${!streaming ? 'hidden' : ''}`}>
        <video
          ref={videoRef}
          className="rounded-xl w-full shadow-md"
          autoPlay
          playsInline
          muted
        />
        <div className="absolute bottom-2 right-2 bg-black bg-opacity-50 text-white px-2 py-1 text-sm rounded">
          {timeLeft}s
        </div>
      </div>

      {loading && (
        <p className="mt-2 text-blue-700 font-medium">Procesando imagen...</p>
      )}

      {description && (
        <div className="mt-4 bg-gray-100 text-black rounded-lg p-3 text-base shadow-inner">
          <strong>Descripción:</strong> {description}
        </div>
      )}

      {error && <p className="mt-2 text-red-600 text-sm">{error}</p>}

      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
}
