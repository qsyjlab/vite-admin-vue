import{a2 as u}from"./index.TqDZAx52.js";import{d as f,h as d,E as l,o as c,b as m,w as n,J as r,m as s,p as h}from"./framework.DHfpg7u7.js";import"./theme.BzT8vPt6.js";const g={style:{height:"700px"}},y=f({__name:"docx-preview",setup(v){const o=d(),p=e=>{if(e!=null&&e.target){const a=(e==null?void 0:e.target).files;if(a.length>=1){const t=a[0];o.value=new Blob([t],{type:t.type})}}};return(e,a)=>{const t=l("page-card"),i=l("page-wrapper");return c(),m(i,null,{default:n(()=>[r(t,{header:e.$route.meta.title},{default:n(()=>[s("input",{type:"file",onChange:p},null,32),s("div",g,[r(h(u),{file:o.value},null,8,["file"])])]),_:1},8,["header"])]),_:1})}}});export{y as default};
