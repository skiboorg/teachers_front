//init app
import ToastService from 'primevue/toastservice';
export default defineNuxtPlugin({
  name: 'init-app',
  dependsOn: ['fetch'],
  parallel: true,
  async setup(app){
    const authCookie = useCookie('auth_token')
    const {$api} = useNuxtApp()
    if (authCookie.value){
      await $api.data.me()
    }
  }
});