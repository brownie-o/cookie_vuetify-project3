import axios from 'axios'
import { useUserStore } from '@/store/user'

const api = axios.create({
  baseURL: import.meta.env.VITE_API
})

const apiAuth = axios.create({
  baseURL: import.meta.env.VITE_API
})

// 所有要帶JWT的請求都用apiAuth呼叫
// 攔截器: 送出請求之前先攔截，加上使用者的token後才做請求
apiAuth.interceptors.request.use(config => {
  // config = 這次請求的設定
  const user = useUserStore()
  config.headers.Authorization = 'Bearer ' + user.token
  return config
})

// 1. apiAuth.get('/users/me')
// 2-1. 如果不是 JWT 過期錯誤，將 apiAuth.get('/users/me') 的錯誤回傳
// 2-2. 如果發生 JWT 過期錯誤，進入 3.
// 3. 傳送舊換新請求
// 3-1. 如果舊換新成功，修改 apiAuth.get('/users/me') 的 JWT 為新的後送出
// 3-2. 如果舊換新失敗，將 apiAuth.get('/users/me') 的錯誤回傳
// apiAuth.interceptors.response(成功時執行的function, 失敗時執行的function)
apiAuth.interceptors.response.use((res) => {
  return res
}, (error) => {
  if (error.response) {
    // 如果JWT過期 且請求來源不是舊換新
    if (error.response.data.message === 'JWT 過期' && error.config.url !== '/users/extend') {
      const user = useUserStore()
      // 傳送舊換新請求
      return apiAuth.patch('/users/extend')
        // { data } = 舊換新成功後回傳的success.on.message的 result
        .then(({ data }) => {
          // 更新 pinia的token 為新的result(token)
          user.token = data.result
          // 修改發生錯誤的原請求設定的JWT
          error.config.headers.Authorization = 'Bearer ' + user.token
          // 重新傳送原請求
          return axios(error.config)
        })
        .catch(() => {
          // 如果舊換新失敗就登出
          user.logout()
          // 回傳原錯誤到呼叫的地方
          return Promise.reject(error)
        })
    }
  }
  // 如果請求沒回應，或不是過期的錯誤，回傳原錯誤到呼叫的地方
  return Promise.reject(error)
})

export const useApi = () => {
  return { api, apiAuth }
}
