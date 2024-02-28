// Utilities
import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import UserRole from '@/enums/UserRole'
import { useApi } from '@/composables/axios'

export const useUserStore = defineStore('user', () => {
  const { apiAuth } = useApi()

  // 存登入會回的資料(使用者資訊)
  const token = ref('')
  const account = ref('')
  const role = ref(UserRole.USER)
  const email = ref('')
  const name = ref('')
  const avatar = ref('')
  const finalGoal = ref('')
  const cookieNum = ref(0)
  const accomplishment = ref(0)
  const friendsCode = ref('')
  const status = ref('')
  const uptime = ref('')
  const todoList = ref([])
  const _id = ref('')
  const createdAt = ref('')
  const friendsList = ref([])

  // 把資料放入ref
  const login = (data) => {
    if(data.token){
      token.value = data.token
    }
    account.value = data.account
    role.value = data.role
    email.value = data.email
    name.value = data.name
    avatar.value = data.avatar
    finalGoal.value = data.finalGoal
    cookieNum.value = data.cookieNum
    accomplishment.value = data.accomplishment
    friendsCode.value = data.friendsCode
    status.value = data.status
    uptime.value = data.uptime
    todoList.value = data.todoList
    _id.value = data._id 
    createdAt.value = data.createdAt
    friendsList.value = data.friendsList
  }

  // 判斷有沒有登入
  const isLogin = computed(() => {
    return token.value.length > 0
  })

  // 判斷使否為管理員
  const isAdmin = computed(() => {
    return role.value === UserRole.ADMIN
  })

  const getProfile = async () => {
    // 如果沒登入就不執行
    if (token.value.length === 0) return

    try {
      const { data } = await apiAuth.get('/users/me')
      console.log('store getProfile', data.result) // 這裡會有值
      login(data.result)
    } catch (error) {
      console.log(error)
      logout()
    }
  }

  const logout = () => {
    token.value = ''
    account.value = ''
    role.value = UserRole.USER
    email.value = ''
    name.value = ''
    avatar.value = ''
    finalGoal.value = ''
    cookieNum.value = 0
    accomplishment.value = 0
    friendsCode.value = ''
    status.value = ''
    uptime.value = ''
    todoList.value = []
    _id.value = ''
    createdAt.value = ''
    friendsList.value = []
  }

  return {
    token,
    account,
    email,
    role,
    name,
    avatar,
    finalGoal,
    cookieNum,
    accomplishment,
    friendsCode,
    status,
    uptime,
    todoList,
    _id,
    createdAt,
    friendsList,
    login,
    logout,
    isLogin,
    isAdmin,
    getProfile
  }
}, {
  // 寫store的設定
  persist: {
    key: '20240124', // key for localstorage
    paths: ['token']
  }
})
