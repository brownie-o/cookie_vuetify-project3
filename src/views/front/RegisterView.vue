<template lang="pug">
div
  v-form.mt-50(:disabled="isSubmitting" @submit.prevent="submit")
    v-card.mx-auto.pa-12.pb-8(
      elevation='8', 
      max-width='448', 
      title="Register"
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
      .text-subtitle-1.text-medium-emphasis Email
      v-text-field(
        density='compact', 
        placeholder='Email address', 
        prepend-inner-icon='mdi-email-outline', 
        v-model="email.value.value",
        :error-messages="email.errorMessage.value",
        variant='outlined',
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
      .text-subtitle-1.text-medium-emphasis.d-flex.align-center.justify-space-between
        | Confirm Password
      v-text-field(
        :append-inner-icon="visible2 ? 'mdi-eye-off' : 'mdi-eye'", 
        :type="visible2 ? 'text' : 'password'", 
        density='compact', 
        placeholder='Confirm your password', 
        prepend-inner-icon='mdi-lock-outline', 
        v-model="passwordConfirm.value.value",
        :error-messages="passwordConfirm.errorMessage.value",
        variant='outlined', 
        maxlength="20",
        counter='20',
        clearable,
        @click:append-inner='visible2 = !visible2')
      v-btn.mb-8(
        block='', 
        color='blue', 
        size='large', 
        variant='tonal',
        type="submit",
        )
        | Create Account
</template>

<script setup>
import { useDisplay } from 'vuetify'
import { ref, computed } from 'vue'
import validator from 'validator'
import { useForm, useField } from 'vee-validate'
import * as yup from 'yup'
import { useRouter } from 'vue-router' // 對路由做操作 ex: 做跳頁
// import { useRoute } from 'vue-router' // 取路由資訊
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
const visible2 = ref(false)

// 元件可以觸發事件 告訴外面的元件要做什麼事
const emit = defineEmits(['close-dialog'])

// (表單驗證)
const schema = yup.object({
  account: yup
    .string()
    .required('帳號為必填欄位')
    .min(6, '使用者帳號長度不符')
    .max(20, '使用者帳號長度不符'),
  email: yup
    .string()
    .required('信箱為必填欄位')
    .test(
      // https://github.com/jquense/yup?tab=readme-ov-file#schematestname-string-message-string--function--any-test-function-schema 
      // '自訂驗證名稱', '錯誤訊息', '驗證function'
      'isEmail', '信箱格式錯誤',
      (value) => {
        return validator.isEmail(value)
      }
    ),
  password: yup
    .string()
    .required('密碼為必填欄位')
    .min(6, '密碼長度不符')
    .max(20, '密碼長度不符'),
  passwordConfirm: yup
    .string()
    .required('密碼為必填欄位')
    .min(6, '密碼長度不符')
    .max(20, '密碼長度不符')
    // .oneOf(陣列, '錯誤訊息') 只允許符合陣列內其中一個值
    // .ref('password') 代表這個schema的password欄位的值
    .oneOf([yup.ref('password')])
})

// handleSubmit: 表單送出之後要幹嘛
// isSubmitting: 是否在送出中
const { handleSubmit, isSubmitting } = useForm({
  // 設定表單驗證方式: 綁定/使用上面設定的schema
  validationSchema: schema
})

// 註冊每個表單的欄位
// useField('_ooo_') 要和上面的schema yup 一致
const account = useField('account')
const email = useField('email')
const password = useField('password')
const passwordConfirm = useField('passwordConfirm')

const snackbarLocation = () => {
  if (xs.value) return 'center'
  else if (!xs.value) return 'bottom'
}

// submit function: 呼叫 useForm 的 handleSubmit做事
// values = 表單裡面所有欄位的值
const submit = handleSubmit(async (values) => {
  try {
    // post('路徑', 要送出的東西)
    await api.post('/users', {
      account: values.account,
      email: values.email,
      password: values.password
    })
    createSnackbar({
      text: '註冊成功',
      showCloseButton: false,
      snackbarProps: {
        timeout: 2000,
        color: 'green',
        location: snackbarLocation(),
        rounded: 'pill',
        variant: 'tonal'
      }
    })
    // 註冊後直接登入
    const { data } = await api.post('/users/login', {
      account: values.account,
      password: values.password
    })
    user.login(data.result)
    router.push('/profile')
    emit('close-dialog')
    // 要自動登入或是跳出登入dialog
  } catch (error) {
    console.log(error)
    let text = error?.response?.data?.message || '發生錯誤，請稍後再試'
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