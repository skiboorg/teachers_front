
export const useAuthStore = defineStore('auth', () => {

  const user = ref(null)

  const setUser = (userData) => {
    user.value = userData
  }

  return {
    user,
    setUser
    }

})
