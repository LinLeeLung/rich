<template>
  <div class="p-8">
    <h2 class="text-2xl font-semibold">Dashboard（需登入）</h2>
    <p v-if="user" class="mt-2">
      Hi，{{ user.displayName }}（{{ user.email }}）
    </p>
    <button class="mt-4 px-3 py-1 border rounded" @click="logout">登出</button>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { useRouter } from "vue-router";
import { auth } from "@/services/firebase";

const router = useRouter();
const user = ref<any>(null);

onAuthStateChanged(auth, (u) => {
  user.value = u;
  if (!u) router.push("/"); // 未登入就回首頁
});

const logout = () => signOut(auth);
</script>
