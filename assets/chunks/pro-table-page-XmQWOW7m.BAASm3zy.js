import{R as S,O as $,d as E}from"./index.BY2CIEfQ.js";import{d as z,h as l,l as B,y as f,E as v,o as R,b as q,w as a,J as s,p as u,a as d}from"./framework.DHfpg7u7.js";import"./theme.CTPVtnNN.js";function A(c){return E.request({url:"/mockList",params:c}).then(n=>({data:n.data.data,total:n.data.total}))}const K=z({name:"ProTablePage",__name:"pro-table-page",setup(c){const n=l(!1),p=l([{id:2},{id:3},{id:15}]),i=l(p.value.map(e=>e.id)),m=l();B(()=>{setTimeout(()=>{k.value=T()},0)}),f(n,()=>{console.log("v-model:loading",n)}),f(i,()=>{console.log("selectedKeys",i.value)});const h=[{key:"indexBorder",valueType:"indexBorder",fixed:"left"},{title:"ID",key:"id"},{title:"名称",key:"name",tip:"名称的提示",editable:!0},{title:"进度条",key:"progress",valueType:()=>({type:"progress"})},{title:"函数式返回 enum",key:"fnE",valueType:"enum",tip:"使用函数式 enum",valueEnum:()=>({all:{text:"全部",color:"blue"},open:{text:"未解决",color:"green"},closed:{text:"已解决",color:"red"},processing:{text:"解决中",color:"blue"}})},{title:"图片",key:"imageSrc",valueType:"image",tip:"渲染图片",width:150},{title:"状态",key:"status",valueType:"enum",valueEnum:{all:{text:"全部",color:"blue"},open:{text:"未解决",color:"green"},closed:{text:"已解决",color:"red"},processing:{text:"解决中",color:"blue"}}},{title:"自定义渲染器",key:"customText",valueType:"custom-text"},{title:"自定义渲染器渲染组件",key:"customRenderComponent",valueType:"custom-render-componet"},{title:"操作",key:"operation",width:200,fixed:"right"}],k=l(),x=l(1);function b(e){x.value=e}function T(){let e=Array(100).fill(0),t=0;return e=e.map((r,o)=>({id:++t,name:`name-${o}`,age:18,address:`address-${o}`,status:"all",fnE:"open",progress:80,children:[{id:++t,name:`name-${o}`,age:18,address:`address-${o}`,status:"processing"},{id:++t,name:`name-${o}`,age:18,address:`address-${o}`,status:"processing"}]})),e}function _(e){console.log("selection",e)}function C(e,t){console.log("selection, row",e,t)}function w(e){console.log("selectAllHandler",e)}return(e,t)=>{const r=v("el-button"),o=v("pro-table");return R(),q(u($),null,{default:a(()=>[s(u(S),{header:e.$route.meta.title},{default:a(()=>[s(o,{ref_key:"tableRef",ref:m,"selected-keys":i.value,"onUpdate:selectedKeys":t[1]||(t[1]=g=>i.value=g),"row-key":"id","header-title":"pro table",columns:h,request:u(A),params:{type:1},checkable:"","auto-fit-height":"","reserve-selection":!0,pagination:{pageSize:10,pageSizes:[10,20,40],background:!0},"cache-selected-data":p.value,onPageChange:b,onSelect:C,onSelectAll:w,onSelectionChange:_},{headerTitle:a(()=>[d(" 自定义表头 ")]),toolbar:a(()=>[s(r,{type:"primary",onClick:t[0]||(t[0]=g=>{var y;return(y=m.value)==null?void 0:y.doHeight()})},{default:a(()=>[d("新增")]),_:1})]),operation:a(()=>[s(r,{size:"small",type:"primary"},{default:a(()=>[d("编辑")]),_:1}),s(r,{size:"small",type:"danger"},{default:a(()=>[d("删除")]),_:1}),s(r,{size:"small"},{default:a(()=>[d("查看")]),_:1})]),_:1},8,["selected-keys","request","cache-selected-data"])]),_:1},8,["header"])]),_:1})}}});export{K as default};