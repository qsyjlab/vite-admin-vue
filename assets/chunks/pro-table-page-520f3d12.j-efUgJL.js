import{l as _,n as $,Z as C}from"./index.mdm6ka2m.js";import{d as w,h as l,j as z,y as f,D as v,o as E,b as B,w as e,I as r,m as d,a as u}from"./framework.kGBdJdCt.js";import"../app.4OzQX80d.js";import"./theme.IDZC-AZR.js";function Z(p){return C.request({url:"/mockList",params:p}).then(s=>({data:s.data.data,total:s.data.total}))}const L=w({name:"ProTablePage",__name:"pro-table-page",setup(p){const s=l(!1),i=l(),c=l();z(()=>{setTimeout(()=>{h.value=T()},0)}),f(s,()=>{console.log("v-model:loading",s)}),f(i,()=>{console.log("selectedKeys",i.value)});const k=[{key:"indexBorder",valueType:"indexBorder",fixed:"left"},{title:"名称",key:"name",tip:"名称的提示",editable:!0},{title:"进度条",key:"progress",valueType:()=>({type:"progress"})},{title:"函数式返回 enum",key:"fnE",valueType:"enum",tip:"使用函数式 enum",valueEnum:()=>({all:{text:"全部",color:"blue"},open:{text:"未解决",color:"green"},closed:{text:"已解决",color:"red"},processing:{text:"解决中",color:"blue"}})},{title:"图片",key:"imageSrc",valueType:"image",tip:"渲染图片",width:150},{title:"状态",key:"status",valueType:"enum",valueEnum:{all:{text:"全部",color:"blue"},open:{text:"未解决",color:"green"},closed:{text:"已解决",color:"red"},processing:{text:"解决中",color:"blue"}}},{title:"自定义渲染器",key:"customText",valueType:"custom-text"},{title:"自定义渲染器渲染组件",key:"customRenderComponent",valueType:"custom-render-componet"},{title:"操作",key:"operation",width:200,fixed:"right"}],h=l(),m=l(1),x=l({page:1});function b(o){m.value=o}function T(){let o=Array(100).fill(0),t=0;return o=o.map((n,a)=>({id:++t,name:`name-${a}`,age:18,address:`address-${a}`,status:"all",fnE:"open",progress:80,children:[{id:++t,name:`name-${a}`,age:18,address:`address-${a}`,status:"processing"},{id:++t,name:`name-${a}`,age:18,address:`address-${a}`,status:"processing"}]})),o}return(o,t)=>{const n=v("el-button"),a=v("pro-table");return E(),B(d($),null,{default:e(()=>[r(d(_),{header:o.$route.meta.title},{default:e(()=>[r(a,{ref_key:"tableRef",ref:c,"selected-keys":i.value,"onUpdate:selectedKeys":t[1]||(t[1]=g=>i.value=g),"header-title":"pro table",columns:k,request:d(Z),params:x.value,checkable:"","auto-fit-height":"",pagination:{page:m.value,pageSize:10,pageSizes:[10,20,40],background:!0},onPageChange:b},{headerTitle:e(()=>[u(" 自定义表头 ")]),toolbar:e(()=>[r(n,{type:"primary",onClick:t[0]||(t[0]=g=>{var y;return(y=c.value)==null?void 0:y.doHeight()})},{default:e(()=>[u("新增")]),_:1})]),operation:e(({})=>[r(n,{size:"small",type:"primary"},{default:e(()=>[u("编辑")]),_:1}),r(n,{size:"small",type:"danger"},{default:e(()=>[u("删除")]),_:1}),r(n,{size:"small"},{default:e(()=>[u("查看")]),_:1})]),_:1},8,["selected-keys","request","params","pagination"])]),_:1},8,["header"])]),_:1})}}});export{L as default};
