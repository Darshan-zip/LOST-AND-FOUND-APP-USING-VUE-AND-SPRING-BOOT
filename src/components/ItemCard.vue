<template>
  <div class="item-card">
    <img
      v-if="item.imageUrl"
      :src="getFullImageUrl(item.imageUrl)"
      alt="Item image"
      class="w-full h-48 object-cover rounded-md"
    />

    <div class="card-content">
      <h3>{{ item.title }}</h3>
      <p class="description">{{ item.description }}</p>
      <p><strong>Location:</strong> {{ item.location }}</p>
      <p><strong>Reporter:</strong> {{ item.reporterName }}</p>
      <p><strong>Contact:</strong> {{ item.reporterContact }}</p>
      <p>
        <strong>Status:</strong>
        <span :class="item.found ? 'found' : 'lost'">
          {{ item.found ? 'FOUND' : 'LOST' }}
        </span>
      </p>
    </div>
  </div>
</template>

<script>
export default {
  name: "ItemCard",
  props: { item: { type: Object, required: true } },
  methods: {
    // ✅ Reuse same image path logic as MyItemCard
    getFullImageUrl(imageUrl) {
      if (!imageUrl) return "";
      if (imageUrl.startsWith("http")) return imageUrl;

      // Prevent double slashes
      const normalizedPath = imageUrl.replace(/^\/+/, "");
      return `http://localhost:8080/${normalizedPath}`;
    },
  },
};
</script>

<style scoped>
.item-card {
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  position: relative;
  transition: transform 0.2s;
}

.item-card:hover {
  transform: translateY(-5px);
}

.item-image {
  width: 100%;
  height: 200px;
  object-fit: cover;
}

.card-content {
  padding: 15px;
}

.description {
  color: #555;
  margin-bottom: 10px;
}

.found {
  color: #2e7d32;
  font-weight: 600;
}

.lost {
  color: #c62828;
  font-weight: 600;
}
</style>
