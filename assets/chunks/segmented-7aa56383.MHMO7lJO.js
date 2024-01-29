import{p as C,l as b,n as M,r as T}from"./index.mdm6ka2m.js";import{d as S,h as V,D as R,o as g,b as F,w as v,I as s,m as o,k as r,a as c,j as N,af as $,y as j,P as h,c as z,F as q,E as D,n as x,t as E}from"./framework.kGBdJdCt.js";import"../app.4OzQX80d.js";import"./theme.IDZC-AZR.js";const I={class:"segmented-group"},L=["onClick"],O=S({__name:"segmented",props:{modelValue:{},options:{},block:{type:Boolean},size:{},disabled:{type:Boolean},autoSize:{type:Boolean,default:!0}},emits:["update:model-value","change"],setup(_,{expose:t,emit:n}){const y=n,e=_,i=V(),l=V(),k=V();let p=null,w=0;N(()=>{l.value&&"ResizeObserver"in window&&e.autoSize&&(p=new ResizeObserver(a=>{for(const u of a)u.contentRect.width!==w&&f()}),p==null||p.observe(l.value))}),$(()=>{p==null||p.disconnect()}),j(()=>e.modelValue,(a,u)=>{a!==u&&(i.value=e.modelValue,h(()=>{f()}))},{immediate:!0});const U=a=>{e.disabled||a.disabled||(i.value=a.value,f(),B())};function f(){h(()=>{var a;if(!l.value)return;const u=l.value.querySelector(".is-selected"),d=(a=o(k))==null?void 0:a.style;k.value&&u&&d&&(d.left=`${u.offsetLeft}px`,d.width=`${u.clientWidth}px`)})}function B(){y("update:model-value",i.value),y("change",i.value)}return t({update:f}),(a,u)=>(g(),z("div",{ref_key:"segmentedRef",ref:l,class:x(["segmented",a.block?"is-block":"",a.size&&a.size!=="default"?`segmented--${a.size}`:"",a.disabled?"is-disabled":""])},[r("div",I,[(g(!0),z(q,null,D(a.options,d=>(g(),z("div",{key:d.value,class:x(["segmented-item",i.value===d.value?"is-selected":"",a.disabled||d.disabled?"is-disabled":""]),onClick:K=>U(d)},E(d.label),11,L))),128)),r("div",{ref_key:"overlayRef",ref:k,class:"segmented-overlay"},null,512)])],2))}}),P=T(O,[["__scopeId","data-v-9579bf7a"]]),m=C(P),Z={style:{"margin-bottom":"20px"}},A={style:{"margin-bottom":"20px"}},G={style:{"margin-bottom":"20px"}},H={style:{"margin-bottom":"20px"}},J={style:{"margin-bottom":"20px"}},ee=S({name:"Segmented",__name:"segmented",setup(_){const t=V("Map"),n=[{label:"Map",value:"Map"},{label:"Transit",value:"Transit"},{label:"Satellite",value:"Satellite"}];return(y,e)=>{const i=R("el-space");return g(),F(o(M),null,{default:v(()=>[s(i,{style:{width:"100%"},direction:"vertical",fill:""},{default:v(()=>[s(o(b),{header:"分段器"},{default:v(()=>[s(o(m),{modelValue:t.value,"onUpdate:modelValue":e[0]||(e[0]=l=>t.value=l),block:"",options:n},null,8,["modelValue"])]),_:1}),s(o(b),{header:"分段器 充满元素"},{default:v(()=>[s(o(m),{modelValue:t.value,"onUpdate:modelValue":e[1]||(e[1]=l=>t.value=l),options:n},null,8,["modelValue"])]),_:1}),s(o(b),{header:"分段器 size"},{default:v(()=>[r("div",Z,[c(" 默认大小 "),s(o(m),{modelValue:t.value,"onUpdate:modelValue":e[2]||(e[2]=l=>t.value=l),options:n},null,8,["modelValue"])]),r("div",A,[c(" 大 "),s(o(m),{modelValue:t.value,"onUpdate:modelValue":e[3]||(e[3]=l=>t.value=l),size:"large",options:n},null,8,["modelValue"])]),r("div",G,[c(" 小 "),s(o(m),{modelValue:t.value,"onUpdate:modelValue":e[4]||(e[4]=l=>t.value=l),size:"small",options:n},null,8,["modelValue"])])]),_:1}),s(o(b),{header:"禁用分段器 size"},{default:v(()=>[r("div",H,[c(" 部分禁用 "),s(o(m),{modelValue:t.value,"onUpdate:modelValue":e[5]||(e[5]=l=>t.value=l),options:[{label:"Map",value:"Map"},{label:"Transit",value:"Transit"},{label:"Satellite",value:"Satellite"}]},null,8,["modelValue"])]),r("div",J,[c(" 禁用全部 "),s(o(m),{modelValue:t.value,"onUpdate:modelValue":e[6]||(e[6]=l=>t.value=l),size:"large",options:n,disabled:""},null,8,["modelValue"])])]),_:1})]),_:1})]),_:1})}}});export{ee as default};
