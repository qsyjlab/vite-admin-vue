/*
 * @Description: vite.config
 * @Version: 1.0.0
 * @Autor: qsyj
 * @Date: 2022-03-10 17:34:00
 * @LastEditors: qsyj
 * @LastEditTime: 2022-03-10 22:50:47
 * @FilePath: \vite-admin-vue\vite.config.ts
 */
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

import { fileURLToPath } from "url";

// https://vitejs.dev/config/
export default defineConfig(() => {
  return {
    plugins: [vue()],
    base: "./",
    publicDir: "dist",
    resolve: {
      alias: {
        "@": fileURLToPath(new URL("./src", import.meta.url)),
        "@router": fileURLToPath(new URL("./src/router", import.meta.url)),
        "@views": fileURLToPath(new URL("./src/views", import.meta.url)),
        "@api": fileURLToPath(new URL("./src/api", import.meta.url)),
        "@store": fileURLToPath(new URL("./src/store", import.meta.url)),
        "~": fileURLToPath(new URL("./", import.meta.url)),
      },
    },
  };
});
