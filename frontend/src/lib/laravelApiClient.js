import axios from 'axios'

const laravelApiClient = axios.create({
  baseURL: 'http://localhost:8000', // Laravel の API サーバーURL
  withCredentials: true, // Laravel Sanctum を使用している場合に必要
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
})

export default laravelApiClient
