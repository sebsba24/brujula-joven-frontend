const API_URL = import.meta.env.VITE_API_URL;

// Test conexión
export const getHealth = async () => {
  const res = await fetch(`${API_URL}/health`);
  if (!res.ok) throw new Error("Error en backend");
  return await res.json();
};

// Obtener universidades
export const getUniversidades = async () => {
  const res = await fetch(`${API_URL}/universidades`);
  return await res.json();
};

// Obtener Preguntas
export const getPreguntas = async () => {
  const res = await fetch(`${API_URL}/preguntas/simple`);
  if (!res.ok) {
    throw new Error("Error al obtener preguntas");
  }

  return await res.json();
};

// Enviar datos (ejemplo POST)
export const enviarDatos = async (data) => {
  const res = await fetch(`${API_URL}/ruta-que-tengas`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  return await res.json();
};