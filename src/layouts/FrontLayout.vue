<template lang="pug"> 
//- 手機版導覽列
v-bottom-navigation(v-model='value' :bg-color='color' mode='shift' style='height: 56px;' v-if="isMobile")
  v-row(justify='center')
    v-col.center(cols='4' v-if="!user.isLogin")
      v-btn(block to="/")
        v-icon(icon="mdi-home")
        span Home
    v-col.center(cols='4' v-if="!user.isLogin")
      v-dialog(max-width="448")
        template(v-slot:activator='{ props }')
          v-btn(v-bind='props' block) 
            v-icon(icon="mdi-login")
            span Login
        template(v-slot:default='{ isActive }')
          LoginView(@close-dialog='closeDialog')
    v-col.center(cols='4' v-if="!user.isLogin")
      v-dialog(max-width="448" v-model='registerDialog')
        template(v-slot:activator='{ props }')
          v-btn(v-bind='props' block)
            v-icon(icon="mdi-account-plus")
            span Register
        template(v-slot:default='{ isActive }')
          RegisterView(@close-dialog='closeDialog')
    v-col.center(cols='4' v-if="user.isLogin")
      v-btn(block to="/main")
        v-icon(icon="mdi-timer-play-outline")
        span Main
    v-col.center(cols='4' v-if="user.isLogin")
      v-btn(block to="/profile")
        v-icon(icon="mdi-account-circle")
        span Profile
    v-col.center(cols='4' v-if="user.isLogin")
      v-btn(block to="/friends")
        v-icon(icon="mdi-account-star")
        span Friends
  //- 
    v-col.center(cols='4' v-if="user.isLogin")
      v-btn(block @click="logout")
        v-icon(icon="mdi-logout")
        span Logout

//- 電腦版導覽列 
v-navigation-drawer(expand-on-hover, rail, color="#F2E8DC" v-if="user.isLogin")
  v-list
    v-list-item(:prepend-avatar, :title='user.name', to="/main", style="color: #403D3C", :active="false" v-if="user.isLogin")
    v-list-item(prepend-avatar='/favicon.ico', title='Cookie Project', to="/", style="color: #403D3C", :active="false" v-if="!user.isLogin")
  v-divider
  v-list(density='compact', nav)
    v-list-item.textcolor(prepend-icon="mdi-home" to="/" title="Home" v-if="!user.isLogin" :active="false")
    v-list-item.textcolor(prepend-icon="mdi-login" to="/" title="Login" v-if="!user.isLogin" :active="false")
      v-dialog(v-model='loginDialog' activator="parent" max-width="448")
        LoginView(@close-dialog='closeDialog')
    v-list-item.textcolor(prepend-icon="mdi-account-plus" to="/" title="Register" v-if="!user.isLogin" :active="false")
      v-dialog(v-model='registerDialog' activator="parent" max-width="448")
        RegisterView(@close-dialog='closeDialog')
    v-list-item.textcolor(prepend-icon="mdi-timer-play-outline" to="/main" title="Main" v-if="user.isLogin" :active="false")
    v-list-item.textcolor(prepend-icon="mdi-account-circle" to="/profile" title="Profile" v-if="user.isLogin")
    v-list-item.textcolor(prepend-icon="mdi-account-star" to="/friends" title="Friends" v-if="user.isLogin")
    v-list-item.textcolor(prepend-icon="mdi-logout" title="Logout" v-if="user.isLogin" @click="logout")
//- v-main(style="height: 100vh")
v-main
  router-view

</template>

<script setup>
import { useDisplay } from 'vuetify' // access information about the current display properties.
import { ref, computed } from 'vue'
import RegisterView from '@/views/front/RegisterView.vue'
import LoginView from '@/views/front/LoginView.vue'
import { useUserStore } from '@/store/user'
import { useApi } from '@/composables/axios'
import { useSnackbar } from 'vuetify-use-dialog'
import { useRouter } from 'vue-router'

const { xs } = useDisplay()
const { md } = useDisplay()
const { sm } = useDisplay()

const isMobile = computed(() => xs.value)
const isMd = computed(() => md.value)
const isSm = computed(() => sm.value)

const { apiAuth } = useApi()
const router = useRouter()
const createSnackbar = useSnackbar()
const user = useUserStore()

const value = ref(0);
const loginDialog = ref(false)
const registerDialog = ref(false)

const snackbarLocation = () => {
  if (xs.value) return 'center'
  else if (!xs.value) return 'bottom'
}

const closeDialog = () => {
  registerDialog.value = false
  loginDialog.value = false
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

const color = computed(() => {
  switch (value.value) {
    case 0: return '#F2E8DC'
    case 1: return '#8FA9BF'
    case 2: return '#D9D9D9'
    default: return 'blue-grey'
  }
})

const prependAvatar = computed(() => {
  return `https://source.boringavatars.com/beam/120/${user.account}?colors=907363,BFAE9F,D9CDBF,F2E8DC,8FA9BF`
})

</script>

<style lang="sass" scoped>
.center 
  display: flex
  padding-left: 0
  padding-right: 0

.textcolor
  color: #403D3C
</style>
