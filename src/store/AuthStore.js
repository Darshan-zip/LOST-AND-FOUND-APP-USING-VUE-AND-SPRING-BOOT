import { defineStore } from "pinia";
import api from "@/api";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    user: null,
    token: localStorage.getItem("token") || null,
  }),

  actions: {
    async login(username, password) {
      try {
        const res = await api.post("/auth/login", { username, password });

        // ✅ store token
        this.token = res.data.token;
        localStorage.setItem("token", this.token);

        // ✅ set default Authorization header for all future requests
        api.defaults.headers.common["Authorization"] = `Bearer ${this.token}`;

        // ✅ optionally store username for UI display
        this.user = username;

        return res; // return response to LoginForm
      } catch (err) {
        console.error("Login error:", err);
        throw err; // rethrow for component to catch
      }
    },

    async register(username, email, password, role = "USER") {
      try {
        const res = await api.post("/auth/register", {
          username,
          email,
          password,
          role,
        });
        return res;
      } catch (err) {
        console.error("Registration error:", err);
        throw err;
      }
    },

    logout() {
      this.token = null;
      this.user = null;
      localStorage.removeItem("token");
      delete api.defaults.headers.common["Authorization"];
    },
  },

  getters: {
    isAuthenticated: (state) => !!state.token,
  },
});
