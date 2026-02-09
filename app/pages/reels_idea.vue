<template>
  <div class="p-4">
    <div class="flex justify-between items-center mb-4">
      <h1 class="text-2xl font-bold">Идеи reels</h1>
      <Button label="Добавить идею" icon="pi pi-plus" @click="openModal(null)" />
    </div>
    <div class="flex items-center flex-wrap gap-2 mb-4">
      Теги
      <Button :outlined = 'selected_tag !== ""' @click="selected_tag=''" label="Все"/>
      <Button :outlined = 'selected_tag !== tag.id' @click="selected_tag=tag.id" v-for="tag in tags" :label="tag.name"/>
    </div>

    <div class="flex items-center flex-wrap gap-2 mb-4">
      Фильтры
      <Button :outlined = 'selected_filter !== ""' @click="selected_filter=''" label="Все"/>
      <Button :outlined = 'selected_filter !== filter.id' @click="selected_filter=filter.id" v-for="filter in filters" :label="filter.name"/>
    </div>
    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
      <div v-for="idea in ideas" :key="idea.id" class=" p-4 rounded-lg shadow" :class="idea.is_approved ? 'bg-green-100' : 'bg-white'">

        <div class="flex flex-col items-start justify-between h-full">
          <div class="w-full">
            <div class="flex justify-between w-full">
              <p>№ {{ idea.reels_number }}</p>
              <div class="flex gap-1">


                <p v-for="filter in idea.filters" class="bg-[#34b4eb] text-white px-2 py-1 rounded-md text-xs">{{filter.name}}</p>
                <p v-if="idea.is_done" class="bg-[#60db85] text-white px-2 py-1 rounded-md text-xs">Отснято</p>
                <p v-if="idea.is_bad" class="bg-[#cf3e3e] text-white px-2 py-1 rounded-md text-xs">Забраковано</p>
                <p v-if="idea.author" class="bg-gray-500 text-white px-2 py-1 rounded-md text-xs">Добавил {{ idea.author }}</p>
              </div>

            </div>
            <h3 class="font-bold"> {{ idea.title }}</h3>
            <p class="text-gray-600 ">{{ new Date(idea.created_at).toLocaleString() }}</p>

              <p style="white-space: pre-line;" class="text-gray-600 mt-2">{{ idea.plot_description }}</p>



            <div class="mt-2">
              <p class="font-semibold">Примеры:</p>
              <ul class="list-disc ml-4">
                <li v-for="link in idea.example_links" :key="link.id">
                  <a :href="link.link" target="_blank" class="text-blue-600">{{ link.name }}</a>
                </li>
              </ul>
            </div>

            <div v-if="idea.admin_comment" class="mt-2">
              <p class="font-semibold">Коментарий админа:</p>
              <p>{{idea.admin_comment}}</p>
            </div>
          </div>
          <div class=" flex justify-end gap-2 w-full">
            <Button icon="pi pi-pencil" @click="openModal(idea)"/>
            <Button v-if="user.is_staff" icon="pi pi-trash" class="p-button-danger" @click="deleteIdea(idea.id)"/>
          </div>
        </div>






      </div>
    </div>

    <!-- Модалка -->
    <BlockReelsIdeaModal
        :visible="modalOpen"
        :idea="selectedIdea"
        @close="modalOpen = false"
        @saved="refresh"
    />
  </div>
</template>

<script setup lang="ts">
const {user} = useAuthStore()
const modalOpen = ref(false)
const selectedIdea = ref<any>(null)
const selected_tag = ref('')
const selected_filter = ref('')

const {$api} = useNuxtApp()
const {data:ideas, refresh} = await useAsyncData(()=> $api.data.getReels(selected_tag.value,selected_filter.value))
const {data:tags} = await useAsyncData(()=> $api.data.r_tags())
const {data:filters} = await useAsyncData(()=> $api.data.r_filters())

watch(selected_tag, async () => {
  console.log(selected_tag.value)
  await refresh()
})
watch(selected_filter, async () => {

  await refresh()
})

function openModal(idea: any = null) {
  selectedIdea.value = idea
  modalOpen.value = true
}

async function deleteIdea(id: number) {
  await $api.data.deleteReels(id)
  await refresh()
}

</script>
