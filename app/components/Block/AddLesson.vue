<script setup lang="ts">
const {$api} =  useNuxtApp()

const props = defineProps(['user','date','lesson'])
const emits = defineEmits(['need-update'])
const visible =ref(false);
const loading =ref(false);
const {user} = useAuthStore()

const lesson_data = ref({
  comment:null,
  comment_hidden:null,
  pupils_text:null,
  pupils:null,
  teacher_id:null,
  lesson_type_id:null,
  status_id:null,
  payment_status_id:null,
  date:null,
  start_time:null,
  end_time:null,
})

const {data:statuses} = await useAsyncData(()=> $api.data.statuses())
const {data:pupils} = await useAsyncData(()=> $api.data.pupils())

function formatToYMD(date) {
  const d = new Date(date)
  const year = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

watch(() => props.date, (newDate) => {
  console.log('1111',formatToYMD(newDate));
  lesson_data.value.date = formatToYMD(newDate)
}, { immediate: true })

watch(() => props.user, (newDate) => {
  lesson_data.value.teacher_id = newDate?.id
}, { immediate: true })

watch(() => props.lesson, (newData) => {
  if (!newData) return
  lesson_data.value = {
    comment:newData.comment,
    comment_hidden:newData.comment_hidden,
    pupils_text:newData.pupils_text,
    pupils:newData.pupils,
    lesson_type_id:newData.lesson_type.id,
    status_id:newData.status.id,
    payment_status_id:newData.payment_status?.id || null,
    date:newData.date,
    start_time:newData.start_time,
    end_time:newData.end_time,
  }
}, { immediate: true })

const handleClick = async (action) => {
  loading.value = true
    const result = await $api.data.lesson_action(action,props.lesson?.id | null,lesson_data.value)
    visible.value = false
  loading.value = false
    emits('need-update')
}
</script>

<template>

  <Button size="small" v-if="!lesson" @click="visible=true" :disabled="!props.date || !props.user" label="Добавить урок"  />
  <Button v-else size="small" @click="visible=true" icon="pi pi-pencil" />
  <Dialog v-model:visible="visible" modal header="Новый урок" >
    <p class="mb-1">Тип урока</p>
    <Select class="mb-3" fluid v-model="lesson_data.lesson_type_id" :options="statuses.lesson_types" option-label="name" option-value="id">
      <template #option="slotProps">
        <div class="flex items-center">
        <div><Badge :value="slotProps.option.name" :severity="slotProps.option.tag_color"></Badge></div>
        </div>
      </template>
    </Select>
    <p class="mb-1">Статус урока</p>
    <Select class="mb-3" fluid v-model="lesson_data.status_id" :options="statuses.lesson_statuses" option-label="name" option-value="id">
      <template #option="slotProps">
        <div class="flex items-center">
          <div><Badge :value="slotProps.option.name" :severity="slotProps.option.tag_color"></Badge></div>
        </div>
      </template>
    </Select>

    <p v-if="user.is_staff" class="mb-1">Статус оплаты</p>
    <Select v-if="user.is_staff" class="mb-3" fluid v-model="lesson_data.payment_status_id" :options="statuses.payment_statuses" option-label="name" option-value="id">
      <template #option="slotProps">
        <div class="flex items-center">
          <div><Badge :value="slotProps.option.name" :severity="slotProps.option.tag_color"></Badge></div>
        </div>
      </template>
    </Select>

    <p class="mb-1">Ученики</p>
<!--    <MultiSelect fluid v-model="lesson_data.pupils" class="mb-3" :options="pupils" optionLabel="full_name" option-value="id" filter placeholder="Выберите"/>-->
    <InputText  class="mb-3" fluid v-model="lesson_data.pupils_text"/>
    <p  class="mb-1">Коментарий</p>
    <InputText  class="mb-3" fluid v-model="lesson_data.comment"/>
    <p v-if="user.is_staff" class="mb-1">Коментарий админа</p>
    <InputText v-if="user.is_staff"  class="mb-3" fluid v-model="lesson_data.comment_hidden"/>
    <p class="mb-1">Начало</p>
    <InputMask mask="99:99" placeholder="__:__" class="mb-3" fluid v-model="lesson_data.start_time"/>
    <p class="mb-1">Конец</p>
    <InputMask mask="99:99" placeholder="__:__" class="mb-3" fluid v-model="lesson_data.end_time"/>
    <Button :loading="loading" v-if="!lesson" @click="handleClick('add')" label="Создать"/>
    <div v-else class="flex gap-2">
      <Button :loading="loading" @click="handleClick('edit')" label="Редактировать"/>
      <Button :loading="loading" @click="handleClick('delete')" label="Удалить"/>
    </div>

  </Dialog>
</template>

<style scoped>

</style>