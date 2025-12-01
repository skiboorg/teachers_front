<template>
  <Dialog
      v-model:visible="visible"
      :header="idea?.id ? 'Редактировать МК' : 'Новая Идея МК'"
      modal
      class="w-full max-w-6xl"
      :closable="true"
      @hide="$emit('update:modelValue', false)"
  >
    <form @submit.prevent="save" class="flex flex-col gap-4">
      <!-- Основные поля -->
      <div class="flex flex-col gap-2">
        <div v-if="user.is_staff && idea?.id" class="flex flex-col gap-2 mb-4">
          <div class="flex items-center gap-2 ">
            Одобрено?
            <InputSwitch v-model="form.is_approved"  />
          </div>

          <Textarea v-model="form.admin_comment" placeholder="Комментарий администратора"/>

        </div>
        <InputText v-model="form.mk_number" placeholder="Номер МК" />
        <InputText v-model="form.title" placeholder="Название" required/>
        <MultiSelect fluid v-model="form.tags" :options="tags" option-value="id" option-label="name"  placeholder="Теги"/>
        <Editor ref="editor" class="mb-4"  v-model="form.description" @load="idea?.id ? editorLoad : null" editorStyle="height: 320px"/>


        <div>
          <label>Обложка:</label>
          <input type="file" @change="onCoverChange"/>
          <img v-if="coverPreview" :src="coverPreview" class="mt-2 w-64 h-32 object-cover rounded"/>
        </div>
      </div>

      <!-- Материалы -->
      <div>
        <h4 class="font-semibold">Материалы</h4>
        <div v-for="(m, index) in form.materials" :key="index" class="flex gap-2 items-center mb-2">
          <InputText v-model="m.name" placeholder="Название"/>
          <InputText v-model="m.comment" placeholder="Комментарий"/>
          <InputText v-model="m.source_link" placeholder="Где взять (ссылка)"/>
          <InputText v-model="m.received_date_text" placeholder="Дата получения"/>
          <InputText v-model="m.cost_text" placeholder="Стоимость"/>
          <Button icon="pi pi-times" text @click="form.materials.splice(index,1)"/>
        </div>
        <Button label="Добавить материал" @click="form.materials.push({name:'', comment:'', source_link:'', received_date_text:'', cost_text:''})"/>
      </div>

      <!-- Ссылки -->
      <div>
        <h4 class="font-semibold">Примеры</h4>
        <div v-for="(l, index) in form.example_links" :key="index" class="flex gap-2 mb-2">
          <InputText v-model="l.name" placeholder="Название"/>
          <InputText v-model="l.link" placeholder="Ссылка"/>
          <Button icon="pi pi-times" text @click="form.example_links.splice(index,1)"/>
        </div>
        <Button label="Добавить ссылку" @click="form.example_links.push({name:'', link:''})"/>
      </div>

      <!-- Файлы -->
      <div>
        <h4 class="font-semibold">Файлы</h4>
        <div v-for="(f, index) in form.files" :key="index" class="flex gap-2 items-center mb-2">
          <InputText v-model="f.name" placeholder="Название файла"/>
          <input type="file" @change="e => onFileChange(e, index)"/>
          <Button icon="pi pi-times" text @click="form.files.splice(index,1)"/>
        </div>
        <Button label="Добавить файл" @click="form.files.push({name:'', file:null})"/>
      </div>

      <!-- Даты -->
      <div>
        <h4 class="font-semibold">Даты проведения</h4>
        <div v-for="(d, index) in form.dates" :key="index" class="flex gap-2 items-center mb-2">
          <InputText v-model="d.date_text" placeholder="Дата проведения"/>
          <Button icon="pi pi-times" text @click="form.dates.splice(index,1)"/>
        </div>
        <Button label="Добавить дату" @click="form.dates.push({date_text:''})"/>
      </div>

      <div class="flex justify-between w-full  gap-2 mt-4">
        <Button severity="success" type="submit" label="Сохранить"/>
        <Button text label="Отмена" @click="close"/>

      </div>
    </form>
  </Dialog>
</template>

<script setup lang="ts">

import Editor from 'primevue/editor';
const editor = ref(null)
const {user} = useAuthStore()
const {$api} = useNuxtApp()
const props = defineProps<{ idea?: any, modelValue: boolean }>()
const emit = defineEmits(['update:modelValue', 'saved', 'close'])
const {data:tags} = await useAsyncData(()=> $api.data.mk_tags())
const visible = ref(props.modelValue)
watch(() => props.modelValue, val => visible.value = val)
watch(visible, val => emit('update:modelValue', val))

const form = reactive({
  mk_number: '',
  title: '',
  cover: null as File | null,
  description: '',
  is_approved: false,
  admin_comment: '',
  tags:[],
  materials: [] as Array<any>,
  example_links: [] as Array<any>,
  files: [] as Array<any>,
  dates: [] as Array<any>,
})

const coverPreview = ref<string|null>(null)

watch(() => props.idea, (idea) => {
  if (idea) {
    form.mk_number = idea.mk_number
    form.title = idea.title
    form.description = idea.description
    form.is_approved = idea.is_approved
    form.admin_comment = idea.admin_comment
    form.tags = idea.tags.map(tag => tag.id)
    form.materials = idea.materials?.map(m => ({...m})) || []
    form.example_links = idea.example_links?.map(l => ({...l})) || []
    form.files = idea.files?.map(f => ({...f, file:null})) || []
    form.dates = idea.dates?.map(d => ({...d})) || []
    coverPreview.value = idea.cover || null
  } else {
    form.mk_number = ''
    form.title = ''
    form.description = ''
    form.is_approved = false
    form.admin_comment = ''
    form.materials = []
    form.example_links = []
    form.files = []
    form.dates = []
    form.tags = []
    coverPreview.value = null
  }
}, { immediate: true })
const editorLoad = () => {
  const delta = editor.value.quill.clipboard.convert({ html: form.description });
  editor.value.quill.setContents(delta, 'silent');
}
function onCoverChange(e: Event) {
  const target = e.target as HTMLInputElement
  if (target.files?.[0]) {
    form.cover = target.files[0]
    coverPreview.value = URL.createObjectURL(target.files[0])
  }
}

function onFileChange(e: Event, index: number) {
  const target = e.target as HTMLInputElement
  if (target.files?.[0]) {
    form.files[index].file = target.files[0]
  }
}

async function save() {
  if (props.idea?.id) {
    await  $api.data.updateMC(props.idea.id, form)
  } else {
    await $api.data.createMC(form)
  }
  clearForm()
  close()
  emit('saved')
  emit('update:modelValue', false)
}

function clearForm() {
  form.mk_number = ''
  form.title = ''
  form.cover = null
  form.description = ''
  form.is_approved = false
  form.admin_comment = ''
  form.materials = []
  form.example_links = []
  form.files = []
  form.dates = []
}
function close() {
  visible.value = false
  emit('update:modelValue', false)
  emit('close')
}
</script>
