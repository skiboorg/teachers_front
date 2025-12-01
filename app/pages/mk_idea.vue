<template>
  <div class="p-4">
    <div class="flex justify-between items-center mb-4">
      <h1 class="text-2xl font-bold">Идеи Мастер-классов</h1>
      <Button label="Новая идея" icon="pi pi-plus" @click="openModal()"/>
    </div>
    <div class="flex flex-wrap gap-2 mb-4">
      <Button :outlined = 'selected_tag !== ""' @click="selected_tag=''" label="Все"/>
      <Button :outlined = 'selected_tag !== tag.id' @click="selected_tag=tag.id" v-for="tag in tags" :label="tag.name"/>
    </div>
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      <div v-for="idea in ideas" :key="idea.id" class="flex flex-col gap-2 p-4 rounded-lg shadow" :class="idea.is_approved ? 'bg-green-100' : 'bg-white'">

        <img :src="idea.cover" alt="" class="w-full h-48 object-cover rounded"/>
        <h3 class="font-bold text-lg">{{ idea.mk_number }} — {{ idea.title }}</h3>
        <div class="text-sm text-gray-600" v-html="idea.description"></div>

        <p class="font-medium">Одобрено: {{ idea.is_approved ? 'Да' : 'Нет' }}</p>
        <p v-if="idea.admin_comment" class="font-medium">Комментарий админа: {{ idea.admin_comment }}</p>

        <!-- Материалы -->
        <div v-if="idea.materials?.length" class="mt-2">
          <h4 class="font-semibold">Материалы:</h4>
          <ul class="list-disc ml-5 text-sm">
            <li v-for="m in idea.materials" :key="m.id">
              <strong>{{ m.name }}</strong> — {{ m.comment }}
              <span v-if="m.source_link">(<a :href="m.source_link" target="_blank">ссылка</a>)</span>
              <span v-if="m.received_date_text">, {{ m.received_date_text }}</span>
              <span v-if="m.cost_text">, {{ m.cost_text }}</span>
            </li>
          </ul>
        </div>

        <!-- Примеры -->
        <div v-if="idea.example_links?.length" class="mt-2">
          <h4 class="font-semibold">Примеры:</h4>
          <ul class="list-disc ml-5 text-sm">
            <li v-for="link in idea.example_links" :key="link.id">
              <a :href="link.link" target="_blank">{{ link.name }}</a>
            </li>
          </ul>
        </div>

        <!-- Файлы -->
        <div v-if="idea.files?.length" class="mt-2">
          <h4 class="font-semibold">Файлы:</h4>
          <ul class="list-disc ml-5 text-sm">
            <li v-for="f in idea.files" :key="f.id">
              <a :href="f.file" target="_blank">{{ f.name }}</a>
            </li>
          </ul>
        </div>

        <!-- Даты -->
        <div v-if="idea.dates?.length" class="mt-2">
          <h4 class="font-semibold">Даты проведения:</h4>
          <ul class="list-disc ml-5 text-sm">
            <li v-for="d in idea.dates" :key="d.id">{{ d.date_text }}</li>
          </ul>
        </div>
        <div class="flex gap-2">
          <Button icon="pi pi-pencil"  class="mt-auto" @click="openModal(idea)"/>
          <Button v-if="user.is_staff" icon="pi pi-trash" class="p-button-danger" @click="deleteIdea(idea.id)"/>

        </div>

      </div>
    </div>

    <BlockMCModal
        v-model:visible="modalVisible"
        :idea="selectedIdea"
        @saved="refresh"
        @close="closeModal"
    />
  </div>
</template>

<script setup lang="ts">

const modalVisible = ref(false)
const selectedIdea = ref<any>(null)
const {user} = useAuthStore()
const {$api} = useNuxtApp()
const selected_tag = ref('')
const {data:ideas, refresh} = await useAsyncData(()=> $api.data.getMasterclasses(selected_tag.value))

const {data:tags} = await useAsyncData(()=> $api.data.mk_tags())
function openModal(idea?: any) {
  selectedIdea.value = idea ? { ...idea } : null
  modalVisible.value = true
}

function closeModal() {
  modalVisible.value = false
  refresh()
}
async function deleteIdea(id: number) {
  await $api.data.deleteMC(id)
  await refresh()
}
watch(selected_tag, async () => {
  console.log(selected_tag.value)
  await refresh()
})
</script>
