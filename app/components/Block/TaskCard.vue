<template>
  <div
      class="bg-white p-4 rounded-xl shadow flex flex-col justify-between gap-2 border hover:shadow-md transition"
  >
    <div>
        <h3 class="font-semibold text-lg">{{ task.title }}</h3>
      <div class="flex gap-2 items-center">
          <span
              v-if="task.is_completed"
              class="text-green-600 text-xs font-semibold"
          >✔ Выполнено</span
          >
        <span
            v-if="task.has_question"
            class="text-yellow-600 text-xs font-semibold"
        >❓ Вопрос</span
        >
        <span
            v-if="task.is_urgent"
            class="text-red-600 text-xs font-semibold"
        >🔥 Срочно</span
        >
        <span
            v-if="task.is_planned"
            class="text-blue-600 text-xs font-semibold"
        >📅 План</span
        >
        <span
            v-if="task.is_think"
            class="text-purple-600 text-xs font-semibold"
        >💭 Подумать</span
        >
      </div>

      <p v-if="task.description" class="text-gray-600 mt-1 text-sm">
        {{ task.description }}
      </p>

      <div class="text-xs text-gray-400 mt-2 space-y-1">
        <p v-if="task.created_at_text">📌 Постановка: {{ task.created_at_text }}</p>
        <p v-if="task.deadline_text">⏰ Дедлайн: {{ task.deadline_text }}</p>
      </div>

      <!-- Прикрепленные файлы и ссылки -->
      <div v-if="task.attachments?.length" class="mt-3">
        <h4 class="text-sm font-semibold mb-1">📎 Прикрепления:</h4>
        <ul class="text-sm list-disc list-inside text-blue-600">
          <li v-for="a in task.attachments" :key="a.id">
            <a
                v-if="a.link"
                :href="a.link"
                target="_blank"
                rel="noopener"
                class="hover:underline"
            >{{ a.name }}</a
            >
            <a
                v-else-if="a.file"
                :href="a.file"
                target="_blank"
                rel="noopener"
                class="hover:underline"
            >{{ a.name }}</a
            >
          </li>
        </ul>
      </div>

      <!-- Пометки -->
      <div v-if="task.notes?.length" class="mt-3">
        <h4 class="text-sm font-semibold mb-1">💬 Пометки:</h4>
        <div
            v-for="note in task.notes"
            :key="note.id"
            class="border rounded-md px-2 py-1 text-xs bg-gray-50 mb-1"
        >
          <p>{{ note.text }}</p>
          <p class="text-gray-400 mt-1">
            — {{ note.author_name }} ({{ new Date(note.created_at).toLocaleDateString() }})
          </p>
        </div>
      </div>
    </div>

    <div class="flex justify-end mt-3 gap-2">
      <Button
          icon="pi pi-pencil"
          text
          severity="secondary"
          @click="$emit('edit', task)"
      />
      <Button
          v-if="user.is_staff"
          icon="pi pi-trash"
          text
          severity="danger"
          @click="$emit('delete', task.id)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
const {user} = useAuthStore()
defineProps<{ task: any }>()
</script>
