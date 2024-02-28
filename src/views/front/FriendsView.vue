<template lang="pug">
VForm
  VContainer.mt-5
    VRow.align-center
      VCol(cols="11")
        VTextField(label="搜尋好友" clearable prepend-inner-icon="mdi-account-star" hide-details variant="outlined"
        v-model="searchCode")
      VCol.px-0(cols="1")
        VBtn(icon="mdi-magnify" variant="text" @click="findFriend" type="submit")
VDialog(v-model="dialog" max-width="400" )
  VCard
    VContainer
      VRow
        VCol.align-self-center(cols="6")
          VImg.mx-auto(:src="friend.avatar" width="100")
        VCol.align-self-center(cols="6")
          VCardTitle
            h2 {{ friend.name }}
          VCardSubtitle
            span {{ friend.email }}
  VRow
    VCol(cols="12")
    VBtn.delStyle.ms-auto(@click="closeDialog") Cancel
    VBtn.btnStyle(prepend-icon="mdi-plus" @click="addFriend(friend.friendsCode, user._id)" v-if="searchCode !== user.friendsCode" ) Add Friend
    VBtn.btnStyle(prepend-icon="mdi-account-circle" to="/profile" v-if="searchCode === user.friendsCode") Profile
//- 大版
.swiper.mySwiper(v-if="!isMobile")
  .swiper-wrapper
    .swiper-slide(v-for="friend in friendsList" :key="friend._id")
      VCard.bg.w-100.box-shadow-0
        VImg.mx-auto.mt-5.mb-2(:src="friend.avatar" width="100")
        VCardTitle
          h2 {{ friend.name }}
        VCardSubtitle
          span {{ friend.email }}
        VCardText
          span {{ friend.status }}
        VCardText
          VBtn(@click="pokeFriend(friend.friendsId)" v-if="friend.poked===true") Poked
          VBtn(@click="pokeFriend(friend.friendsId)" v-else) Poke
  .swiper-button-next
  .swiper-button-prev
  .swiper-pagination

//- 小板
.swiper.mySwiper2(v-if="isMobile" style="width: 80%")
  .swiper-wrapper
    .swiper-slide.swiperCard(v-for="friend in friendsList" :key="friend._id")
      VCard.bg.w-100.box-shadow-0
        VImg.mx-auto.mt-5.mb-2(:src="friend.avatar" width="100")
        VCardTitle
          h2 {{ friend.name }}
        VCardSubtitle
          span {{ friend.email }}
        VCardText
          span {{ friend.status }}
        VCardText
          VBtn(@click="pokeFriend(friend.friendsId)" v-if="friend.poked===true") Poked
          VBtn(@click="pokeFriend(friend.friendsId)" v-else) Poke
  .swiper-pagination

</template>

<script setup>
import { onMounted, ref, computed, nextTick } from 'vue'
import { useDisplay } from 'vuetify'
import Swiper from 'swiper/bundle'
import 'swiper/css/bundle'
import { useUserStore } from '@/store/user'
import { useApi } from '@/composables/axios'
import { useSnackbar } from 'vuetify-use-dialog'
import { useRouter } from 'vue-router'

const user = useUserStore()
const createSnackbar = useSnackbar()
const router = useRouter()
const { apiAuth } = useApi()

const searchCode = ref('')

const { xs } = useDisplay()
const { md } = useDisplay()
const { lg } = useDisplay()
const isMobile = computed(() => xs.value)
const isMd = computed(() => md.value)
const isLarge = computed(() => lg.value)

// const friendsList = computed(() => [])
const friendsList = ref([])
const friend = ref({
  friendsCode: '',
  avatar: '',
  name: '',
  email: '',
  status: '',
})
const dialog = ref(false)

const snackbarLocation = () => {
  if (xs.value) return 'center'
  else if (!xs.value) return 'bottom'
}

const openDialog = () => {
  dialog.value = true
}

const closeDialog = () => {
  dialog.value = false
  router.go(0) // 重新載入當前路由
}

if(friendsList.value.poked) {
  const resetPokedAtMidnight = () => {
    const now = new Date()
    const nextMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1)
    const timeToMidnight = nextMidnight - now
    setTimeout(() => {
      friendsList.value.poked = false
    }, timeToMidnight)
  }
  resetPokedAtMidnight()
}

const findFriend = async () => {
  try {
    const response = await apiAuth.get('/users/friends', { params: {search: searchCode.value} } )
    friend.value.friendsCode = response.data.result[0].friendsCode
    friend.value.avatar = response.data.result[0].avatar
    friend.value.name = response.data.result[0].name
    friend.value.email = response.data.result[0].email
    friend.value.status = response.data.result[0].status

    if(response.data.result[0].friendsCode.length > 0){
      openDialog()
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
}

const addFriend = async (friendsCode, userId) => {
  try {
    const data = await apiAuth.patch('/users/friends', { friendsId: friendsCode, poked: false, userId })
    user.friendsList = data.result
    console.log('addFriend', user.friendsList)
    createSnackbar({
      text: '已成為好友',
      showCloseButton: false,
      snackbarProps: {
        timeout: 2000,
        color: 'green',
        location: snackbarLocation(),
        rounded: 'pill',
        variant: 'tonal'
      }
    })
    closeDialog()
  } catch (error) {
    console.log('addFriend', error)
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
    const results = await Promise.all(
      user.friendsList.map(friend =>
        apiAuth.get('/users/friends', { params: { search: friend.friendsId } })
      )
    )
    console.log('onMounted results', results)

    friendsList.value = results.map(({ data }) => data.result[0])
    console.log('onMounted friendsList', friendsList.value)
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

// swiper
onMounted(() => {
  // await nextTick()
  const swiper = new Swiper('.mySwiper', {
    effect: 'coverflow',
    grabCursor: true,
    centeredSlides: true,
    loop: true,
    coverflowEffect: {
      rotate: 50,
      stretch: 0,
      depth: 100,
      modifier: 1,
      slideShadows: true,
    },
    pagination: {
      el: '.swiper-pagination',
      clickable: true,
    },
    navigation: {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev",
    },
    breakpoints: {
      600: {
        slidesPerView: 2,
        spaceBetween: 20,
      },
      800: {
        slidesPerView: 3,
        spaceBetween: 10,
      },
      1020: {
        slidesPerView: 3,
        spaceBetween: 20,
      },
      1920: {
        slidesPerView: 5,
        spaceBetween: 40,
      },
    },
  })
  const swiper2 = new Swiper('.mySwiper2', {
    effect: "cards",
    grabCursor: true,
    loop: true,
  })
})
</script>

<style lang="sass" scoped>

.swiper
  width: 100%
  padding-top: 50px
  padding-bottom: 50px

.swiper-slide
  text-align: center
  background: #fff
  display: flex
  justify-content: center
  align-items: center
  background-position: center
  background-size: cover
  width: 400px
  height: 600px

  img
    display: block
    width: 100%
    height: 100%
    object-fit: cover
</style>

<style lang="sass" scoped>
.btnStyle
  background: #BFAE9F
  color: white
  margin-right: 1rem

.delStyle
  background: #D9D9D9
  color: white
  margin-right: 1rem

.box-shadow-0
  box-shadow: none !important

.swiper-slide
  background-color: #F2E8DC
  border-radius: 1rem

.bg
  background-color: #F2E8DC 

</style>