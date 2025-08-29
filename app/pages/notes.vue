<script setup lang="ts">
const {$api} =  useNuxtApp()
const {user} = useAuthStore()

const text =ref('')
const text1 =ref('')
const text2 =ref('')
const text3 =ref('')

const status_id =ref(null)

const create_note = ref(false)
const {data, refresh} = await useAsyncData(()=>$api.data.notes())
const {data:statuses} = await useAsyncData(()=> $api.data.statuses())

const noteAction = async (action,id:null,body:null) => {

  const res = await $api.data.note_action(action,id,body || {
    text: text.value,
    text1: text1.value,
    text2: text2.value,
    text3: text3.value,
    status_id:status_id.value
  })

  await refresh()
  create_note.value = false
}
</script>

<template>
  <div class="container">

    <div class="flex gap-4 items-center">
      <NuxtLink to="/"><Button label="Расписание"/> </NuxtLink>

      <Button @click="create_note = !create_note" label="Добавить заметку"/>

  </div>
    <div v-if="create_note" class="">


      <p class="mb-1">Статус</p>
      <Select class="mb-3" fluid v-model="status_id" :options="statuses.note_statuses" option-label="name" option-value="id">
        <template #option="slotProps">
          <div class="flex items-center">
            <div><Badge :value="slotProps.option.name" :severity="slotProps.option.tag_color"></Badge></div>
          </div>
        </template>
      </Select>
      <p class="mb-1">ФИО клента ребенка</p>
      <Textarea v-model="text" fluid/>
      <p class="mb-1">Возраст и уровень ученика</p>
      <Textarea v-model="text1" fluid/>
      <p class="mb-1">Коментарий к заявке</p>
      <Textarea v-model="text2" fluid/>
      <p class="mb-1">Дата последнего контакта</p>
      <Textarea v-model="text3" fluid/>
      <Button @click="noteAction('post')" label="Создать"/>
    </div>
    <DataTable :value="data" >
      <Column field="id" header="id"></Column>
      <Column  header="Статус">
        <template #body="slotProps">
          <Select class="mb-3"  v-model="slotProps.data.status.id"
                  @update:model-value="noteAction('patch',slotProps.data.id,{status_id:slotProps.data.status.id})"
                  :options="statuses.note_statuses" option-label="name" option-value="id">
            <template #value="slotProps">
              <div v-if="slotProps.value" class="flex items-center">
                <Badge :value="statuses.note_statuses?.find(x=>x.id === slotProps.value).name"
                       :severity="statuses.note_statuses?.find(x=>x.id === slotProps.value).tag_color"></Badge>
              </div>
              <span v-else>
            {{ slotProps.placeholder }}
        </span>
            </template>
            <template #option="slotProps">
              <div class="flex items-center">
                <div>
                  <Badge :value="slotProps.option.name" :severity="slotProps.option.tag_color"></Badge>
                </div>
              </div>
            </template>
          </Select>

<!--          <Badge :severity="slotProps.data.status?.tag_color" >{{slotProps.data.status?.name}}</Badge>-->

        </template>
      </Column>
      <Column  header="ФИО клента ребенка">
        <template #body="slotProps">
          <pre>{{slotProps.data.text}}</pre>
        </template>
      </Column>
      <Column  header="Возраст и уровень ученика">
        <template #body="slotProps">
          <pre>{{slotProps.data.text1}}</pre>
        </template>
      </Column>
      <Column  header="Коментарий к заявке">
        <template #body="slotProps">
          <pre>{{slotProps.data.text2}}</pre>
        </template>
      </Column>
      <Column  header="Дата последнего контакта">
        <template #body="slotProps">
          <pre>{{slotProps.data.text3}}</pre>
        </template>
      </Column>
      <Column class="w-24 !text-end">
        <template #body="{ data }">
          <Button icon="pi pi-trash" @click="noteAction('delete',data.id)" severity="danger" ></Button>
        </template>
      </Column>
    </DataTable>
  </div>
</template>

<style scoped>

</style>