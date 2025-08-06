import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
   // 关键配置，确保与部署路径一致
  plugins: [react()],
  resolve:{
    alias:{
      '@':'/src'
    }
  }
})
