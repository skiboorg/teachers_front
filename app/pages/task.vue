<template>
  <div class="p-8 grid grid-cols-3 gap-6">
    <BlockTaskColumn title="Срочные" :tasks="urgentTasks" @refresh="onRefresh" />
    <BlockTaskColumn title="Плановые" :tasks="plannedTasks" @refresh="onRefresh" />
    <BlockTaskColumn title="Подумать" :tasks="thinkTasks" @refresh="onRefresh" />
  </div>
</template>

<script setup lang="ts">
const {$api} = useNuxtApp()
const {data:tasks, refresh} = await useAsyncData(()=> $api.data.getAllTask())

const urgentTasks = computed(() => tasks.value.filter(t => t.is_urgent))
const plannedTasks = computed(() => tasks.value.filter(t => t.is_planned))
const thinkTasks = computed(() => tasks.value.filter(t => t.is_think))

const onRefresh = async () => {
  console.log('refresh')
  await refresh()
}



</script>