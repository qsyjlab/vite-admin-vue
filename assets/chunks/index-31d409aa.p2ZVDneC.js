import{d as D,al as R,X as T,h as w,g as O,P as X,D as C,o as i,c as v,b as x,I as g,w as h,M as N,O as B,F as S,E,e as b,m as p,ar as Y,Y as F,r as W,N as j,t as H,k,$ as V}from"./framework.SCZo_iHs.js";import{u as A,n as I,l as G,s as M}from"./index.V9EroKAY.js";function J(d){const t={x:d.clientX,y:d.clientY},s=d.changedTouches;return s&&(t.x=s[0].clientX,t.y=s[0].clientY),(!t.x||t.x<0)&&(t.x=0),(!t.y||t.y<0)&&(t.y=0),t}function L(d,t,s){if(d){const{innerWidth:u,innerHeight:o}=window,{offsetWidth:m,offsetHeight:e}=d;t+m>u&&(t-=t+m-u),s+e>o&&(s-=s+e-o)}return{x:t,y:s}}const P=Symbol(),U={key:0,class:"icon"},Z={class:"ellipsis"},q={key:0,class:"icon"},K={class:"ellipsis"},ee={key:0,class:"icon"},ne=["onMousedown"],le={class:"ellipsis"},te=D({__name:"menu-item",props:{menu:{}},setup(d){const{onClick:t,itemHeight:s,fontSize:u}=j(P)||{},o=e=>{var a;return!!((a=e.children)!=null&&a.length)},m=(e,a)=>{var y;a.disabled||((y=a.onClick)==null||y.call(a),t==null||t(e,a))};return(e,a)=>{const y=C("el-menu-item"),$=C("menu-item",!0),_=C("el-sub-menu");return o(e.menu)?(i(),x(_,{key:1,index:e.menu.command},{title:h(()=>{var n,r,l;return[(n=e.menu)!=null&&n.icon?(i(),v("div",q,[g(p(M),{size:p(u),icon:(r=e.menu)==null?void 0:r.icon},null,8,["size","icon"])])):b("v-if",!0),k("span",K,H((l=e.menu)==null?void 0:l.title),1)]}),default:h(()=>[(i(!0),v(S,null,E(e.menu.children,n=>{var r;return i(),v(S,{key:n.command},[(r=n.children)!=null&&r.length?(i(),x($,{key:1,menu:n},null,8,["menu"])):(i(),x(y,{key:0,style:B({"--el-menu-item-height":`${p(s)}px`}),disabled:e.menu.disabled,index:n.command},{default:h(()=>[n!=null&&n.icon?(i(),v("div",ee,[g(p(M),{size:p(u),icon:n==null?void 0:n.icon},null,8,["size","icon"])])):b("v-if",!0),k("div",{onMousedown:V(l=>m(n.command,n),["stop"])},[k("span",le,H(n==null?void 0:n.title),1)],40,ne)]),_:2},1032,["style","disabled","index"]))],64)}),128))]),_:1},8,["index"])):(i(),x(y,{key:0,style:B({"--el-menu-item-height":`${p(s)}px`}),disabled:e.menu.disabled,index:e.menu.command},{default:h(()=>{var n,r,l;return[k("div",{class:"menu-item",onMousedown:a[0]||(a[0]=V(f=>m(e.menu.command,e.menu),["stop"]))},[(n=e.menu)!=null&&n.icon?(i(),v("div",U,[g(p(M),{size:p(u),icon:(r=e.menu)==null?void 0:r.icon},null,8,["size","icon"])])):b("v-if",!0),k("span",Z,H((l=e.menu)==null?void 0:l.title),1)],32)]}),_:1},8,["style","disabled","index"]))}}}),ie=I(te,[["__scopeId","data-v-9481e936"]]),se=D({name:"ProContextMenu",inheritAttrs:!1,__name:"context-menu",props:{menus:{default:()=>[]},closeOnClick:{type:Boolean,default:!0},trigger:{default:()=>["contextmenu"]},itemHeight:{default:40},fontSize:{default:14}},emits:["click-menu"],setup(d,{expose:t,emit:s}){const u=d,o=R({x:0,y:0,visible:!1});T(P,{onClick:r,itemHeight:u.itemHeight,fontSize:u.fontSize});const m=w(),e=w(),a=w(),y=O(()=>({left:`${o.x}px`,top:`${o.y}px`})),$=O(()=>{const l={};return u.trigger.forEach(f=>{l[f]=c=>{c.preventDefault(),_(c)}}),l});function _(l){o.visible=!0,X(()=>{var f;(f=m.value)==null||f.focus();const c=J(l);if(m.value){const{x:z,y:Q}=L(m.value,c.x,c.y);c.x=z,c.y=Q}o.x=c.x,o.y=c.y})}const n=()=>{o.visible=!1};function r(l,f){s("click-menu",l,f),f.closeOnClick!==!1&&u.closeOnClick&&(o.visible=!1)}return t({show:_}),(l,f)=>{const c=C("el-menu");return i(),v(S,null,[(i(),x(Y,{to:"body"},[g(p(G),null,{default:h(()=>[o.visible?(i(),v("div",N({key:0},l.$attrs,{ref_key:"contextMenuRef",ref:m,class:"context-menu",style:y.value,tabindex:-1,onBlur:n}),[g(c,{ref_key:"menuRef",ref:a,collapse:!0,"collapse-transition":!1,router:!1,"close-on-click-outside":!0,teleported:!1,style:B({"--el-menu-item-height":`${l.itemHeight}px`,"--el-menu-item-font-size":`${l.fontSize}px`})},{default:h(()=>[(i(!0),v(S,null,E(l.menus,z=>(i(),x(ie,{key:z.name,menu:z},null,8,["menu"]))),128))]),_:1},8,["style"])],16)):b("v-if",!0)]),_:1})])),l.$slots.default?(i(),v("span",N({key:0,ref_key:"triggerRef",ref:e,class:"context-menu-trigger"},F($.value,!0)),[W(l.$slots,"default",{},void 0,!0)],16)):b("v-if",!0)],64)}}}),oe=I(se,[["__scopeId","data-v-91168cd9"]]),ce=A(oe);export{ce as c};