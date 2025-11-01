<template>
  <div class="max-w-sm mx-auto bg-white shadow-md rounded p-6 mt-10">
    <h2 class="text-xl font-bold mb-4 text-gray-700">Login</h2>

    <form @submit.prevent="loginUser" class="space-y-3">
      <input
        v-model="username"
        type="text"
        placeholder="Username"
        class="border p-2 w-full rounded"
        required
      />

      <input
        v-model="password"
        type="password"
        placeholder="Password"
        class="border p-2 w-full rounded"
        required
      />

      <button
        type="submit"
        class="bg-blue-600 text-white w-full py-2 rounded hover:bg-blue-700 transition"
      >
        Login
      </button>
    </form>

    <p v-if="error" class="text-red-500 mt-3">{{ error }}</p>

    <p class="mt-4 text-sm text-gray-500">
      Don't have an account?
      <router-link to="/register" class="text-blue-600">Register</router-link>
    </p>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import axios from "axios"; // ✅ Directly use axios
import { useAuthStore } from "@/store/AuthStore";

const username = ref("");
const password = ref("");
const error = ref("");
const router = useRouter();
const auth = useAuthStore();

const loginUser = async () => {
  error.value = "";

  try {
    // 🔹 Send login request
    const res = await auth.login(username.value, password.value);

    if (res?.data?.token) {
      const token = res.data.token;

      // ✅ Save token and username
      localStorage.setItem("token", token);
      localStorage.setItem("username", username.value);
      localStorage.setItem("role", res.data.role);

      // ✅ Configure Axios to attach the token automatically
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      console.log("JWT stored:", token);
      alert("Login successful!");

      // Redirect to home or dashboard
      router.push("/");
    } else {
      error.value = "Invalid response from server";
    }
  } catch (err) {
    console.error("Login error:", err);
    if (err.response?.status === 401) {
      error.value = "Invalid username or password";
    } else {
      error.value = "Server error. Please try again.";
    }
  }
};
</script>
