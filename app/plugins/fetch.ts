import { createBlankRepository } from "~/repository/blank";

export default defineNuxtPlugin({
  name: 'fetch',
  parallel: true,
  async setup(nuxtApp){
    const config = useRuntimeConfig();

    const appFetch = $fetch.create({
      baseURL: config.public.apiUrl as string,
      retry: false,
      onRequest({ options }) {
        options.headers.append('Accept', 'application/json');

        const auth_token = useCookie('auth_token')

        if(auth_token.value){
          options.headers.append('Authorization', `Token ${auth_token.value}`);
        }
       
      },
      async onResponseError({ response }) {

        if(response.status == 401){
          const auth_token = useCookie('auth_token')
          auth_token.value = null
          navigateTo('/login');
        }
      }
    });

    const api = {
      data: createBlankRepository(appFetch),
    };
    
    return {
      provide: {
        appFetch,
        api
      }
    }
  }
});