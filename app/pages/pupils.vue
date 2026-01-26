<script setup lang="ts">
const {$api} = useNuxtApp()
const {data:pupils, refresh} = await useAsyncData(()=> $api.data.all_pupils())
const getInitials = (name) => {
  if (!name) return '?';
  const parts = name.split(' ');
  return parts.slice(0, 2).map(p => p[0]).join('').toUpperCase();
};

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
};

const getTagClass = (color) => {
  const colors = {
    warning: 'bg-yellow-100 text-yellow-800',
    success: 'bg-green-100 text-green-800',
    danger: 'bg-red-100 text-red-800',
    info: 'bg-blue-100 text-blue-800',
    primary: 'bg-purple-100 text-purple-800'
  };
  return colors[color] || 'bg-gray-100 text-gray-800';
};
</script>
<template>
  <div class="container">
    <div class="grid grid-cols-3 gap-4">
      <Card v-for="pupil in pupils" :key="pupil.id" class="mb-4">
        <template #header>
          <div class="flex items-center gap-4 p-4">
            <Avatar
                :image="pupil.avatar"
                :label="getInitials(pupil.full_name)"
                size="xlarge"
                shape="circle"
            />
            <div>
              <h3 class="text-xl font-semibold">{{ pupil.full_name }}</h3>
              <p class="text-sm text-gray-600">{{ pupil.email }}</p>
              <p class="text-sm text-gray-600">{{ pupil.phone }}</p>
              <p class="text-sm text-gray-600">{{ pupil.tax }}</p>
            </div>
          </div>
        </template>

        <template #content>
          <div class="mb-4">
            <h4 class="font-semibold mb-2">Учителя:</h4>
            <Chip
                v-for="teacher in pupil.teachers"
                :key="teacher.id"
                :label="teacher.email"
                class="mr-2"
            />
          </div>
          <div>
            <h4 class="font-semibold mb-2">Уроки ({{ pupil.lessons.length }}):</h4>
            <DataView :value="pupil.lessons" :rows="5" :paginator="pupil.lessons.length > 5">
              <template #list="slotProps">
                <div
                    v-for="lesson in slotProps.items"
                    :key="lesson.id"
                    class="p-3 border-bottom"
                >
                  <div class="flex gap-2 justify-content-between mb-2">
                    <p>{{ formatDate(lesson.date) }}</p>
                    <p>{{ lesson.start_time.slice(0, 5) }} - {{ lesson.end_time.slice(0, 5) }}</p>
                  </div>
                  <Tag :value="lesson.lesson_type.name" :severity="lesson.lesson_type.tag_color" />
                  <Tag :value="lesson.status.name" :severity="lesson.status.tag_color" class="ml-2" />
                  <p v-if="lesson.comment" class="mt-2 text-sm">{{ lesson.comment }}</p>
                </div>
              </template>
            </DataView>
          </div>
        </template>
      </Card>
    </div>

  </div>
</template>

<style scoped>

</style>