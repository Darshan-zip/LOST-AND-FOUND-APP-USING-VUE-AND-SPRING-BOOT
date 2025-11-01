<template>
  <div class="max-w-5xl mx-auto mt-6 p-4">
    <h2 class="text-2xl font-bold mb-4 text-gray-800">Lost & Found Items</h2>

    <!-- Items Grid -->
    <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
      <ItemCard
        v-for="item in items"
        :key="item.id"
        :item="item"
        @edit="editItem"
        @delete="deleteItem"
      />
    </div>

    <!-- Edit Form -->
    <div
      v-if="editItemData"
      class="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50"
    >
      <div class="bg-white p-6 rounded-lg shadow-lg w-96">
        <h3 class="text-xl font-semibold mb-4 text-gray-800">Edit Item</h3>

        <form @submit.prevent="updateItem" class="space-y-3">
          <div>
            <label class="block text-gray-600">Title</label>
            <input
              v-model="editItemData.title"
              type="text"
              class="w-full border rounded p-2"
              required
            />
          </div>

          <div>
            <label class="block text-gray-600">Description</label>
            <textarea
              v-model="editItemData.description"
              class="w-full border rounded p-2"
              required
            ></textarea>
          </div>

          <div>
            <label class="block text-gray-600">Location</label>
            <input
              v-model="editItemData.location"
              type="text"
              class="w-full border rounded p-2"
              required
            />
          </div>

          <div class="flex justify-end gap-2 mt-4">
            <button
              type="button"
              @click="cancelEdit"
              class="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import ItemCard from './ItemCard.vue'

const items = ref([])
const editItemData = ref(null)

const fetchItems = async () => {
  try {
    const res = await axios.get('http://localhost:8080/api/items')
    items.value = res.data
    localStorage.setItem('cachedItems', JSON.stringify(items.value))
  } catch (err) {
    console.error('Error fetching items:', err)
  }
}

// Handle Delete
const deleteItem = async (id) => {
  if (!confirm('Are you sure you want to delete this item?')) return

  try {
    await axios.delete(`http://localhost:8080/api/items/${id}`)
    await fetchItems()
    alert('✅ Item deleted successfully!')
  } catch (err) {
    alert('❌ Failed to delete item.')
    console.error(err)
  }
}

// Handle Edit
const editItem = (item) => {
  editItemData.value = { ...item }
}

// Cancel Edit
const cancelEdit = () => {
  editItemData.value = null
}

// Save Updated Item
const updateItem = async () => {
  try {
    await axios.patch(
      `http://localhost:8080/api/items/${editItemData.value.id}`,
      editItemData.value
    )
    editItemData.value = null
    await fetchItems()
    alert('✅ Item updated successfully!')
  } catch (err) {
    alert('❌ Failed to update item.')
    console.error(err)
  }
}

onMounted(fetchItems)
</script>
