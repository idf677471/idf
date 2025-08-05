import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Set base to the name of your GitHub repository
export default defineConfig({
  base: '/idf/',
  plugins: [react()],
})
