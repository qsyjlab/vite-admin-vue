import{o as i,F as n,p as s}from"./index.V9EroKAY.js";import{d as u,h as v,o as m,b as p,w as o,m as l,t as b,k as c,I as t}from"./framework.SCZo_iHs.js";import"../app.g2pGqmxW.js";import"./theme.Lm0SghTC.js";const k=u({__name:"tree",setup(L){const e=v([1,4]),d=[{id:1,label:"Level one 1",children:[{id:4,label:"Level two 1-1",children:[{id:9,label:"Level three 1-1-1"},{id:10,label:"Level three 1-1-2"}]}]},{id:2,label:"Level one 2",children:[{id:5,label:"Level two 2-1"},{id:6,label:"Level two 2-2"}]},{id:3,label:"Level one 3",children:[{id:7,label:"Level two 3-1"},{id:8,label:"Level two 3-2"}]}];return(f,a)=>(m(),p(l(s),null,{default:o(()=>[t(l(i),{header:"tree"},{default:o(()=>[c("pre",null,"        "+b(e.value)+`
      `,1),t(l(n),{modelValue:e.value,"onUpdate:modelValue":a[0]||(a[0]=r=>e.value=r),data:d},null,8,["modelValue"])]),_:1})]),_:1}))}});export{k as default};