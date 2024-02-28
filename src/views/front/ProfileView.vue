<template lang="pug">
//- 大版 
VCard.mx-auto.mt-50.p-2(max-width="1000" v-if="isMd || isLarge")
  template(v-if="profile")
      VRow
        VBtn.ms-auto.me-3.mt-3(icon="mdi-cog" to="/edit" variant="text")
      VRow.mt-0(justify='center' )
        VCol(cols="3")
          VImg.w-50.mx-auto(:src="user.avatar")
        VCol.d-flex.align-center(cols="3")
          h3 {{ user.name }}
        VCol.color.d-flex.align-center(cols="3")
          span 好友代碼: {{ user.friendsCode }}
        VCol.color.d-flex.align-center(cols="3")
          VImg.flex-0(src="@/assets/favicon.ico" width="30" height="30")
          h4  : {{ user.cookieNum }}
      VRow.px-2.mt-2
        VCol.ps-15(cols="6")
          span 餅乾計畫初始日: {{ user && user.createdAt ? new Date(user.createdAt).toJSON().slice(0,10).split('-').join('/') : 'N/A' }}
        VCol.pe-15(cols="6")
          span 達成天數: {{ user.accomplishment }}
      VRow.px-2.mt-2
        VCol.ps-15(cols="12")
          span 最終目標: {{ user.finalGoal }}
      VDivider.mt-5
      VRow.px-2.mt-2
        VCol.ps-15.pb-0(cols="12")
          span 待辦事項
      VRow.p-2
        VCol.py-5(cols="12")
          draggable(
            tag="ul"
            :list="profile.todoList"
            class="list-group"
            handle=".handle"
            item-key="id"
            )
            template(#item="{ element, index }")
              VRow.bg
                VCol.d-flex.align-center(cols="2")
                  VIcon.handle.grab.color(icon="mdi-menu" )
                  span.text(
                    v-show="!element.done && !element.edit" 
                    @dblclick="element.edit = !element.edit") {{ element.task }}
                      VTooltip(activator="parent" location="top" opacity="0.1") 點兩下編輯
                  VTextField(
                    v-model="element.task" 
                    v-show="element.edit" 
                    v-if="element.edit"
                    variant="outlined" 
                    label="待辦事項" 
                    :rules="[value => !!value || '必填']"
                    @blur="handleBlur(element)"
                    v-on:keyup.enter="$event.target.blur()"
                    autofocus)
                    //- $event.target.blur(): $event 是原生 DOM 事件對象，$event.target 是觸發事件的元素
                  del.text(v-show="element.done") {{ element.task }}
                VCol.d-flex.align-center(cols="1")
                  span {{ convertedTime(element) }}
                    VTooltip(activator="parent" location="top" opacity="0.1") 預計花費時間
                VCol.d-flex.align-center(cols="5")
                  v-slider.ma-4(
                    v-model='element.time', 
                    :max='6', :min='0.25', :step='0.25' , 
                    hide-details, 
                    style='width: 400px', 
                    show-ticks="always", 
                    thumb-label="always"
                    :disabled="element.done") 
                VCol.d-flex.align-center.justify-space-between(cols="4")
                  VSelect.me-10(
                    v-model="element.category"
                    :items="categories"
                    chips
                    label="類型"
                    density="comfortable"
                    hide-details
                    variant="outlined"
                    )
                  //- 
                    VTextarea.d-flex(v-model="element.note" variant="outlined" rows="1" row-height="10" label="備註" hide-details="true" clearable)
                  VIcon.color.me-2(icon="mdi-comment-text-outline" @click="")
                    VTooltip(activator="parent" location="top" opacity="0.1") 備註
                  VIcon.mx-2(icon="mdi-check" :color="element.done ? 'green' : 'grey'" @click="element.done = !element.done")
                    VTooltip(activator="parent" location="top" opacity="0.1") 完成
                  VIcon.close.color.mx-2(icon="mdi-close" @click="removeAt(index)")
                    VTooltip(activator="parent" location="top" opacity="0.1") 刪除
        RawDisplayer.col-3(:value="profile.todoList" title="List")
        VCol.mx-auto(cols="1")
          VBtn.btnStyle(prepend-icon="mdi-plus" @click="add") Add

//- 中小版 
VCard.mx-auto.mt-50.p-2(v-if="!isMd && !isLarge" :max-width="isMobile ? '480' : '600'")
  //- template(v-if="user[0]")
  template(v-if="profile")
    VRow
      VSpacer
      VBtn.ms-auto.me-3.mt-3(icon="mdi-logout" to="/" @click="logout" variant="text")
      VBtn.me-3.mt-3(icon="mdi-cog" to="/edit" variant="text")
    VRow.mt-0(justify='center')
      VCol(cols="6")
        VImg.w-50.mx-auto(:src="user.avatar")
      VCol.d-flex.align-center(cols="6")
        h3 {{ user.name }}
    VRow.px-2
      VCol(cols="6")
        span 好友代碼: {{ user.friendsCode }}
      VCol.d-flex.align-center(cols="6")
        VImg.flex-0(src="@/assets/favicon.ico" width="30" height="30")
        h4  : {{ user.cookieNum }}
    VRow.px-2
      VCol(cols="6")
        span 餅乾計畫初始日: {{ user && user.createdAt ? new Date(user.createdAt).toJSON().slice(0,10).split('-').join('/') : 'N/A' }}
      VCol(cols="6")
        span 達成天數: {{ user.accomplishment }}
    VRow.px-2
      VCol(cols="12")
        span 最終目標: {{ user.finalGoal }}
    VDivider.mt-5
    VRow.p-1
      VCol.py-5(cols="12")
        draggable(
          tag="ul"
          :list="profile.todoList"
          class="list-group"
          handle=".handle"
          item-key="id")
          template(#item="{ element, index }")
            VRow.bg
              VCol.d-flex.align-center(cols="5")
                VIcon.handle.grab.color(icon="mdi-menu" )
                span.text(
                  v-show="!element.done && !element.edit" 
                  @dblclick="element.edit = !element.edit") {{ element.task }}
                  VTooltip(activator="parent" location="top" opacity="0.1") 點兩下編輯
                VTextField(
                  v-model="element.task"
                  v-show="element.edit"
                  v-if="element.edit"
                  variant="outlined" 
                  label="待辦事項"
                  :rules="[value => !!value || '必填']"
                  @blur="handleBlur(element)"
                  @keydown.enter="$event.target.blur()"
                  autofocus=true)
                del.text(v-show="element.done") {{ element.task }}
              VCol.d-flex.align-center.justify-space-between(cols="7")
                VSelect.me-10(
                  v-model="element.category"
                  :items="categories"
                  chips
                  label="類型"
                  density="comfortable"
                  hide-details
                  variant="outlined"
                  )
                //- 
                  VTextarea.d-flex(v-model="element.note" variant="outlined" rows="1" row-height="10" label="備註" hide-details="true" clearable)
                VIcon.color.me-2(icon="mdi-comment-text-outline" @click="")
                VIcon.mx-2(icon="mdi-check" :color="element.done ? 'green' : 'grey'"  @click="element.done = !element.done")
                VIcon.close.color.mx-2(icon="mdi-close" @click="removeAt(index)")
              VCol.d-flex.align-center(cols="2")
                span {{ convertedTime(element) }}
                  VTooltip(activator="parent" location="top" opacity="0.1") 預計花費時間
              VCol.d-flex.align-center(cols="10")
                v-slider.ma-4(v-model='element.time', :min='0.25', :max='6', :step='0.25' , hide-details='', style='width: 400px', show-ticks="always", thumb-label="always" :disabled="element.done") 
      rawDisplayer.col-3(:value="profile.todoList" title="List")
      VCol.mx-auto(cols="1")
        VBtn.btnStyle(prepend-icon="mdi-plus" @click="add") Add

</template>

<script setup>
import { useDisplay } from 'vuetify'
import { ref, computed, onMounted, watch } from 'vue'
import draggable from 'vuedraggable'
import { useApi } from '@/composables/axios'
import { useSnackbar } from 'vuetify-use-dialog'
import { useUserStore } from '@/store/user'
import { useRouter } from 'vue-router'

const { apiAuth } = useApi()
const createSnackbar = useSnackbar()
const router = useRouter()

const user = useUserStore()
console.log('user', user)
// console.log('user._id', user.value.account)

const { xs } = useDisplay()
const { md } = useDisplay()
const { lg } = useDisplay()
const isMobile = computed(() => xs.value)
const isMd = computed(() => md.value)
const isLarge = computed(() => lg.value)

const profile = ref({
  todoList: [],
})
console.log('profile', profile)

// const profile = ref({
//   account: user.account,
//   email: user.email,
//   role: user.role,
//   name: user.name,
//   avatar: user.avatar,
//   finalGoal: user.finalGoal,
//   cookieNum: user.cookieNum,
//   accomplishment: user.accomplishment,
//   startDate: user.startDate,
//   friendsCode: user.friendsCode,
//   status: user.status,
//   uptime: user.uptime,
//   todoList: user.todoList,
//   _id: user._id
// })


// 預設類型
const categories = ['工作', '學習', '休閒', '家務', '自我管理', '其他']

// 有空可以研究加上transition
// https://github.com/SortableJS/vue.draggable.next/blob/master/example/components/transition-example-2.vue
const dragging = ref(false)
const draggingInfo = computed(() => dragging.value ? "under drag" : "")

const removeAt = (idx) => {
  profile.value.todoList.splice(idx, 1)
}

const convertedTime = (element) => {
  const hour = Math.trunc(element.time)
  let minute = 0
  const float = element.time - hour
  if(float === 0.25) {
    minute = 15
  } else if (float === 0.5) {
    minute = 30
  } else if (float === 0.75) {
    minute = 45
  }

  return `${hour} : ${String(minute).padStart(2, '0')}`
}


const add = () => {
  profile.value.todoList.push({ 
    task: '', 
    id: profile.value.todoList.length, 
    note: '', 
    time: 1, 
    done: false, 
    edit: true,
    category: '其他' 
  })
  // apiAuth.patch('/users/' + user._id, { todoList: user.value.todoList })
}

const handleBlur = (element, event) => {
  if (element.task.length !== 0) {
    element.edit = !element.edit
  }
}

const components = {
  draggable
}

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

onMounted(async () => {
  try {
    const { data } = await apiAuth.get('/users/me')
    // profile.value._id = data._id
    // profile.value.account = data.result.account
    // profile.value.email = data.result.email
    // profile.value.role = data.result.role
    // profile.value.name = data.result.name
    // profile.value.avatar = data.result.avatar
    // profile.value.finalGoal = data.result.finalGoal
    // profile.value.cookieNum = data.result.cookieNum
    // profile.value.accomplishment = data.result.accomplishment
    // profile.value.startDate = data.result.startDate
    // profile.value.friendsCode = data.result.friendsCode
    // profile.value.status = data.result.status
    // profile.value.uptime = data.result.uptime
    profile.value.todoList = data.result.todoList

    console.log('getProfile /me', data)
    console.log(profile.value.todoList)

    watch(profile.value.todoList, (newVal) => {
      console.log('newVal', newVal)
      apiAuth.patch(`/users/${user._id}`, { todoList: newVal })
    }, { deep: true })

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
  // return {user}
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

.button
  margin-top: 35px

.handle
  float: left
  padding-top: 8px
  padding-bottom: 8px

.close
  float: right
  padding-top: 8px
  padding-bottom: 8px
  padding-left: 8px

.text
  margin: 20px
  color: #403D3C

.btnStyle
  background: #BFAE9F
  color: white
  margin-left: 1rem

.grab
  cursor: grab

.color
  color: #403D3C

.bg:nth-child(odd)
  background: #F7F7F5

.flex-0
  flex: 0 0 auto !important
</style>