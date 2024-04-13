import{d as a,T as m}from"./index.CC100n1M.js";import{d as n,o as r,b as d,w as e,J as p,p as t,e as o}from"./framework.D6RCW7MT.js";import"./theme.Dz7g7Wkx.js";const b=n({__name:"modal",setup(i){return(l,s)=>(r(),d(t(m),null,{default:e(()=>[p(t(a),{header:l.$route.meta.title},{default:e(()=>[o(' <el-button type="primary" @click="show">显示</el-button> '),o(` <DialogTempalte>
        <template #footer>
          <el-button @click="dialogCommand.show()">显示dialog2</el-button>
          <el-button @click="close">关闭</el-button>
        </template>
      </DialogTempalte>

      <DialogTempalte2 append-to-body destroy-on-close fullscreen>
        <template #footer>
          <el-button @click="dialogCommand.close()">关闭</el-button>
        </template>
      </DialogTempalte2> `)]),_:1},8,["header"])]),_:1}))}});export{b as default};
