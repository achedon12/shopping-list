import { defineConfig } from 'vite'
import { resolve } from 'node:path'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
    base: '/shopping-list/',
    build: {
        outDir: 'dist',
        rollupOptions: {
            input: {
                main: resolve(__dirname, 'index.html'),
                list: resolve(__dirname, 'list.html'),
            },
        }
    },
    plugins: [
        tailwindcss(),
    ],
})