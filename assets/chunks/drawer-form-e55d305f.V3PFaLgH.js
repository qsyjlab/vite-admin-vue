import{d as f,h as y,D as a,o as k,b,w as e,t as _,a as o,I as l,k as w}from"./framework.SCZo_iHs.js";const h=f({__name:"drawer-form",setup(V){const r=y(!1),s=[{label:"签约客户名称",el:"el-input",key:"name",col:{span:12}},{label:"我方公司名称",el:"el-input",key:"selfCompany",col:{span:12}},{label:"合同名称",el:"el-input",key:"ht",col:{span:12}},{label:"合同生效时间",el:"el-date-picker",key:"startTime",attrs:{type:"daterange"},col:{span:12}},{label:"合同约定生效方式",el:"pro-select",key:"way",fill:!0,col:{span:24}},{label:"合同约定失效效方式",el:"pro-select",key:"missWay",fill:!0,col:{span:24}},{label:"项目名称",el:"el-input",key:"projectName"},{label:"商务经理",el:"el-input",key:"bName"}];return(d,t)=>{const n=a("el-button"),u=a("pro-form"),i=a("el-drawer"),c=a("page-card"),m=a("page-wrapper");return k(),b(m,null,{default:e(()=>[l(c,null,{header:e(()=>[o(_(d.$route.meta.title),1)]),default:e(()=>[l(n,{type:"primary",onClick:t[0]||(t[0]=p=>r.value=!0)},{default:e(()=>[o("打开抽屉")]),_:1}),l(i,{modelValue:r.value,"onUpdate:modelValue":t[1]||(t[1]=p=>r.value=p),direction:"rtl",size:"50%"},{footer:e(()=>[w("div",null,[l(n,null,{default:e(()=>[o("取消")]),_:1}),l(n,{type:"primary"},{default:e(()=>[o("确定")]),_:1})])]),default:e(()=>[l(u,{"label-width":150,fields:s})]),_:1},8,["modelValue"])]),_:1})]),_:1})}}});export{h as default};