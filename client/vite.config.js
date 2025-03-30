import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'


export default defineConfig({
  server:{
    proxy:{
      '/api':{
        target:'https://trendyhomeshrs.onrender.com/',
        // target:'http://localhost:3000',
        secure: false,
      }
    }
  },
  plugins: [react()],
})
