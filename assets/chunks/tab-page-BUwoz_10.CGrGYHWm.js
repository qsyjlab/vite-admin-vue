import{f as u}from"./index.B_-AZqtN.js";import{i as c}from"./use-tabs-DAZ2nkoc.D1q-lzi0.js";import{d as y,h as _,E as r,o as b,b as g,w as a,J as t,p as n,a as m}from"./framework.D1sHVKzl.js";import"./theme.af-yJUCQ.js";import"./tab-page-DyPMOpJn.Ds7hZXIg.js";const w=y({__name:"tab-page",setup(h){const{setTitle:s}=c(),l=_("");return(d,e)=>{const i=r("el-input"),p=r("el-button"),f=r("page-wrapper");return b(),g(f,null,{default:a(()=>[t(n(u),{header:"tab 栏",full:!1,style:{"margin-bottom":"20px"}},{default:a(()=>[t(i,{modelValue:l.value,"onUpdate:modelValue":e[0]||(e[0]=o=>l.value=o)},null,8,["modelValue"]),t(p,{type:"primary",onClick:e[1]||(e[1]=o=>n(s)(l.value))},{default:a(()=>e[3]||(e[3]=[m("设置标题")])),_:1})]),_:1}),t(n(u),{header:"打开新的标签页",full:!1},{default:a(()=>[t(p,{type:"primary",onClick:e[2]||(e[2]=o=>d.$router.push({name:"TabPageDetail",params:{id:new Date().getTime()}}))},{default:a(()=>e[4]||(e[4]=[m("打开新标签")])),_:1})]),_:1})]),_:1})}}});export{w as default};
