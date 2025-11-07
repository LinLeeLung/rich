import type { Router } from "vue-router";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/services/firebase";

export function installGuards(router: Router) {
  let ready = false;
  router.beforeEach(async (to, _from, next) => {
    if (!ready) {
      await new Promise<void>((resolve) =>
        onAuthStateChanged(auth, () => resolve())
      );
      ready = true;
    }
    if (to.meta.requiresAuth && !auth.currentUser) return next("/");
    next();
  });
}
