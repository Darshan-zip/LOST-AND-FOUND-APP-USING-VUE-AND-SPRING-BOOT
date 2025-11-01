<template>
  <form
    @submit.prevent="handleSubmit"
    class="max-w-lg mx-auto bg-white shadow-md rounded-lg p-6 mt-6 space-y-4"
    enctype="multipart/form-data"
  >
    <h2 class="text-xl font-semibold text-gray-700 mb-4">Add Lost/Found Item</h2>

    <div>
      <label class="block text-gray-600">Item Title</label>
      <input v-model="form.title" type="text" class="w-full border p-2 rounded" required />
      <p v-if="errors.title" class="text-red-500 text-sm">{{ errors.title }}</p>
    </div>

    <div>
      <label class="block text-gray-600">Description</label>
      <textarea
        v-model="form.description"
        class="w-full border p-2 rounded"
        required
      ></textarea>
      <p v-if="errors.description" class="text-red-500 text-sm">{{ errors.description }}</p>
    </div>

    <div>
      <label class="block text-gray-600">Location</label>
      <input v-model="form.location" type="text" class="w-full border p-2 rounded" required />
    </div>

    <div>
      <label class="block text-gray-600">Reporter Name</label>
      <input v-model="form.reporterName" type="text" class="w-full border p-2 rounded" required />
      <p v-if="errors.reporterName" class="text-red-500 text-sm">{{ errors.reporterName }}</p>
    </div>

    <div>
      <label class="block text-gray-600">Contact Info (Email / Phone)</label>
      <input
        v-model="form.reporterContact"
        type="text"
        class="w-full border p-2 rounded"
        placeholder="you@example.com or +91..."
        required
      />
      <p v-if="errors.reporterContact" class="text-red-500 text-sm">
        {{ errors.reporterContact }}
      </p>
    </div>

    <div>
      <label class="block text-gray-600">Type</label>
      <select v-model="form.found" class="w-full border p-2 rounded">
        <option :value="false">Lost</option>
        <option :value="true">Found</option>
      </select>
    </div>

    <!-- 🆕 Image upload field -->
    <div>
      <label class="block text-gray-600">Upload Image</label>
      <input
        type="file"
        @change="handleFileUpload"
        accept="image/*"
        class="w-full border p-2 rounded"
      />
      <p v-if="imagePreview" class="mt-2">
        <img :src="imagePreview" alt="Preview" class="h-32 rounded-md shadow-md" />
      </p>
    </div>

    <!-- ✅ Submit button disabled when form invalid -->
    <button
      type="submit"
      class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
      :disabled="!isValidForm"
    >
      Submit
    </button>

    <p v-if="message" class="text-green-600 mt-3">{{ message }}</p>
  </form>
</template>

<script setup>
import { reactive, ref, computed } from 'vue'
import axios from '../api' // ✅ use your axios instance

const form = reactive({
  title: '',
  description: '',
  location: '',
  reporterName: '',
  reporterContact: '',
  found: false
})

const selectedFile = ref(null)
const imagePreview = ref(null)
const errors = reactive({})
const message = ref('')

// ✅ Image upload
const handleFileUpload = (e) => {
  const file = e.target.files[0]
  if (file) {
    selectedFile.value = file
    imagePreview.value = URL.createObjectURL(file)
  }
}

// ✅ Validation logic
const validate = () => {
  errors.title = form.title.trim().length < 3 ? 'Title must be at least 3 characters.' : ''
  errors.reporterName = form.reporterName.trim().length < 2 ? 'Enter your name.' : ''
  errors.description =
    form.description.trim().length < 10 ? 'Description must be at least 10 characters.' : ''

  // 🧠 Email or phone validation
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  const phonePattern = /^[6-9]\d{9}$/

  if (!form.reporterContact.trim()) {
    errors.reporterContact = 'Contact info is required.'
  } else if (
    !emailPattern.test(form.reporterContact.trim()) &&
    !phonePattern.test(form.reporterContact.trim())
  ) {
    errors.reporterContact = 'Enter a valid email or 10-digit phone number.'
  } else {
    errors.reporterContact = ''
  }
}

// ✅ Computed form validity
const isValidForm = computed(() => {
  validate()
  return (
    !errors.title &&
    !errors.reporterName &&
    !errors.reporterContact &&
    !errors.description &&
    form.title &&
    form.description &&
    form.location &&
    form.reporterName &&
    form.reporterContact
  )
})

// ✅ Form submission
const handleSubmit = async () => {
  validate()
  if (!isValidForm.value) return

  try {
    const formData = new FormData()
    Object.entries(form).forEach(([key, value]) => formData.append(key, value))
    if (selectedFile.value) {
      formData.append('image', selectedFile.value)
    }

    console.log('📤 Sending data to backend...')
    const res = await axios.post('/items', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })

    console.log('✅ Server Response:', res.data)
    message.value = 'Item submitted successfully!'
    sessionStorage.setItem('lastSubmitted', JSON.stringify(form))

    // Reset form
    Object.keys(form).forEach((k) => (form[k] = ''))
    selectedFile.value = null
    imagePreview.value = null
  } catch (err) {
    console.error('❌ Submission error:', err.response || err)
    if (err.response?.status === 403) {
      message.value = 'You are not authorized. Please log in again.'
    } else {
      message.value = err.response?.data?.message || 'Submission failed!'
    }
  }
}
</script>
