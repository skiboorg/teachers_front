
export function createBlankRepository(appFetch: typeof $fetch){
    const {setUser} = useAuthStore()

    const authCookie = useCookie('auth_token')

    return{
        async login (payload){
            try{
                const response = await appFetch('/auth/token/login',{
                    method:'POST',
                    body:payload
                })
                console.log(response)

                return response
            }catch (e: any) {
                return null
            }
        },

        async me(){
            try{
                const response =  await appFetch('/api/user/me')

                setUser(response)
            }catch(error){
                console.log(error)
                // authCookie.value = null
                // window.location.reload()
            }
        },

        async teachers(){
            const response =  await appFetch('/api/data/teachers')
            return response
        },
        async notes(){
            const response =  await appFetch('/api/data/note/')
            return response
        },
        async note_action(action,id,body){
            let response
            if(action==="delete"){
                response =  await appFetch(`/api/data/note/${id}/`,{
                    method:'DELETE'
                })
            }
            if(action==="patch"){
                response =  await appFetch(`/api/data/note/${id}/`,{
                    method:'PATCH',
                    body,
                })
            }
            if(action==="post"){
                response =  await appFetch(`/api/data/note/`,{
                    method:'POST',
                    body,
                })
            }

            return response


        },
        async lessons(id){
            const response =  await appFetch(`/api/data/lessons?user_id=${id}`)
            return response
        },
        async statuses(){
            const response =  await appFetch('api/data/statuses')
            return response
        },
        async lesson_action(action,lesson_id,payload){
            let resp
            if(action === 'add'){
                resp =  await appFetch('api/data/lesson/',{
                    method:'POST',
                    body:payload
                })
            }
            if(action === 'delete'){
                resp =  await appFetch(`api/data/lesson/${lesson_id}/`,{
                    method:'DELETE',
                })
            }
            if(action === 'edit'){
                resp =  await appFetch(`api/data/lesson/${lesson_id}/`,{
                    method:'patch',
                    body:payload
                })
            }

            return resp
        },

    }




}
