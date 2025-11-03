<template>
  <Dialog
      v-model:visible="visible"
      :header="task?.id ? 'Редактировать задачу' : 'Новая задача'"
      modal
      class="w-full max-w-4xl"
  >
    <form @submit.prevent="handleSave" class="space-y-5">
      <!-- Основная информация -->
      <div class="grid grid-cols-2 gap-4">
        <div>
          <label class="block text-sm mb-1">Название задачи</label>
          <InputText v-model="form.title" class="w-full" required />
        </div>
        <div>
          <label class="block text-sm mb-1">Описание</label>
          <Textarea v-model="form.description" rows="2" class="w-full" />
        </div>
      </div>

      <div class="grid grid-cols-2 gap-4">
        <div>
          <label class="block text-sm mb-1">Дата постановки</label>
          <InputText v-model="form.created_at_text" class="w-full" />
        </div>
        <div>
          <label class="block text-sm mb-1">Дедлайн</label>
          <InputText v-model="form.deadline_text" class="w-full" />
        </div>
      </div>

      <!-- Флаги -->
      <div class="grid grid-cols-3 gap-3">
        <div class="flex items-center gap-2">
          <Checkbox v-model="form.is_completed" binary /> Выполнена
        </div>
        <div class="flex items-center gap-2">
          <Checkbox v-model="form.has_question" binary /> Есть вопрос
        </div>
        <div class="flex items-center gap-2">
          <Checkbox v-model="form.is_urgent" binary /> Срочная
        </div>
        <div class="flex items-center gap-2">
          <Checkbox v-model="form.is_planned" binary /> Плановая
        </div>
        <div class="flex items-center gap-2">
          <Checkbox v-model="form.is_think" binary /> Подумать
        </div>
        <div v-if="user.is_staff" class="flex items-center gap-2">
          <Checkbox v-model="form.is_hidden" binary /> Скрыть задачу
        </div>
      </div>

      <!-- Прикрепления -->
      <div class="border-t pt-4">
        <div class="flex justify-between items-center mb-2">
          <h3 class="font-semibold">📎 Прикрепления</h3>
          <Button icon="pi pi-plus" text label="Добавить" @click="addAttachment" />
        </div>
        <div v-if="attachments.length" class="space-y-2">
          <div
              v-for="(att, i) in attachments"
              :key="i"
              class="grid grid-cols-3 gap-2 items-center"
          >
            <InputText v-model="att.name" placeholder="Название" />
            <InputText
                v-model="att.link"
                placeholder="Ссылка (если есть)"
                v-if="!att.file"
            />
            <input
                type="file"
                @change="handleFileChange($event, i)"
                v-if="!att.link"
                class="text-sm"
            />
            <Button
                icon="pi pi-trash"
                v-if="user.is_staff"
                text
                severity="danger"
                @click="attachments.splice(i, 1)"
            />
          </div>
        </div>
        <p v-else class="text-gray-400 text-sm">Нет прикреплений</p>
      </div>

      <!-- Пометки -->
      <div class="border-t pt-4">
        <div class="flex justify-between items-center mb-2">
          <h3 class="font-semibold">💬 Пометки</h3>
          <Button icon="pi pi-plus" text label="Добавить" @click="addNote" />
        </div>
        <div v-if="notes.length" class="space-y-2">
          <div
              v-for="(note, i) in notes"
              :key="i"
              class="flex items-start gap-2 bg-gray-50 p-2 rounded-lg"
          >
            <Textarea
                v-model="note.text"
                rows="2"
                placeholder="Текст пометки"
                class="flex-1"
            />
            <Button
                v-if="user.is_staff"
                icon="pi pi-trash"
                text
                severity="danger"
                @click="notes.splice(i, 1)"
            />
          </div>
        </div>
        <p v-else class="text-gray-400 text-sm">Нет пометок</p>
      </div>

      <div class="flex justify-end pt-4 border-t">
        <Button label="Сохранить" icon="pi pi-check" type="submit" />
      </div>
    </form>
  </Dialog>
</template>

<script setup lang="ts">
const {user} = useAuthStore()
const props = defineProps<{
  modelValue: boolean
  task?: any
}>()

const emit = defineEmits(['update:modelValue', 'save'])

const visible = ref(props.modelValue)
watch(() => props.modelValue, val => (visible.value = val))
watch(visible, val => emit('update:modelValue', val))

const form = reactive({
  title: '',
  description: '',
  created_at_text: '',
  deadline_text: '',
  is_completed: false,
  has_question: false,
  is_urgent: false,
  is_planned: false,
  is_think: false,
  is_hidden: false,
})

const attachments = ref<{ name: string; file?: File | null; link?: string | null }[]>([])
const notes = ref<{ text: string }[]>([])

watch(
    () => props.task,
    task => {
      if (task) {
        Object.assign(form, task)
        attachments.value = task.attachments?.map(a => ({
          id: a.id,
          name: a.name,
          link: a.link,
          file: null,
        })) || []
        notes.value = task.notes?.map(n => ({ id: n.id, text: n.text })) || []
      } else {
        Object.keys(form).forEach(k => (form[k as keyof typeof form] = ''))
        attachments.value = []
        notes.value = []
      }
    },
    { immediate: true }
)

const addAttachment = () => attachments.value.push({ name: '', link: '' })
const addNote = () => notes.value.push({ text: '' })

const handleFileChange = (e: Event, index: number) => {
  const target = e.target as HTMLInputElement
  const file = target.files?.[0]
  if (file) attachments.value[index].file = file
}

const handleSave = () => {
  const data = {
    ...form,
    attachments: attachments.value,
    notes: notes.value,
  }
  emit('save', data)
  visible.value = false
}
</script>
