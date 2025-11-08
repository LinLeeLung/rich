<!-- src/pages/Login.vue -->
<template>
  <div class="p-8 text-center">
    <h1 class="text-2xl font-bold mb-4">請先登入</h1>
    <button class="px-4 py-2 rounded bg-indigo-600 text-white" @click="login">
      使用 Google 登入
    </button>
  </div>
</template>

<script setup lang="ts">
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  onAuthStateChanged,
} from "firebase/auth";
import { useRoute, useRouter } from "vue-router";
import { onMounted } from "vue";

const route = useRoute();
const router = useRouter();
const auth = getAuth();

const goBack = async () => {
  const redirect = (route.query.redirect as string) || "/dashboard";
  await router.replace(redirect);
};

const login = async () => {
  try {
    await signInWithPopup(auth, new GoogleAuthProvider());
    await goBack();
  } catch (e) {
    console.error(e);
  }
};

// 若已登入則直接跳轉
onMounted(() => {
  onAuthStateChanged(auth, (u) => {
    if (u) goBack();
  });
});
</script>
