import{z as o,a as i,n as m,b as e,W as n,K as t,a5 as s,k as a,a6 as r}from"./index.CXx_r3g5.js";import"./framework.CtQlGyLl.js";import"./theme.lKphzJcC.js";const f=o({__name:"modal",setup(p){return(l,u)=>(i(),m(t(r),null,{default:e(()=>[n(t(s),{header:l.$route.meta.title},{default:e(()=>[a(' <el-button type="primary" @click="show">显示</el-button> '),a(` <DialogTempalte>
        <template #footer>
          <el-button @click="dialogCommand.show()">显示dialog2</el-button>
          <el-button @click="close">关闭</el-button>
        </template>
      </DialogTempalte>

      <DialogTempalte2 append-to-body destroy-on-close fullscreen>
        <template #footer>
          <el-button @click="dialogCommand.close()">关闭</el-button>
        </template>
      </DialogTempalte2> `)]),_:1},8,["header"])]),_:1}))}});export{f as default};
