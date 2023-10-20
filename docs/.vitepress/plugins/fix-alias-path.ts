import path from "path";
import { Plugin } from "vite";
import { projectRootPath } from "../utils/path";
import { statSync } from "fs";


const src = path.resolve(projectRootPath, 'src')
export  function fixAliasPath():Plugin {
  return {
    name: 'fix-alias-path',
    enforce: 'pre',
    resolveId(id) {
      // 在这里检查要转换的地址


      if(id.indexOf('docsearch')!==-1) return null
      if(['@vueuse/core', '@element-plus/icons-vue'].includes(id)) return null



      if (id.startsWith('@')) {
        // 如果地址匹配，返回新的地址
        console.log('id',id);


        const importPath = path.join(src,id.replace('@',''))
        const stat = statSync(importPath)

        if(stat.isDirectory()) {
          return path.resolve(importPath,'index.ts')
        }

        if (stat.isFile()) {
          return { id:importPath + '.ts' , external: true };
        }

        return { id:importPath , external: true };
      }
      // 如果地址不需要转换，返回 null
      return null;
    },
  };
}
