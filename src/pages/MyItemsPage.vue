<template>
  <div class="p-6">
    <h1 class="text-2xl font-bold mb-4">My Items</h1>
    <AddItemForm @itemAdded="fetchItems" />
    
    <div v-if="loading" class="text-gray-600 mt-4">Loading your items...</div>
    <div v-else-if="myItems.length === 0" class="text-gray-600 mt-4">
      You haven’t uploaded any items yet.
    </div>
    <div v-else class="grid md:grid-cols-3 gap-4 mt-6">
      <MyItemCard
        v-for="item in myItems"
        :key="item._id"
        :item="item"
        @updated="fetchItems"
        @deleted="fetchItems"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import api from '@/api'
import AddItemForm from '@/components/AddItemForm.vue'
import MyItemCard from '@/components/MyItemCard.vue'

// Reactive state
const myItems = ref([])
const loading = ref(true)

// Get logged-in user info (stored in localStorage after login)
const user = JSON.parse(localStorage.getItem('user'))
const userId = user?.id

// Fetch only logged-in user's items
const fetchItems = async () => {
  try {
    loading.value = true
    // ✅ Use user-specific endpoint
    const res = await api.get("/items/my");
    myItems.value = res.data
  } catch (err) {
    console.error("Error fetching user's items:", err)
  } finally {
    loading.value = false
  }
}

onMounted(fetchItems)
</script>
