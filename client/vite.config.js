// import { defineConfig } from 'vite'
// import react from '@vitejs/plugin-react'

// // https://vite.dev/config/
// export default defineConfig({
//   plugins: [react()],
// })
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // Every /api/* request from the Vite dev server (port 5173)
      // is forwarded to the Express backend (port 5000).
      // This fixes:
      //   - "Could not load classes. Is the server running?"
      //   - "Failed to execute 'json' on 'Response': Unexpected end of JSON input"
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        secure: false,
      },
    },
  },
})