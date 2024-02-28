<template lang="pug">
div
  v-form.mt-50(:disabled="isSubmitting" @submit.prevent="submit")
    v-card.mx-auto.pa-12.pb-8(
      elevation='8', 
      max-width='448', 
      title="Login"
      rounded='lg')
      .text-subtitle-1.text-medium-emphasis Account
      v-text-field(
        density='compact', 
        placeholder='Account', 
        prepend-inner-icon='mdi-account-circle', 
        v-model="account.value.value",
        :error-messages="account.errorMessage.value",
        variant='outlined',
        maxlength="20",
        counter='20',
        clearable)
      .text-subtitle-1.text-medium-emphasis.d-flex.align-center.justify-space-between
        | Password
      v-text-field(
        :append-inner-icon="visible ? 'mdi-eye-off' : 'mdi-eye'", 
        :type="visible ? 'text' : 'password'", 
        density='compact', 
        placeholder='Enter your password', 
        prepend-inner-icon='mdi-lock-outline', 
        v-model="password.value.value",
        :error-messages="password.errorMessage.value",
        variant='outlined', 
        maxlength="20",
        counter='20',
        clearable,
        @click:append-inner='visible = !visible')
      v-btn.mb-8(
        block='', 
        color='blue', 
        size='large', 
        variant='tonal',
        type='submit'
        )
        | Log In
//- 唉
  v-card-text.text-center
    //- 可以跳轉到/register 無法變更顯示 RegisterView.vue dialog
    //- v-dialog(max-width="448")
    //-   template(v-slot:activator='{ props }')
    //-     router-link.text-blue.text-decoration-none(rel='noopener noreferrer' v-bind='props' block)
    //-       | Sign up now 
    //-       v-icon(icon='mdi-chevron-right')
    //-   template(v-slot:default='{ isActive }')
    //-     RegisterView
    router-link.text-blue.text-decoration-none(to='/register', rel='noopener noreferrer')
      | Sign up now 
      v-icon(icon='mdi-chevron-right')
        v-dialog(v-model='registerDialog' activator="parent" max-width="448")
          RegisterView
</template>

<script setup>
import { useDisplay } from 'vuetify'
import validator from 'validator'
import { ref, computed } from 'vue'
import { useForm, useField } from 'vee-validate'
import * as yup from 'yup'
import { useRouter } from 'vue-router'
import { useSnackbar } from 'vuetify-use-dialog'
import { useApi } from '@/composables/axios'
import { useUserStore } from '@/store/user'

const { xs } = useDisplay()
const isMobile = computed(() => xs.value)

const { api } = useApi()

const router = useRouter()
const createSnackbar = useSnackbar()

const user = useUserStore()

const visible = ref(false)
const registerDialog = ref(false);

const schema = yup.object({
  account: yup
    .string()
    .required('帳號為必填欄位')
    .min(6, '帳號長度不符')
    .max(20, '使用者帳號長度不符'),
  password: yup
    .string()
    .required('密碼為必填欄位')
    .min(6, '密碼長度不符')
    .max(20, '密碼長度不符'),
})

const { handleSubmit, isSubmitting } = useForm({
  validationSchema: schema
})

const account = useField('account')
const password = useField('password')

const snackbarLocation = () => {
  if (xs.value) return 'center'
  else if (!xs.value) return 'bottom'
}

const submit = handleSubmit(async (values) => {
  try {
    const { data } = await api.post('/users/login', {
      account: values.account,
      password: values.password
    })
    user.login(data.result) // 把data傳入store的login function
    createSnackbar({
      text: '登入成功',
      showCloseButton: false,
      snackbarProps: {
        timeout: 2000,
        color: 'green',
        location: snackbarLocation(),
        rounded: 'pill',
        variant: 'tonal'
      }
    })
    if (!user.isAdmin) {
      return router.push('/profile')
    } else if (user.isAdmin) {
      return router.push('/admin')
    }
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
})
</script>

<style lang="sass" scoped>
.mt-50
  margin-top: calc(5vh - 3vw)
  margin-bottom: calc(5vh - 3vw)
  @media (min-width: 960px) 
    margin-top: calc(21vh - 5vw)
    margin-bottom: calc(21vh - 5vw)
  @media (min-width: 600px) and (max-width: 960px) 
    margin-top: calc(15vh - 5vw)
    margin-bottom: calc(15vh - 5vw)
</style>