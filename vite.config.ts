import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react-swc'
import * as url from 'url'
import path from 'path'

const dirName = url.fileURLToPath(new URL('.', import.meta.url))

export default defineConfig(({ mode }) => {
  // Ambil env dari Vite (termasuk dari Vercel jika diset di dashboard)
  const env = loadEnv(mode, process.cwd(), '')

  return {
    plugins: [react()],
    resolve: {
      alias: {
        Assets: path.resolve(dirName, 'src/assets'),
        Components: path.resolve(dirName, 'src/components'),
        Consts: path.resolve(dirName, 'src/consts'),
        Services: path.resolve(dirName, 'src/services'),
        Hooks: path.resolve(dirName, 'src/hooks'),
      },
    },
    define: {
      'process.env.VITE_FIREBASE_API_KEY': JSON.stringify(env.VITE_FIREBASE_API_KEY),
      'process.env.VITE_FIREBASE_AUTH_DOMAIN': JSON.stringify(env.VITE_FIREBASE_AUTH_DOMAIN),
      'process.env.VITE_FIREBASE_PROJECT_ID': JSON.stringify(env.VITE_FIREBASE_PROJECT_ID),
      'process.env.VITE_FIREBASE_STORAGE_BUCKET': JSON.stringify(env.VITE_FIREBASE_STORAGE_BUCKET),
      'process.env.VITE_FIREBASE_MESSAGING_SENDER_ID': JSON.stringify(env.VITE_FIREBASE_MESSAGING_SENDER_ID),
      'process.env.VITE_FIREBASE_APP_ID': JSON.stringify(env.VITE_FIREBASE_APP_ID),
    },
  }
})
