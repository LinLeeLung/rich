<script setup lang="ts">
import {
  GoogleAuthProvider,
  signInWithPopup,
  signInWithRedirect,
} from "firebase/auth";
import { auth } from "@/services/firebase";

async function login() {
  const provider = new GoogleAuthProvider();
  try {
    const res = await signInWithPopup(auth, provider);
    console.log("[auth] popup success:", res.user?.uid, res.user?.email);
    alert("登入成功（popup）：" + res.user?.email);
  } catch (err: any) {
    console.error("[auth] popup error:", err?.code, err?.message, err);
    if (
      err?.code === "auth/popup-blocked" ||
      err?.code === "auth/operation-not-supported-in-this-environment" ||
      err?.code === "auth/cancelled-popup-request"
    ) {
      console.log("[auth] fallback to redirect...");
      await signInWithRedirect(auth, provider);
    } else {
      alert("登入失敗：" + err?.code);
    }
  }
}
</script>

<template>
  <div style="padding: 24px">
    <h2>Auth 測試</h2>
    <button @click="login">使用 Google 登入（測試）</button>
  </div>
</template>
