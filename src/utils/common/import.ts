/*
 * @Description: 公共工具
 * @Version: 1.0.0
 * @Autor: qsyj
 * @Date: 2022-03-14 16:03:11
 * @LastEditors: qsyj
 * @LastEditTime: 2022-03-14 16:33:35
 * @FilePath: \vite-admin-vue\src\utils\common\import.ts
 */

/**
 * 批量导入文件
 * @param path 路径
 * @returns
 */
export function viteImport(path: string) {
    console.log('asdasd', import.meta.globEager('./modules/*'))

    // return
}

// export function loadFiles(path: string) {
//     const files = viteImport(path)
//     const temp: Record<string, unknown> = {}
//     Object.keys(files).forEach(file => {
//         const key: string = file.split('/').pop()?.split('.ts')[0] + ''
//         if (!key) return
//         temp[key] = files[file].default
//     })

//     return temp
// }
