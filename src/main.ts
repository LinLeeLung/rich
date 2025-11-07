import "./assets/main.css";

import { createApp } from "vue";
import { createPinia } from "pinia";
import router from "./router";
import { installGuards } from "@/router/guard";
import App from "./App.vue";
import "./assets/main.css"; // 如有用 Tailwind

installGuards(router);
createApp(App).use(createPinia()).use(router).mount("#app");
