<template lang="pug">
//- 手機版
VBottomNavigation(style='height: 56px; color: #403D3C' v-if="isMobile" bg-color="#D9D9D9" mode='shift')
  v-row(justify='center')
    v-col.center(cols='4' v-for="item in navItems" :key="item.to")
      v-btn(block :to="item.to")
        v-icon(:icon="item.icon")
        span {{ item.text }}
    v-col.center(cols='4' @click="logout")
      v-btn(block)
        v-icon(icon="mdi-logout")
        span Logout
//- 電腦版
VNavigationDrawer(expand-on-hover, rail, color="#D9D9D9" mobile-breakpoint="sm" v-else)
  VList
    VListItem(:prepend-avatar :title="user.account")
  VDivider
  VList
    VListItem(v-for="item in navItems" :key="item.to" :title="item.text" :prepend-icon="item.icon" :to="item.to")
    VListItem(title="logout" prepend-icon="mdi-logout" @click="logout")
VMain
  RouterView
</template>

<script setup>
import { useDisplay } from 'vuetify'
import { useUserStore } from '@/store/user'
import { computed } from 'vue'
import { useApi } from '@/composables/axios'
import { useSnackbar } from 'vuetify-use-dialog'
import { useRouter } from 'vue-router'

const { xs } = useDisplay()
const isMobile = computed(() => xs.value)

const user = useUserStore()
const { apiAuth } = useApi()
const router = useRouter()
const createSnackbar = useSnackbar()

const navItems = [
  { to: '/', text: 'Home', icon: 'mdi-home' },
  { to: '/admin/users', text: 'User', icon: 'mdi-account-cog' },
]

const prependAvatar = computed(() => {
  return `https://source.boringavatars.com/beam/120/${user.account}?colors=907363,BFAE9F,D9CDBF,F2E8DC,8FA9BF`
})

const snackbarLocation = () => {
  if (xs.value) return 'center'
  else if (!xs.value) return 'bottom'
}

const logout = async () => {
  try {
    await apiAuth.delete('/users/logout')
    user.logout()
    createSnackbar({
      text: '登出成功',
      showCloseButton: false,
      snackbarProps: {
        timeout: 2000,
        color: 'green',
        location: snackbarLocation(),
        rounded: 'pill',
        variant: 'tonal'
      }
    })
    router.push('/')
  } catch (error) {
    console.log(error)
    const text = error?.response?.data?.message || '發生錯誤，請稍後再試'
    createSnackbar({
      text,
      showCloseButton: false,
      snackbarProps: {
        timeout: 2000,
        color: 'red',
        location: snackbarLocation(),
        rounded: 'pill',
        variant: 'tonal'
      }
    })
  }
}
</script>

<style lang="sass" scoped>
.center 
  display: flex
  padding-left: 0
  padding-right: 0
</style>
