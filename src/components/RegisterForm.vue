<template>
  <div class="max-w-sm mx-auto bg-white shadow-md rounded p-6 mt-10">
    <h2 class="text-xl font-bold mb-4 text-gray-700">Register</h2>
    <form @submit.prevent="registerUser" class="space-y-3">
      <input
        v-model="username"
        type="text"
        placeholder="Username"
        class="border p-2 w-full rounded"
        required
      />

      <input
        v-model="email"
        type="email"
        placeholder="Email"
        class="border p-2 w-full rounded"
        required
        @input="validateEmail"
      />
      <p v-if="email && !isValidEmail" class="text-red-500 text-sm">Please enter a valid email address.</p>

      <input
        v-model="password"
        type="password"
        placeholder="Password"
        class="border p-2 w-full rounded"
        required
      />

      <select v-model="role" class="border p-2 w-full rounded">
        <option value="USER">User</option>
        <option value="ADMIN">Admin</option>
      </select>

      <button
        class="bg-green-600 text-white w-full py-2 rounded hover:bg-green-700 disabled:opacity-50"
        :disabled="!isValidEmail"
      >
        Register
      </button>
    </form>

    <p v-if="message" class="text-green-600 mt-3">{{ message }}</p>
    <p v-if="error" class="text-red-500 mt-3">{{ error }}</p>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useAuthStore } from '@/store/AuthStore'

const username = ref('')
const email = ref('')
const password = ref('')
const role = ref('USER')
const message = ref('')
const error = ref('')
const auth = useAuthStore()

// ✅ Email validation logic
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const isValidEmail = computed(() => emailPattern.test(email.value))

const validateEmail = () => {
  if (email.value && !isValidEmail.value) {
    error.value = 'Invalid email address.'
  } else {
    error.value = ''
  }
}

const registerUser = async () => {
  if (!isValidEmail.value) {
    error.value = 'Please enter a valid email before registering.'
    return
  }

  try {
    await auth.register(username.value, email.value, password.value, role.value)
    message.value = 'Registration successful!'
    error.value = ''
  } catch (e) {
    message.value = ''
    error.value = 'Failed to register'
  }
}
</script>
