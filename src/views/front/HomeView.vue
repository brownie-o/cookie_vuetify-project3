<template lang="pug">
VParallax(src="https://images.unsplash.com/photo-1622838805759-a64754fca2c6")
  div.d-flex.flex-column.fill-height.justify-center.align-center.text-white
    h1.text-h4.font-weight-thin.mb-4 Cookie Project 
    h4.subheading Manage your time!
    v-btn.loginStyle.align-self-start(prepend-icon="mdi-login" to="/" :active="false" size="large" v-if="!isMobile || !isLogin") Login
      v-dialog(v-model='loginDialog' activator="parent" max-width="448")
        LoginView(@close-dialog='closeDialog')
    v-btn.registerStyle.align-self-start(prepend-icon="mdi-account-plus" to="/" :active="false" size="large" v-if="!isMobile || !isLogin") Register
      v-dialog(v-model='registerDialog' activator="parent" max-width="448")
        RegisterView(@close-dialog='closeDialog')

//- or #parallax in swiper https://codesandbox.io/p/sandbox/gcx89m?file=%2Findex.html
</template>

<script setup>
import { ref, computed } from 'vue'
import { useDisplay } from 'vuetify'
import RegisterView from '@/views/front/RegisterView.vue'
import LoginView from '@/views/front/LoginView.vue'

const loginDialog = ref(false)
const registerDialog = ref(false)

const { xs } = useDisplay()
const isMobile = computed(() => xs.value)

const closeDialog = () => {
  registerDialog.value = false
  loginDialog.value = false
}

</script>

<style lang="sass" scoped>
.registerStyle
  color: #8FA9BF
  margin: 1rem 0 1rem 10rem
  background-color: #D9CDBF

.loginStyle
  color: #8FA9BF
  margin: 5rem 0 1rem 10rem
  background-color: #F2E8DC
</style>
