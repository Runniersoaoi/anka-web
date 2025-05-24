import { useEffect, useRef, useState } from 'react';

const apiKey = import.meta.env.VITE_OPENAI_API_KEY;

export function useCameraDescription() {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [streaming, setStreaming] = useState(false);
  const [loading, setLoading] = useState(false);
  const [description, setDescription] = useState('');
  const [error, setError] = useState(null);
  const [timeLeft, setTimeLeft] = useState(10);

  // Log del estado streaming y tiempo restante
  console.log('Streaming:', streaming);
  console.log('Time Left:', timeLeft);

  // Temporizador para captura automática
  useEffect(() => {
    let timer;
    if (streaming && timeLeft > 0) {
      console.log('Temporizador activo, descontando 1 segundo');
      timer = setTimeout(() => setTimeLeft((prev) => prev - 1), 1000);
    } else if (timeLeft === 0 && streaming) {
      console.log('Tiempo finalizado, capturando imagen');
      captureImage();
    }
    return () => {
      if (timer) {
        console.log('Limpiando temporizador');
        clearTimeout(timer);
      }
    };
  }, [streaming, timeLeft]);

  // Nuevo useEffect para iniciar la reproducción cuando streaming es true
  useEffect(() => {
    if (streaming && videoRef.current) {
      videoRef.current.play()
        .then(() => {
          console.log('Video iniciado correctamente');
        })
        .catch((err) => {
          console.error('Error al reproducir video:', err);
          setError('No se pudo reproducir el video');
          setStreaming(false);
        });
    }
  }, [streaming]);

  const startCamera = async () => {
    try {
      setDescription('');
      setError(null);
      console.log('Intentando acceder a la cámara...');
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      console.log('Stream obtenido:', stream);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        // No llamar a play aquí
        setStreaming(true);
        setTimeLeft(10); // Reiniciar el temporizador
      }
    } catch (err) {
      console.error('Error al iniciar cámara:', err);
      setError('No se pudo acceder a la cámara');
    }
  };

  const stopCamera = () => {
    console.log('Deteniendo cámara...');
    const stream = videoRef.current?.srcObject;
    if (stream) {
      stream.getTracks().forEach((track) => {
        console.log('Deteniendo track:', track);
        track.stop();
      });
    }
    setStreaming(false);
  };

  const captureImage = async () => {
    if (!videoRef.current || !canvasRef.current) {
      console.warn('No hay video o canvas disponible para capturar imagen');
      return;
    }

    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    console.log('Capturando imagen con dimensiones:', canvas.width, canvas.height);
    canvas.getContext('2d').drawImage(video, 0, 0);
    const imageData = canvas.toDataURL('image/jpeg');
    console.log('Imagen capturada en base64, enviando a describir...');
    stopCamera();
    await describeImage(imageData);
  };

  const describeImage = async (imageDataUrl) => {
    try {
      setLoading(true);
      setError(null);
      setDescription('');
      console.log('Enviando imagen a OpenAI para descripción...');

      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
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
      console.log('Respuesta de OpenAI:', data);

      if (data.choices?.[0]?.message?.content) {
        console.log('Descripción recibida:', data.choices[0].message.content);
        setDescription(data.choices[0].message.content);
      } else {
        setError('No se pudo obtener una descripción válida.');
        console.error('Respuesta inválida:', data);
      }
    } catch (err) {
      setError('Error al comunicarse con OpenAI.');
      console.error('Error en describeImage:', err);
    } finally {
      setLoading(false);
    }
  };

  return {
    videoRef,
    canvasRef,
    streaming,
    loading,
    description,
    error,
    timeLeft,
    startCamera,
  };
}
