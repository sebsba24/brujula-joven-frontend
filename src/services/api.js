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
  const res = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(JSON.stringify(error));
  }
  return res.json();
};

// ==================== 2FA ====================

export const verify2FALogin = async (temp_token, code) => {
  const res = await fetch(`${API_URL}/auth/2fa/verify`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ temp_token, code }),
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(JSON.stringify(error));
  }
  return res.json();
};

export const setup2FA = () =>
  fetchAPI("/auth/2fa/setup", { method: "POST" });

export const enable2FA = (code) =>
  fetchAPI("/auth/2fa/enable", {
    method: "POST",
    body: JSON.stringify({ code }),
  });

export const disable2FA = (code) =>
  fetchAPI("/auth/2fa/disable", {
    method: "POST",
    body: JSON.stringify({ code }),
  });

export const get2FAStatus = () =>
  fetchAPI("/auth/2fa/status");

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

export const guardarRespuestas = (data) =>
  fetchAPI("/respuestas-cuestionario/guardar", {
    method: "POST",
    body: JSON.stringify(data),
  });

export const getPerfilByUsuario = async (id_usuario) => {
  return await fetchAPI(`/usuarios/${id_usuario}/perfil`);
};

export const getRecomendacionesByUsuario = (id_usuario) =>
  fetchAPI(`/usuarios/${id_usuario}/recomendaciones`);

// ==================== FINANCIERO ====================

export const guardarPerfilFinanciero = (data) =>
  fetchAPI("/financiero/guardar", {
    method: "POST",
    body: JSON.stringify(data),
  });

export const getPerfilFinanciero = (id_usuario) =>
  fetchAPI(`/usuarios/${id_usuario}/perfil-financiero`);

export const eliminarPerfilFinanciero = (id_usuario) =>
  fetchAPI(`/usuarios/${id_usuario}/perfil-financiero`, { method: "DELETE" });

export const getRecomendacionesEducacion = (id_usuario) =>
  fetchAPI(`/usuarios/${id_usuario}/recomendaciones-educacion`);

export const eliminarRespuestasCuestionario = (id_usuario) =>
  fetchAPI(`/usuarios/${id_usuario}/respuestas-cuestionario`, { method: "DELETE" });

// ==================== EMPLEO ====================

export const getProgresoEmpleo = (id_usuario) =>
  fetchAPI(`/usuarios/${id_usuario}/progreso-empleo`);

export const guardarProgresoEmpleo = (id_usuario, recursos_completados) =>
  fetchAPI(`/usuarios/${id_usuario}/progreso-empleo`, {
    method: "POST",
    body: JSON.stringify({ recursos_completados }),
  });

// ==================== CHAT ====================

export const sendChatMessage = (message, history = []) =>
  fetchAPI("/chat/message", {
    method: "POST",
    body: JSON.stringify({ message, history }),
  });