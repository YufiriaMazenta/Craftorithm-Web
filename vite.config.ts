import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: './',
  build: {
    // 贴图与图标保持独立文件：内联成 base64 会让 JS 体积无谓膨胀，
    // 且浏览器无法单独缓存这些几乎不变的像素资源。
    assetsInlineLimit: 0,
  },
});
