// src/router/guards.ts
import type { Router } from "vue-router";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/services/firebase";

function getCurrentUser() {
  return new Promise((resolve) => {
    const unsub = onAuthStateChanged(auth, (u) => {
      unsub();
      resolve(u);
    });
  });
}

export function installGuards(router: Router) {
  router.beforeEach(async (to, _from, next) => {
    const needAuth = to.matched.some((r) => r.meta.requiresAuth);
    const guestOnly = to.matched.some((r) => r.meta.guestOnly);

    const user = await getCurrentUser();

    // 需要登入但沒登入 → 去 /login，並帶上 redirect 參數
    if (needAuth && !user) {
      return next({ path: "/login", query: { redirect: to.fullPath } });
    }

    // 只能給未登入看的頁（例如 /login），如果已登入 → 導回原本想去的頁或 /dashboard
    if (guestOnly && user) {
      const redirect = (to.query.redirect as string) || "/dashboard";
      return next(redirect);
    }

    next();
  });
}
