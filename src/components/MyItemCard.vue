<template>
  <div class="my-item-card">
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
      <p>
        <strong>Status:</strong>
        <span :class="item.status === 'FOUND' ? 'found' : 'lost'">
          {{ item.status }}
        </span>
      </p>

      <div class="actions">
        <button class="edit-btn" @click="openEditModal">Edit</button>
        <button class="delete-btn" @click="deleteItem">Delete</button>
      </div>
    </div>

    <!-- Edit Modal -->
    <teleport to="body">
      <div v-if="showModal" class="modal-overlay">
        <div class="modal">
          <h2>Edit Item</h2>

          <form @submit.prevent="updateItem">
            <label>Title</label>
            <input v-model="editData.title" required />

            <label>Description</label>
            <textarea v-model="editData.description" required></textarea>

            <label>Location</label>
            <input v-model="editData.location" required />

            <label>Status</label>
            <select v-model="editData.status">
              <option value="LOST">Lost</option>
              <option value="FOUND">Found</option>
            </select>

            <div class="modal-actions">
              <button type="submit" class="save-btn">Save</button>
              <button type="button" class="cancel-btn" @click="closeEditModal">
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </teleport>
  </div>
</template>

<script>
import api from "@/api/axios";

export default {
  name: "MyItemCard",
  props: { item: { type: Object, required: true } },
  data() {
    return {
      showModal: false,
      editData: {
        title: "",
        description: "",
        location: "",
        status: "LOST",
      },
    };
  },
  methods: {
    // ✅ Fix: define the missing helper
    getFullImageUrl(imageUrl) {
      if (!imageUrl) return "";
      if (imageUrl.startsWith("http")) return imageUrl;

      // Clean leading slashes to avoid double-slash
      const normalizedPath = imageUrl.replace(/^\/+/, "");
      return `http://localhost:8080/${normalizedPath}`;
    },


    openEditModal() {
      this.editData = { ...this.item };
      this.showModal = true;
    },
    closeEditModal() {
      this.showModal = false;
    },

    async updateItem() {
      try {
        const response = await api.put(`/items/${this.item.id}`, this.editData);
        this.$emit("updated", response.data);
        this.showModal = false;
        alert("✅ Item updated successfully!");
      } catch (error) {
        console.error("Update failed:", error);
        alert("Failed to update item.");
      }
    },

    async deleteItem() {
      if (!confirm("Are you sure you want to delete this item?")) return;
      try {
        await api.delete(`/items/${this.item.id}`);
        this.$emit("deleted", this.item.id);
        alert("🗑️ Item deleted successfully!");
      } catch (error) {
        console.error("Delete failed:", error);
        alert("Failed to delete item.");
      }
    },
  },
};
</script>

<style scoped>
.my-item-card {
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  position: relative;
  transition: transform 0.2s;
}

.my-item-card:hover {
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
}

.lost {
  color: #c62828;
}

.actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 10px;
}

.edit-btn,
.delete-btn {
  border: none;
  padding: 6px 12px;
  border-radius: 6px;
  color: white;
  cursor: pointer;
}

.edit-btn {
  background-color: #1976d2;
}

.delete-btn {
  background-color: #e53935;
}

.edit-btn:hover {
  background-color: #1565c0;
}

.delete-btn:hover {
  background-color: #c62828;
}

/* Modal Styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal {
  background: white;
  padding: 20px 25px;
  border-radius: 10px;
  width: 400px;
  max-width: 90%;
}

.modal h2 {
  margin-bottom: 15px;
  color: #333;
}

.modal label {
  display: block;
  margin-top: 10px;
  color: #555;
}

.modal input,
.modal textarea,
.modal select {
  width: 100%;
  padding: 8px;
  margin-top: 5px;
  border: 1px solid #ddd;
  border-radius: 6px;
}

.modal textarea {
  resize: none;
  height: 80px;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 15px;
}

.save-btn {
  background-color: #388e3c;
  color: white;
  border: none;
  padding: 6px 12px;
  border-radius: 6px;
  cursor: pointer;
}

.cancel-btn {
  background-color: #9e9e9e;
  color: white;
  border: none;
  padding: 6px 12px;
  border-radius: 6px;
  cursor: pointer;
}

.save-btn:hover {
  background-color: #2e7d32;
}
.cancel-btn:hover {
  background-color: #757575;
}
</style>
