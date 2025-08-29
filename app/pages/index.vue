<script setup lang="ts">

const {$api} =  useNuxtApp()
const {user} = useAuthStore()
const teachers = ref([])
const selectedTeacher = ref(null)
const selectedDate = ref<Date | null>(null)
const lessons = ref([])
const lessonsDates = ref([])



onMounted(async () => {
  console.log(user.is_staff)
  if (user.is_staff){
    teachers.value = await $api.data.teachers()
  }else {
    selectedTeacher.value = user
    await onTeacherChange()
  }

})

async function onTeacherChange() {
  lessonsDates.value = []
  if (selectedTeacher.value) {
    const res = await  $api.data.lessons(selectedTeacher.value.id)
    const dates = [...new Set(res.map((l: Lesson) => l.date))]
    lessons.value = res
    selectedDate.value = null
    for (const lesson of lessons.value){
      lessonsDates.value.push(lesson.date)
    }
  }
}

function formatDateToYMD(date) {
  const yyyy = date.year

  const mm = String(date.month).padStart(2, '0')
  const dd = String(date.day).padStart(2, '0')
  return `${yyyy}-${mm}-${dd}`
}

function formatDateToYMDFromSlot(slotDate) {
  const year = slotDate.year
  const month = slotDate.month // уже 0-based!
  const day = slotDate.day
  const d = new Date(year, month, day)
  const yyyy = d.getFullYear()
  const mm = String(d.getMonth() + 1).padStart(2, '0')
  const dd = String(d.getDate()).padStart(2, '0')
  return `${yyyy}-${mm}-${dd}`
}


function formatToYMD(date) {
  const d = new Date(date)
  const year = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}


const dateSelected =()=> {
  console.log(new Date(selectedDate.value).toLocaleDateString())
  console.log(formatToYMD(selectedDate.value))
  console.log(lessons.value.filter(x=>x.date === formatToYMD(selectedDate.value)))
  console.log(lessons.value)
}

const handleUpdate = async () => {
  await onTeacherChange()
}


</script>
<template>
  <div class="container">
    <div class="flex justify-between items-center mb-4 pt-4">
      <div v-if="user.is_staff" class="flex gap-4">
        <NuxtLink to="/notes"><Button label="Заметки"/></NuxtLink>
      </div>

      <div class="flex gap-4 items-center">
        <img class="w-[70px] h-[70px] object-cover rounded-full" :src="user.avatar" alt="">
        <p>{{user.full_name}}</p>
        <Button @click="$api.data.logout()" label="Выйти"/>
      </div>
    </div>
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <!-- Teacher Select -->
      <div v-if="user.is_staff" class="col-span-1">
        <p class="font-semibold mb-2">Выберите преподавателя</p>
        <Select
            v-model="selectedTeacher"
            :options="teachers"
            optionLabel="full_name"
            placeholder="Выберите преподавателя"
            class="w-full"
            @change="onTeacherChange"
        />

      </div>

      <div class="col-span-1">
<!--        {{selectedDate}}-->
        <p class="font-semibold mb-2">Календарь занятий</p>
        <DatePicker
            v-model="selectedDate"
            inline
            @update:model-value="dateSelected"
        >
          <template #date="slotProps">
            <template v-if="lessonsDates.includes(formatDateToYMDFromSlot(slotProps.date))">
              <div :id="formatDateToYMD(slotProps.date)" class="lesson-date">
                {{ slotProps.date.day }}
              </div>
            </template>
            <template v-else>
              {{ slotProps.date.day }}
            </template>
          </template>
        </DatePicker>
      </div>

      <!--     Lessons List-->
      <div  class="col-span-1">

        <div class="flex items-center justify-between mb-4">
          <p class="font-semibold ">Список уроков</p>
          <BlockAddLesson @need-update="handleUpdate" :user="selectedTeacher" :date="selectedDate" />
        </div>


        <div v-if="lessons.length === 0" class="text-gray-400">Нет уроков на выбранную дату</div>
        <div v-for="lesson in lessons.filter(x=>x.date === formatToYMD(selectedDate))" :key="lesson.id" class="p-4 rounded-lg shadow mb-3 bg-white border">
          <!--        <div :class="['h-2 rounded mb-2', getStatusColor(lesson.status.tag_color)]"></div>-->
          <div class="flex items-center justify-between">
            <div class="font-medium">{{ lesson.lesson_type.name }}</div>
            <BlockAddLesson @need-update="handleUpdate" :user="selectedTeacher" :lesson="lesson"/>
          </div>

          <div class="flex gap-2 mb-2">
            <p>Тип урока:</p><Badge :severity="lesson.lesson_type?.tag_color" >{{lesson.lesson_type?.name}}</Badge>
          </div>
          <div class="flex gap-2 mb-2">
            <p>Статус урока:</p><Badge :severity="lesson.status?.tag_color" >{{lesson.status?.name}}</Badge>
          </div>
          <div v-if="user.is_staff" class="flex gap-2 mb-4">
            <p>Статус оплаты:</p><Badge :severity="lesson.payment_status?.tag_color || 'secondary'" >{{lesson.payment_status?.name || 'Не указан'}}</Badge>
          </div>


          <div class="mb-2">
            <p>Время урока:</p>
            <p class="text-gray-600 text-sm">{{ lesson.start_time }} – {{ lesson.end_time }}</p>
          </div>
          <div class="mb-2">
            <p>Коментарий:</p>
            <p class="text-gray-600 text-sm">{{ lesson.comment }}</p>
          </div>
          <div v-if="user.is_staff" class="mb-2">
            <p>Коментарий админа:</p>
            <p class="text-gray-600 text-sm">{{ lesson.comment_hidden }}</p>
          </div>
          <div class="">
            <p>Ученики:</p>
            <p class="text-gray-600 text-sm">{{ lesson.pupils_text }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>

</template>



<style>
.lesson-date {
  background-color: #ffd700;
  border-radius: 50%;
  display: inline-block;
  width: 2em;
  height: 2em;
  line-height: 2em;
  text-align: center;
  font-weight: bold;
  color: black;
}
</style>