import{s as m,G as x,I as k}from"./index.mdm6ka2m.js";import{d as _,D as e,o as b,b as g,w as t,I as a,m as h,k as v,a as w}from"./framework.kGBdJdCt.js";import"../app.4OzQX80d.js";import"./theme.IDZC-AZR.js";const C={style:{display:"flex","justify-content":"center"}},R=_({__name:"encrypt",setup(N){const s=[{label:"文本",key:"text",el:"el-input",attrs:{type:"textarea"}},{label:"加密后文本",key:"encrypt",el:"el-input",attrs:{type:"textarea"}},{label:"加密后解密文本",key:"decrypt",el:"el-input",attrs:{type:"textarea"}}],{register:o,forceUpdateModel:n,validate:p}=m(),d=()=>{p(r=>{const l=x(r.text);n({encrypt:l,decrypt:k(l)})})};return(r,l)=>{const c=e("pro-form"),i=e("el-button"),u=e("el-space"),f=e("page-card"),y=e("page-wrapper");return b(),g(y,null,{default:t(()=>[a(f,{header:r.$route.meta.title},{default:t(()=>[a(c,{fields:s,"label-width":120,onRegister:h(o)},null,8,["onRegister"]),v("div",C,[a(u,null,{default:t(()=>[a(i,{onClick:d},{default:t(()=>[w("加密并解密")]),_:1})]),_:1})])]),_:1},8,["header"])]),_:1})}}});export{R as default};
