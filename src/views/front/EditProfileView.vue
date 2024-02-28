<template lang="pug">
//- 大版 
VForm(:disabled="isSubmitting" @submit.prevent="submit" )
  VCard.mx-auto.mt-50.p-2(:max-width="1000" v-if="!isMobile && (isMd || isLarge)")
    VRow
      VBtn.ms-3.mt-3(icon="mdi-arrow-left" to="/profile" variant="text")
    VRow.justify-center.mb-3
      VCardTitle.title 編輯個人資料
    VRow.mt-0(justify='center')
      VCol(cols="3")
        VImg.w-50.mx-auto(:src="user.avatar")
      VCol.d-flex.align-center(cols="3")
        VTextField(
          v-model="user.name"
          label="編輯名稱"
          variant="outlined"
          :rules="[value => !!value || '必填']"
          )
      VCol.color.d-flex.align-center(cols="3")
        h4 好友代碼: {{ user.friendsCode }}
      VCol.color.d-flex.align-center(cols="3")
        VImg.flex-0(src="@/assets/favicon.ico" width="30" height="30")
        h4  : {{ user.cookieNum }}
    VRow 
      VCol.d-flex.align-center(cols="6")
        span 餅乾計畫初始日: {{ user && user.createdAt ? new Date(user.createdAt).toJSON().slice(0,10).split('-').join('/') : 'N/A' }}
      VCol.d-flex.align-center(cols="6")
        span 達成天數: {{ user.accomplishment }}
    VRow
      VCol.d-flex.align-center(cols="12")
        VTextField(
          v-model="user.finalGoal"
          label="最終目標"
          variant="outlined"
          )
    //- VRow
    //-   VCol.d-flex.align-center
    //-     span 增改刪除待辦事項類型: 
    VBtn.btnStyle.mx-auto.d-flex.my-5(prepend-icon="mdi-content-save-edit-outline" type="submit" :loading="isSubmitting") SAVE

//- 中小版
VForm(:disabled="isSubmitting" @submit.prevent="submit")
  VCard.mx-auto.mt-50.p-2(v-if="!isMd && !isLarge" :max-width="isMobile ? '480' : '600'")
    VRow
      VBtn.ms-3.mt-3(icon="mdi-arrow-left" to="/profile" variant="text")
    VRow.justify-center.mb-3
      VCardTitle.title 編輯個人資料
    VRow.mt-0(justify='center')
      VCol(cols="6")
        VImg.w-50.mx-auto(:src="user.avatar")
      VCol.d-flex.align-center(cols="6")
        VTextField(
          v-model="user.name"
          label="編輯名字"
          variant="outlined"
          :rules="[value => !!value || '必填']"
          )
    VRow.mt-0(justify='center')
      VCol.color.d-flex.align-center(cols="6")
        h4 好友代碼: {{ user.friendsCode }}
      VCol.color.d-flex.align-center(cols="6")
        VImg.flex-0(src="@/assets/favicon.ico" width="30" height="30")
        h4  : {{ user.cookieNum }}
    VRow 
      VCol.d-flex.align-center(cols="6")
        span 餅乾計畫初始日: {{ user && user.createdAt ? new Date(user.createdAt).toJSON().slice(0,10).split('-').join('/') : 'N/A' }}
      VCol.d-flex.align-center(cols="6")
        span 達成天數: {{ user.accomplishment }}
    VRow
      VCol.d-flex.align-center(cols="12")
        VTextField(
          v-model="user.finalGoal"
          label="最終目標"
          variant="outlined"
          )
    VBtn.btnStyle.mx-auto.d-flex.my-5(prepend-icon="mdi-content-save-edit-outline" type="submit" :loading="isSubmitting") SAVE
</template>

<script setup>
import { useDisplay } from 'vuetify'
import { ref, computed } from 'vue'
import { useUserStore } from '@/store/user'
import { useForm, useField } from 'vee-validate'
import * as yup from 'yup'
import { useApi } from '@/composables/axios'
import { useSnackbar } from 'vuetify-use-dialog'

const user = useUserStore()
const createSnackbar = useSnackbar()
const { apiAuth } = useApi()
const fileAgent = ref(null)

const { xs } = useDisplay()
const { md } = useDisplay()
const { lg } = useDisplay()
const isMobile = computed(() => xs.value)
const isMd = computed(() => md.value)
const isLarge = computed(() => lg.value)

// 怪怪的
const maxwidth = () => {
  if (isMobile && !isMd && !isLarge) return 480
  else if (!isMobile && !isMd && !isLarge) return 600
  else if (!isMobile && (isMd || isLarge)) return 1000
}

// const saveInfo = async () => {
//   // hummmm...
//   name.value.value = user.name
//   finalGoal.value.value = user.finalGoal
//   friendsCode.value.value = user.friendsCode
//   resetForm()
//   console.log('saveInfo', user)
//   // apiAuth.patch(`/users/me`, {
//   await apiAuth.patch(`/users/${user._id}`, {
//     name: name.value.value,
//     finalGoal: finalGoal.value.value,
//     friendsCode: friendsCode.value.value
//   })
// }

// const schema = yup.object({
//   account: yup
//     .string()
//     .required('帳號為必填')
// })
const { isSubmitting, handleSubmit, resetForm } = useForm()

const name = useField('name')
const finalGoal = useField('finalGoal')

const fileRecords = ref([])
const rawFileRecords = ref([])

const snackbarLocation = () => {
  if (xs.value) return 'center'
  else if (!xs.value) return 'bottom'
}

const submit = handleSubmit(async (values) => {
  try {
    console.log('submit')
    // 建立 FormData 物件
    // 使用 fd.append(欄位, 值) 將資料放進去
    const fd = new FormData()
    for (const key in values) {
      fd.append(key, values[key])
    }

    // 有東西才會push
    if (fileRecords.value.length > 0) {
      fd.append('image', fileRecords.value[0].file)
    }
    console.log(fd)
    console.log('values', user.name)

    await apiAuth.patch(`/users/${user._id}`, {
      name: user.name,
      finalGoal: user.finalGoal,
    })

    await apiAuth.patch(`/users/${user._id}`, fd)

    createSnackbar({
      text: '編輯成功',
      showCloseButton: false,
      snackbarProps: {
        timeout: 2000,
        color: 'green',
        location: snackbarLocation(),
        rounded: 'pill',
        variant: 'tonal'
      }
    })
    user.getProfile()

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

.p-2
  padding: 1rem

.color
  color: #403D3C

.btnStyle
  background: #BFAE9F
  color: white
  margin-left: 1rem

.flex-0
  flex: 0 0 auto !important

.title
  font-size: 2rem
  font-weight: bold
</style>