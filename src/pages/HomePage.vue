<template>
  <div class="p-6">
    <h1 class="text-2xl font-bold mb-4">All Items</h1>
    <div class="grid md:grid-cols-3 gap-4">
      <ItemCard v-for="item in items" :key="item.id" :item="item" />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import api from '@/api'
import ItemCard from '@/components/ItemCard.vue'

const items = ref([])

onMounted(async () => {
  const res = await api.get('/items')
  items.value = res.data
})
</script>
