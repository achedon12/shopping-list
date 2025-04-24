import { defineConfig } from 'vite'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import tailwindcss from '@tailwindcss/vite'

// @ts-ignore
let dir = dirname(fileURLToPath(import.meta.url))

export default defineConfig({
    base: '/shopping-list/',
    build: {
        outDir: 'dist',
        rollupOptions: {
            input: {
                main: resolve(dir, 'index.html'),
                list: resolve(__dirname, 'list.html'),
            },
        }
    },
    plugins: [
        tailwindcss(),
    ],
})