// src/main.js
import { createApp } from "vue";
import { createPinia } from "pinia";
import App from "./App.vue";
import router from "./router";

import "./assets/main.css";

const app = createApp(App);
const pinia = createPinia(); // ✅ create Pinia instance

app.use(pinia); // ✅ register Pinia
app.use(router);

app.mount("#app");
