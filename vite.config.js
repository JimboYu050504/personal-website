import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/personal-website/',   // <-- GitHub Pages 路径（仓库名）
  build: { outDir: 'docs' }     // <-- 直接把打包结果放到 /docs
})
