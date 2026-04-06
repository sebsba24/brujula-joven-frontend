const API_URL = import.meta.env.VITE_API_URL;

// ==================== TOKEN ====================

export const getToken = () => localStorage.getItem("token");

export const setToken = (token) => {
  localStorage.setItem("token", token);
};

export const removeToken = () => {
  localStorage.removeItem("token");
};

// ==================== FETCH BASE ====================

const fetchAPI = async (url, options = {}) => {
  const token = getToken();

  const headers = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_URL}${url}`, {
    ...options,
    headers,
  });

  // Manejo de errores mejorado
  if (!res.ok) {
    const error = await res.json();
    console.error("ERROR BACKEND:", error);
    throw new Error(JSON.stringify(error));
  }

  return res.json();
};

// ==================== AUTH ====================

export const loginUser = async (data) => {
  const res = await fetchAPI("/auth/login", {
    method: "POST",
    body: JSON.stringify(data),
  });

  setToken(res.access_token);

  return res;
};

export const logoutUser = () => {
  removeToken();
};

// ==================== USUARIO ====================

export const registerUser = async (data) => {
  return fetchAPI("/usuarios", {
    method: "POST",
    body: JSON.stringify(data),
  });
};

// ==================== DATA ====================

export const getUniversidades = () => fetchAPI("/universidades");

export const getPreguntasPorNivel = async (nivel) => {
  return fetchAPI(`/preguntas/nivel/${nivel}`);
};

export const getPreguntasPorRasgo = async (rasgo) => {
  return fetchAPI(`/preguntas/rasgo/${rasgo}`);
};

export const getPreguntasMultiplesPorGrupo = async (grupo) => {
  return fetchAPI(`/preguntas/multiples/${grupo}`);
};

export const guardarRespuestas = async (data) => {
  return fetchAPI("/respuestas-cuestionario/guardar", {
    method: "POST",
    body: JSON.stringify(data)
  });
};