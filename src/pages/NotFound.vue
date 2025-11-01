<template>
  <div class="not-found">
    <h1>404 - Page Not Found</h1>
    <p>The page you’re looking for doesn’t exist or has been moved.</p>
    <router-link to="/" class="home-link">Go Back Home</router-link>
  </div>
</template>

<script>
export default {
  name: "NotFound",
};
</script>

<style scoped>
.not-found {
  text-align: center;
  padding: 100px 20px;
  color: #333;
}

.not-found h1 {
  font-size: 3rem;
  color: #d32f2f;
}

.not-found p {
  margin: 10px 0 20px;
  font-size: 1.1rem;
}

.home-link {
  background-color: #1976d2;
  color: white;
  padding: 10px 20px;
  text-decoration: none;
  border-radius: 6px;
  transition: background-color 0.2s;
}

.home-link:hover {
  background-color: #1565c0;
}
</style>
