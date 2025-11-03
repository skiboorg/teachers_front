<template>
  <div class="flex-1 bg-gray-50 p-4 rounded-2xl shadow-md">
    <div class="flex items-center justify-between mb-4">
      <h2 class="text-xl font-semibold mb-4">{{ title }}</h2>
      <Button @click="onNew" icon="pi pi-plus"/>

    </div>

    <div class="flex flex-col gap-3">
      <BlockTaskCard
          v-for="task in tasks"
          :key="task.id"
          :task="task"
          @delete="onDelete"
          @edit="onEdit"
      />
    </div>

  </div>
  <BlockTaskModal
      v-model="showModal"
      :task="selectedTask"
      @save="onAdd"
  />
</template>

<script setup lang="ts">
defineProps<{ title: string; tasks: any[] }>()
const {$api} = useNuxtApp()
const emit = defineEmits(['refresh'])
const newTask = ref('')
const selectedTask = ref(null)
const showModal = ref(false)
const onAdd = async (task) => {
  if (selectedTask.value?.id) {
    await $api.data.updateTask(selectedTask.value.id, task)
  } else {
    await $api.data.addTask(task)
  }
  emit('refresh')
}

const onDelete = async (id: number) => {
  console.log('onDelete',id)
  await $api.data.deleteTask(id)
  emit('refresh')
}
const onEdit = async (task) => {
  console.log('onEdit',task)
  selectedTask.value = task
  showModal.value = true

  emit('refresh')
}
const onNew = async () => {
   selectedTask.value = null
  showModal.value = true
}

</script>
