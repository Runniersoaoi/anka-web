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
  const [devices, setDevices] = useState([]);
  const [selectedDeviceId, setSelectedDeviceId] = useState(null);

  const speak = (text) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'es-ES';
    speechSynthesis.speak(utterance);
  };

  useEffect(() => {
    let timer;
    if (streaming && timeLeft > 0) {
      timer = setTimeout(() => {
        const newTime = timeLeft - 1;
        if (newTime === 9) {
          speak('Empezando la cuenta regresiva para capturar el entorno. 10');
        } else if (newTime >= 0) {
          speak(newTime.toString());
        }
        setTimeLeft(newTime);
      }, 1000);
    } else if (timeLeft === 0 && streaming) {
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

  useEffect(() => {
    navigator.mediaDevices.enumerateDevices().then((deviceInfos) => {
      const videoDevices = deviceInfos.filter((device) => device.kind === 'videoinput');
      setDevices(videoDevices);
      if (videoDevices.length > 0 && !selectedDeviceId) {
        setSelectedDeviceId(videoDevices[0].deviceId);
      }
    });
  }, []);

  const startCamera = async () => {
    try {
      setDescription('');
      setError(null);
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { deviceId: selectedDeviceId ? { exact: selectedDeviceId } : undefined }
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
        setStreaming(true);
        setTimeLeft(10);
      }
    } catch (err) {
      console.error('[ERROR] Error al iniciar cámara:', err);
      setError('No se pudo acceder a la cámara');
    }
  };

  const stopCamera = () => {
    const stream = videoRef.current?.srcObject;
    if (stream) {
      stream.getTracks().forEach((track) => {
        track.stop();
      });
    }
    setStreaming(false);
  };

  const captureImage = async () => {
    if (!videoRef.current || !canvasRef.current) return;
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
                { type: 'text', text: 'Describe de manera simplificada lo que ves en esta imagen.' },
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
        setDescription(content);
        speak(content);
      } else {
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
        <div className="mb-4">
          <label className="block mb-1 text-sm font-medium text-gray-700">Selecciona una cámara:</label>
          <select
            value={selectedDeviceId || ''}
            onChange={(e) => setSelectedDeviceId(e.target.value)}
            className="w-full border border-gray-300 rounded-lg p-2"
          >
            {devices.map((device) => (
              <option key={device.deviceId} value={device.deviceId}>
                {device.label || `Cámara ${device.deviceId}`}
              </option>
            ))}
          </select>
        </div>
      )}

      {!streaming && !loading && (
        <button
          onClick={startCamera}
          className="w-full bg-blue-600 text-white text-lg font-semibold py-4 rounded-xl hover:bg-blue-700 transition"
        >
          Activar cámara y capturar en 10s
        </button>
      )}

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
