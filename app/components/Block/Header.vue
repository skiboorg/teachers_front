<script setup lang="ts">
const {user} = useAuthStore()
const links = [
  {name: 'Расписание', to: '/', is_admin: false, is_support:false},
  {name: 'Заметки', to: '/notes', is_admin: true, is_support:false},
  {name: 'Задачи', to: '/task', is_admin: true, is_support:false},
  {name: 'Идеи для reels', to: '/reels_idea', is_admin: true, is_support:true},
  {name: 'Идеи для МК', to: '/mk_idea', is_admin: true, is_support:true},
]

const visibleLinks = computed(() => {
  if (user.is_staff) {
    // Админ видит всё
    return links
  } else if (user.is_support) {
    // Саппорт видит только свои
    return links.filter(link => link.is_support)
  } else {
    // Обычный пользователь
    return links.filter(link => !link.is_admin && !link.is_support)
  }
})
</script>

<template>
<div class="container">
  <div class="flex justify-between items-center mb-4 pt-4">
    <div class="flex gap-4">
      <NuxtLink
          v-for="link in visibleLinks"
          :key="link.to"
          active-class="is-active"
          :to="link.to"
      >
        {{ link.name }}
      </NuxtLink>
    </div>
    <div class="flex gap-4 items-center">
      <img class="w-[70px] h-[70px] object-cover rounded-full" :src="user.avatar" alt="">
      <p>{{user.full_name}}</p>
      <Button @click="$api.data.logout()" label="Выйти"/>
    </div>
  </div>
</div>
</template>

<style lang="sass">
.is-active
  font-weight: 600
  color: #d97706
  text-decoration: underline
</style>