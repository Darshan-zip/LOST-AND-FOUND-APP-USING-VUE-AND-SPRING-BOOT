<template>
  <nav class="bg-gray-800 text-white px-6 py-3 flex justify-between">
    <div class="font-semibold text-lg">Lost & Found</div>
    <div class="flex gap-4 items-center">
      <router-link to="/" class="hover:text-blue-300">Home</router-link>
      <router-link to="/my-items" v-if="auth.isAuthenticated" class="hover:text-blue-300">My Items</router-link>
      <router-link to="/login" v-if="!auth.isAuthenticated" class="hover:text-blue-300">Login</router-link>
      <button v-if="auth.isAuthenticated" @click="logout" class="bg-red-500 px-2 py-1 rounded hover:bg-red-600">Logout</button>
    </div>
  </nav>
</template>

<script setup>
import { useAuthStore } from '@/store/AuthStore'
import { useRouter } from 'vue-router'
const auth = useAuthStore()
const router = useRouter()

const logout = () => {
  auth.logout()
  router.push('/login')
}
</script>
