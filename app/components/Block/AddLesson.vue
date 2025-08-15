<script setup lang="ts">
const {$api} =  useNuxtApp()

const props = defineProps(['user','date','lesson'])
const visible =ref(false);

const lesson_data = ref({
  comment:null,
  teacher_id:null,
  lesson_type_id:null,
  status_id:null,
  payment_status_id:null,
  date:null,
  start_time:null,
  end_time:null,
})

const {data:statuses} = await useAsyncData(()=> $api.data.statuses())

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
    lesson_type_id:newData.lesson_type.id,
    status_id:newData.status.id,
    payment_status_id:newData.payment_status.id,
    date:newData.date,
    start_time:newData.start_time,
    end_time:newData.end_time,
  }
}, { immediate: true })

const handleClick = async (action) => {
    const result = await $api.data.lesson_action(action,props.lesson?.id | null,lesson_data.value)
}
</script>

<template>
<!--  {{lesson_data}}-->
  <Button size="small" v-if="!lesson" @click="visible=true" :disabled="!props.date || !props.user" icon="pi pi-plus"/>
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

    <p class="mb-1">Статус оплаты</p>
    <Select class="mb-3" fluid v-model="lesson_data.payment_status_id" :options="statuses.payment_statuses" option-label="name" option-value="id">
      <template #option="slotProps">
        <div class="flex items-center">
          <div><Badge :value="slotProps.option.name" :severity="slotProps.option.tag_color"></Badge></div>
        </div>
      </template>
    </Select>
    <p class="mb-1">Коментарий</p>
    <InputText  class="mb-3" fluid v-model="lesson_data.comment"/>
    <p class="mb-1">Начало</p>
    <InputMask mask="99:99"  class="mb-3" fluid v-model="lesson_data.start_time"/>
    <p class="mb-1">Конец</p>
    <InputMask mask="99:99"  class="mb-3" fluid v-model="lesson_data.end_time"/>
    <Button v-if="!lesson" @click="handleClick('add')" label="СОздать"/>
    <div v-else class="">
      <Button  @click="handleClick('edit')" label="Редактировать"/>
      <Button  @click="handleClick('delete')" label="Удалить"/>
    </div>

  </Dialog>
</template>

<style scoped>

</style>