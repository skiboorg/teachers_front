export default defineNuxtRouteMiddleware(async (to, from) => {
  const authStore = useAuthStore();
  if (to.fullPath ==='/' && !authStore.user) {
    return navigateTo("/login");
  }
  if (to.fullPath ==='/login' && authStore.user) {
    return navigateTo("/");
  }
})
