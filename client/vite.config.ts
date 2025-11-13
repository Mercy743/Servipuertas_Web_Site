import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'fs'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  server: {
    // Habilitar HTTPS para el servidor de desarrollo de Vite
    https: {
      key: fs.readFileSync(path.resolve(__dirname, '../ssl/localhost-key.pem')),
      cert: fs.readFileSync(path.resolve(__dirname, '../ssl/localhost.pem'))
    },
    port: 5173,
    host: true,
    proxy: {
      '/api': {
        target: 'https://localhost:3443',  // Cambiado a HTTPS
        changeOrigin: true,
        secure: false  // Importante: false porque son certificados autofirmados
      }
    }
  }
})