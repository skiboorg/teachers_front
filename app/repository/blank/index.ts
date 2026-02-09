
export function createBlankRepository(appFetch: typeof $fetch){
    const {setUser} = useAuthStore()

    const authCookie = useCookie('auth_token')

    return{
        async logout(){
            authCookie.value = null
            await appFetch('/auth/token/logout/',{method:'post'})
            window.location.href='/'
        },
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
        async r_tags(){
            const response =  await appFetch('/api/idea/r_tags')
            return response
        },
        async r_filters(){
            const response =  await appFetch('/api/idea/r_filters')
            return response
        },
        async mk_tags(){
            const response =  await appFetch('/api/idea/mk_tags')
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
        async pupils(){
            const response =  await appFetch(`/api/user/pupils`)
            return response
        },

        async getAllTask() {
            return await appFetch('/api/idea/tasks/')
        },
        async addTask(data) {
            const formData = new FormData()

            // Основные поля задачи
            formData.append('title', data.title || '')
            formData.append('description', data.description || '')
            formData.append('created_at_text', data.created_at_text || '')
            formData.append('deadline_text', data.deadline_text || '')

            // Булевы поля
            formData.append('is_completed', data.is_completed ? 'true' : 'false')
            formData.append('has_question', data.has_question ? 'true' : 'false')
            formData.append('is_urgent', data.is_urgent ? 'true' : 'false')
            formData.append('is_planned', data.is_planned ? 'true' : 'false')
            formData.append('is_think', data.is_think ? 'true' : 'false')
            formData.append('is_hidden', data.is_hidden ? 'true' : 'false')

            // Прикрепления и файлы
            formData.append('attachments', JSON.stringify(data.attachments || []))
            data.attachments?.forEach((att: any, index: number) => {
                if (att.file) formData.append(`file_${index}`, att.file)
            })

            const notesToSend = data.notes
                ?.filter((note: any) => note.text && note.text.trim() !== '') || []
            formData.append('notes', JSON.stringify(notesToSend))
            return await appFetch('/api/idea/tasks/', { method: 'POST', body: formData })

        },
        async updateTask(id: number, data: any) {
            console.log(data)
            const formData = new FormData()

            // Основные поля задачи
            formData.append('title', data.title || '')
            formData.append('description', data.description || '')
            formData.append('created_at_text', data.created_at_text || '')
            formData.append('deadline_text', data.deadline_text || '')

            // Булевы поля
            formData.append('is_completed', data.is_completed ? 'true' : 'false')
            formData.append('has_question', data.has_question ? 'true' : 'false')
            formData.append('is_urgent', data.is_urgent ? 'true' : 'false')
            formData.append('is_planned', data.is_planned ? 'true' : 'false')
            formData.append('is_think', data.is_think ? 'true' : 'false')
            formData.append('is_hidden', data.is_hidden ? 'true' : 'false')

            // Прикрепления и файлы
            formData.append('attachments', JSON.stringify(data.attachments || []))
            data.attachments?.forEach((att: any, index: number) => {
                if (att.file) formData.append(`file_${index}`, att.file)
            })

            const notesToSend = data.notes
                ?.filter((note: any) => note.text && note.text.trim() !== '') || []
            formData.append('notes', JSON.stringify(notesToSend))

            return await appFetch(`/api/idea/tasks/${id}/`, {
                method: 'PUT',
                body: formData,
            })
        },
        async deleteTask(id: number) {
            return await appFetch(`/api/idea/tasks/${id}/`, { method: 'DELETE' })
        },
        async getReels(tag_id='',filter_id='') {
            return await appFetch(`/api/idea/reels-ideas/?tag_id=${tag_id}&filter_id=${filter_id}`)
        },
        async createReels(data: any) {
            const formData = new FormData()
            formData.append('reels_number', data.reels_number)
            formData.append('title', data.title)
            formData.append('plot_description', data.plot_description)
            formData.append('is_approved', data.is_approved ? 'true' : 'false')
            formData.append('is_done', data.is_done ? 'true' : 'false')
            formData.append('is_bad', data.is_bad ? 'true' : 'false')
            formData.append('admin_comment', data.admin_comment || '')
            formData.append('example_links', JSON.stringify(data.example_links || []))
            formData.append('tags', JSON.stringify(data.tags || []))
            formData.append('filters', JSON.stringify(data.filters || []))
            return await appFetch('/api/idea/reels-ideas/', { method: 'POST', body: formData })
        },

        async updateReels(id: number, data: any) {
            const formData = new FormData()
            formData.append('reels_number', data.reels_number)
            formData.append('title', data.title)
            formData.append('plot_description', data.plot_description)
            formData.append('is_approved', data.is_approved ? 'true' : 'false')
            formData.append('is_done', data.is_done ? 'true' : 'false')
            formData.append('is_bad', data.is_bad ? 'true' : 'false')
            formData.append('admin_comment', data.admin_comment || '')
            formData.append('example_links', JSON.stringify(data.example_links || []))
            formData.append('tags', JSON.stringify(data.tags || []))
            formData.append('filters', JSON.stringify(data.filters || []))

            return await appFetch(`/api/idea/reels-ideas/${id}/`, { method: 'PUT', body: formData })
        },

        async deleteReels(id: number) {
            return await appFetch(`/api/idea/reels-ideas/${id}/`, { method: 'DELETE' })
        },


        async getMasterclasses(tag_id='') {
            return await appFetch(`/api/idea/masterclass-ideas/?tag_id=${tag_id}`)
        },

        async createMC(data: any) {
            const formData = new FormData()
            formData.append('mk_number', data.mk_number)
            formData.append('title', data.title)
            formData.append('description', data.description)
            formData.append('is_approved', data.is_approved ? 'true' : 'false')
            formData.append('admin_comment', data.admin_comment || '')
            formData.append('tags', JSON.stringify(data.tags || []))
            if (data.cover) formData.append('cover', data.cover)

            formData.append('materials', JSON.stringify(data.materials || []))
            formData.append('example_links', JSON.stringify(data.example_links || []))
            formData.append('dates', JSON.stringify(data.dates || []))
            data.files?.forEach((f: any, i: number) => {
                if (f.file) formData.append(`files[${i}][file]`, f.file)
                formData.append(`files[${i}][name]`, f.name)
            })

            return await appFetch('/api/idea/masterclass-ideas/', {
                method: 'POST',
                body: formData,
            })
        },

        async updateMC(id: number, data: any) {
            const formData = new FormData()
            formData.append('mk_number', data.mk_number)
            formData.append('title', data.title)
            formData.append('description', data.description)
            formData.append('is_approved', data.is_approved ? 'true' : 'false')
            formData.append('admin_comment', data.admin_comment || '')
            formData.append('tags', JSON.stringify(data.tags || []))
            if (data.cover instanceof File) formData.append('cover', data.cover)

            formData.append('materials', JSON.stringify(data.materials || []))
            formData.append('example_links', JSON.stringify(data.example_links || []))
            formData.append('dates', JSON.stringify(data.dates || []))
            data.files?.forEach((f: any, i: number) => {
                if (f.file) formData.append(`files[${i}][file]`, f.file)
                formData.append(`files[${i}][name]`, f.name)
            })

            return await appFetch(`/api/idea/masterclass-ideas/${id}/`, {
                method: 'PUT',
                body: formData,
            })
        },

        async deleteMC(id: number) {
            return await appFetch(`/api/idea/masterclass-ideas/${id}/`, { method: 'DELETE' })
        },
        async all_pupils() {
            return await appFetch(`/api/user/all_pupils`)
        },




    }




}
