import{o as i,p as m}from"./index.V9EroKAY.js";import{d as b,h as p,D as r,o as L,b as f,w as o,m as n,e as w,I as l,t as C,a as x}from"./framework.SCZo_iHs.js";import"../app.g2pGqmxW.js";import"./theme.Lm0SghTC.js";const y=b({__name:"tree-select",setup(V){const e=p(),v=()=>{},d=(...a)=>{console.log("rest nodeClick",a)},u=[{value:"1",label:"Level one 1",children:[{value:"1-1",label:"Level two 1-1",children:[{value:"1-1-1",label:"Level three 1-1-1"}]}]},{value:"2",label:"Level one 2",children:[{value:"2-1",label:"Level two 2-1",children:[{value:"2-1-1",label:"Level three 2-1-1"}]},{value:"2-2",label:"Level two 2-2",children:[{value:"2-2-1",label:"Level three 2-2-1"}]}]},{value:"3",label:"Level one 3",children:[{value:"3-1",label:"Level two 3-1",children:[{value:"3-1-1",label:"Level three 3-1-1"}]},{value:"3-2",label:"Level two 3-2",children:[{value:"3-2-1",label:"Level three 3-2-1"}]}]}];return(a,t)=>{const c=r("el-divider"),s=r("el-tree-select");return L(),f(n(m),null,{default:o(()=>[l(n(i),{full:"",header:"Tree Select"},{default:o(()=>[w(' <el-tree-select v-model="value" :data="data" :render-after-expand="false" /> '),l(c),x(" show checkbox: "+C(e.value)+" ",1),l(s,{modelValue:e.value,"onUpdate:modelValue":t[0]||(t[0]=h=>e.value=h),data:u,"check-strictly":"","render-after-expand":!1,onCurrentChange:d,onChange:v},null,8,["modelValue"])]),_:1})]),_:1})}}});export{y as default};