import{o as a,p as m}from"./index.V9EroKAY.js";import{d as n,o as r,b as i,w as e,m as t,e as o,I as p}from"./framework.SCZo_iHs.js";import"../app.g2pGqmxW.js";import"./theme.Lm0SghTC.js";const g=n({__name:"modal",setup(d){return(l,s)=>(r(),i(t(m),null,{default:e(()=>[p(t(a),{header:l.$route.meta.title},{default:e(()=>[o(' <el-button type="primary" @click="show">显示</el-button> '),o(` <DialogTempalte>
        <template #footer>
          <el-button @click="dialogCommand.show()">显示dialog2</el-button>
          <el-button @click="close">关闭</el-button>
        </template>
      </DialogTempalte>

      <DialogTempalte2 append-to-body destroy-on-close fullscreen>
        <template #footer>
          <el-button @click="dialogCommand.close()">关闭</el-button>
        </template>
      </DialogTempalte2> `)]),_:1},8,["header"])]),_:1}))}});export{g as default};
