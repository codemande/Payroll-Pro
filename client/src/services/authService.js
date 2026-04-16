import api from "./api";

// LOGIN
export const login = async (email, password) => {
  const res = await api.post("/auth/login", {
    email,
    password,
  });
  return res.data;
};

// REGISTER
export const register = async (email, password, fullName) => {
  const res = await api.post("/auth/register", {
    email,
    password,
    fullName,
  });
  return res.data;
};

// GET CURRENT USER
export const getMe = async () => {
  const res = await api.get("/auth/me");
  return res.data;
};

// LOGOUT
export const logout = async () => {
  const res = await api.post("/auth/logout");
  return res.data;
};