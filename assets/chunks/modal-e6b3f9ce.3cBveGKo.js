import{l as a,n as m}from"./index.mdm6ka2m.js";import{d as n,o as r,b as i,w as e,I as p,m as t,e as o}from"./framework.kGBdJdCt.js";import"../app.4OzQX80d.js";import"./theme.IDZC-AZR.js";const g=n({__name:"modal",setup(c){return(l,d)=>(r(),i(t(m),null,{default:e(()=>[p(t(a),{header:l.$route.meta.title},{default:e(()=>[o(' <el-button type="primary" @click="show">显示</el-button> '),o(` <DialogTempalte>
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
