<template>
  <Dialog
      v-model:visible="visible"
      :header="idea?.id ? 'Редактировать Идея Reels' : 'Новая Идея Reels'"
      modal
      @hide="close"
      @update:visible="onVisibleChange"
      class="w-full max-w-4xl"
  >
    <form @submit.prevent="save">
      <div class="flex flex-col items-start justify-start gap-2 w-full">
      <InputText fluid v-model="form.reels_number" placeholder="Номер Reels" />
      <InputText fluid v-model="form.title" placeholder="Название" required/>
      <Textarea fluid v-model="form.plot_description" placeholder="Описание сюжета" />

      <div class="mt-2 w-full">
        <p class="font-semibold">Примеры:</p>
        <div v-for="(link, index) in form.example_links" :key="index" class="flex gap-2 mb-2 w-full">
          <InputText fluid v-model="link.name" placeholder="Название"/>
          <InputText fluid v-model="link.link" placeholder="Ссылка"/>
          <Button icon="pi pi-times" text @click="form.example_links.splice(index,1)"/>
        </div>
        <Button text icon="pi pi-plus" label="Добавить ссылку" @click="form.example_links.push({name:'', link:''})"/>
      </div>

        <div v-if="user.is_staff && idea?.id" class="w-full mt-4 p-4 border-round border-1 surface-border">
          <p class="font-semibold mb-3">Административные настройки:</p>
          <div class="flex flex-col gap-3">
            <div class="flex items-center gap-2">
              <Checkbox v-model="form.is_approved" :binary="true" inputId="is_approved"/>
              <label for="is_approved" class="font-medium">Одобрено</label>
            </div>
            <div class="flex flex-col gap-1">
              <label for="admin_comment" class="font-medium">Комментарий администратора</label>
              <Textarea
                  id="admin_comment"
                  v-model="form.admin_comment"
                  placeholder="Комментарий..."
                  :rows="3"
                  class="w-full"
              />
            </div>
          </div>
        </div>

      <div class="mt-4 flex justify-between w-full">
        <Button type="submit" severity="success" label="Сохранить"/>
        <Button severity="danger" label="Отмена" @click="$emit('close')"/>

      </div>
      </div>
    </form>
  </Dialog>
</template>

<script setup lang="ts">
const {user} = useAuthStore()
const props = defineProps<{ idea?: any,modelValue: boolean }>()
const {$api} = useNuxtApp()
const emit = defineEmits(['update:modelValue', 'close', 'saved'])
const visible = ref(props.modelValue)
watch(() => props.modelValue, val => (visible.value = val))
watch(visible, val => emit('update:modelValue', val))
const form = reactive({
  reels_number: '',
  title: '',
  plot_description: '',
  is_approved: false,
  admin_comment: '',
  example_links: [] as Array<{name:string, link:string}>
})
function onVisibleChange(value: boolean) {
  if (!value) {
    close()
  }
}
watch(() => props.idea, (idea) => {
  if (idea) {
    form.reels_number = idea.reels_number
    form.title = idea.title
    form.plot_description = idea.plot_description
    form.is_approved = idea.is_approved
    form.admin_comment = idea.admin_comment
    form.example_links = (idea.example_links ?? []).map(l => ({ ...l }))
  } else {
    form.reels_number = ''
    form.title = ''
    form.plot_description = ''
    form.is_approved = false
    form.admin_comment = ''
    form.example_links = []
  }
}, { immediate: true })

async function save() {
  if (props.idea) {
    await $api.data.updateReels(props.idea.id, form)
  } else {
    await $api.data.createReels(form)
  }
  resetForm()
  close()
  emit('saved')
}

function close() {
  visible.value = false
  emit('update:modelValue', false)
  emit('close')
}

function resetForm() {
  form.reels_number = ''
  form.title = ''
  form.plot_description = ''
  form.is_approved = false
  form.admin_comment = ''
  form.example_links = []
}
</script>
