import{I as h,U as w,O as x,X as p}from"./index.TqDZAx52.js";import{$ as y,a0 as V,E as N}from"./theme.BzT8vPt6.js";import{d as b,ao as k,E as r,o as B,c as C,m as e,t as u,p as l,J as a,w as s,a as E}from"./framework.DHfpg7u7.js";const T={class:"login-container"},U={class:"login-layout-body"},j={class:"login-exhibit"},D={class:"header-title"},I={class:"header-desc"},S={class:"form-content"},q={class:"form-content-wrapper"},z={class:"form-title"},O=b({__name:"login",setup(R){const{loginSystem:f}=w(),o=k({username:"admin",password:"123456"}),n=x(),_=()=>{f(o).then(()=>{const c=n.currentRoute.value.query.redirect;N.success("登录成功"),c?n.replace(c):n.replace({name:"Welcome"})})};return(c,t)=>{const m=r("el-input"),d=r("el-form-item"),v=r("el-button"),g=r("el-form");return B(),C("div",T,[e("div",U,[e("div",j,[e("div",D,u(l(p).projectTitle),1),e("div",I,u(l(p).projectDesc),1)]),e("div",S,[e("div",q,[e("div",z,"登录 "+u(l(p).projectTitle),1),a(g,{model:o,size:"large"},{default:s(()=>[a(d,null,{default:s(()=>[a(m,{modelValue:o.username,"onUpdate:modelValue":t[0]||(t[0]=i=>o.username=i),"prefix-icon":l(y),placeholder:"请输入用户名"},null,8,["modelValue","prefix-icon"])]),_:1}),a(d,null,{default:s(()=>[a(m,{modelValue:o.password,"onUpdate:modelValue":t[1]||(t[1]=i=>o.password=i),"prefix-icon":l(V),"show-password":"",type:"password",placeholder:"请输入密码"},null,8,["modelValue","prefix-icon"])]),_:1}),a(d,null,{default:s(()=>[a(v,{style:{width:"100%","margin-top":"15px"},type:"primary",onClick:_},{default:s(()=>[E("登录")]),_:1})]),_:1})]),_:1},8,["model"])])])])])}}}),G=h(O,[["__scopeId","data-v-912c9515"]]);export{G as default};
