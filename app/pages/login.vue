<script setup lang="ts">
const {$api} = useNuxtApp()
const { authToken } = useAuthToken()

const authCookie = useCookie('auth_token',{
  maxAge: 60 * 60 * 24 * 7, // 7 дней
})
const formData = reactive({
  email:'d@skib.org',
  password:'123'
})
const loading = ref(false)

const formSubmit = async () => {
  loading.value = true
  try{
    const response =  await $api.data.login(formData)
    authCookie.value = response.auth_token
    authToken.value = response.auth_token
    window.location.reload()

  }catch(error){
    console.log(error)
  }finally{
    loading.value = false
  }

}

</script>

<template>

    <div class="surface-ground flex align-items-center justify-content-center min-h-screen min-w-screen overflow-hidden">
      <div class="flex flex-column align-items-center justify-content-center">
        <div >
          <div class="w-full surface-card py-8 px-5 sm:px-8" style="border-radius: 53px">
            <div class="text-center mb-5">

              <div class="text-900 text-3xl font-medium mb-3">Вход в систему</div>
            </div>
            <form @submit.prevent="formSubmit" >
              <label for="email1" class="block text-900 text-xl font-medium mb-2">Email</label>
            <InputText id="email1" type="text"   class="w-full md:w-30rem mb-3" style="padding: 1rem" v-model="formData.email" />
              <label for="password1" class="block text-900 font-medium text-xl mb-2">Пароль</label>
             <Password id="password1" :feedback="false" v-model="formData.password"  :toggleMask="true"
                        class="w-full mb-3" inputClass="w-full" :inputStyle="{ padding: '1rem' }"/>

              <Button label="Войти" type="submit" :loading="loading" class="w-full p-3 text-xl"></Button>
            </form>
          </div>
        </div>
      </div>
    </div>

</template>

<style scoped>

</style>