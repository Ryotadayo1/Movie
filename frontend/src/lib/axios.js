// frontend/src/lib/axios.js

import axios from 'axios'

const instance = axios.create({
  baseURL: 'http://localhost:8000',   // LaravelサーバーURL
  withCredentials: true,              // Cookie送信を有効にする
  headers: {
    'X-Requested-With': 'XMLHttpRequest',
  },
})

export default instance
