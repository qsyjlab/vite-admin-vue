import{o as f,q as k,p as v}from"./index.V9EroKAY.js";import{E as n}from"../app.g2pGqmxW.js";import{d as w,h as i,o as h,b as C,w as o,m as a,a as E,I as u}from"./framework.SCZo_iHs.js";import"./theme.Lm0SghTC.js";const Q=w({__name:"editable-pro-table",setup(b){const l=i([{id:new Date().getTime()}]),s=i([]),d=[{title:"活动名称",key:"name",tip:"tip",rowComponent:{el:"ElInput",rules:[{required:!0,validator:(e,t,r)=>{if(!e)return r(new Error("错误提示有没有"));r()},message:"名称必填"}]}},{title:"状态",key:"status",rowComponent:{el:"ElInput",rules:[{required:!0,message:"状态"}]}},{title:"邮箱",key:"email",rowComponent:{el:"ElInput",rules:[{required:!0,message:"邮箱"}]}},{title:"年份",key:"year",rowComponent:{el:"ElInput",rules:[{required:!0,message:"年份"}]}},{title:"进度条",key:"progress",editable:!0,valueType:()=>({type:"progress"}),rowComponent:{el:"ElInput",rules:[{required:!0,message:"进度条"}]}},{title:"活动时间",key:"time",editable:!0,rowComponent:{el:"el-date-picker",rules:[{required:!0,message:"活动时间"}]}},{title:"操作",key:"operation"}],m=e=>{l.value=e};function p(e,t){t()}function c(e){var t;if(!e)return;const r=Object.values(e),y=((t=r==null?void 0:r[0])==null?void 0:t[0])??"表单项填写不符合规则";n.error(y)}const g=({message:e})=>{n.error(e)};return(e,t)=>(h(),C(a(v),null,{default:o(()=>[u(a(f),{header:e.$route.meta.title},{default:o(()=>[u(a(k),{"selected-keys":s.value,"onUpdate:selectedKeys":t[0]||(t[0]=r=>s.value=r),checkable:"",style:{height:"100%"},columns:d,mode:"multiple",data:l.value,"on-delete":p,"on-error":c,onChange:m,onAppendError:g},{name:o(()=>[E("cc")]),_:1},8,["selected-keys","data"])]),_:1},8,["header"])]),_:1}))}});export{Q as default};