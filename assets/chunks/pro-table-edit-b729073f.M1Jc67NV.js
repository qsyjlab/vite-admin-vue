import{B as R,o as $,p as D}from"./index.V9EroKAY.js";import{E as V}from"../app.g2pGqmxW.js";import{d as j,h as c,j as M,D as m,o as g,b as f,w as l,m as o,a as u,I as n}from"./framework.SCZo_iHs.js";import"./theme.Lm0SghTC.js";const z=j({__name:"pro-table-edit",setup(N){const{startEditable:y,cancelEditable:k,saveEditable:h,register:v,deleteEditable:w}=R(),r=c(!1);function E(e){console.log("changeHandler",e)}const C=e=>{console.log("delRow",e)},x=e=>{console.log("errors",e),e&&V.error("请填写正确数据")};function _(e,i){console.log("save",e),r.value=!0,setTimeout(()=>{i(),r.value=!1},200)}const T=[{title:"名称",key:"name",tip:"测试tip提示",fixed:"left",editable:!0,rowComponent:{el:"ElInput",rules:[{required:!0,validator:(e,i,t)=>{if(!e)return t(new Error("错误提示有没有"));t()},message:"名称必填"}]}},{title:"地址",key:"address",width:200,editable:!0,rowComponent:{el:"ElInput",rules:[{required:!0,message:"地址"}]}},{title:"邮箱",key:"email",fixed:"left",width:200,editable:!0,rowComponent:{el:"ElInput",rules:[{required:!0,message:"邮箱"}]}},{title:"年份",key:"year",width:200,editable:!0,rowComponent:{el:"ElInput",rules:[{required:!0,message:"年份"}]}},{title:"进度条",key:"progress",width:200,editable:!0,valueType:()=>({type:"progress"})},{title:"函数式返回 enum",key:"fnE",valueType:"enum",width:200,editable:!0,valueEnum:()=>({all:{text:"全部",color:"blue"},open:{text:"未解决",color:"green"},closed:{text:"已解决",color:"red"},processing:{text:"解决中",color:"blue"}})},{title:"状态",key:"status",valueType:"enum",width:200,editable:!0,valueEnum:{all:{text:"全部",color:"blue"},open:{text:"未解决",color:"green"},closed:{text:"已解决",color:"red"},processing:{text:"解决中",color:"blue"}}},{title:"地址1",key:"address1",width:200,editable:!0},{title:"操作",key:"operation",width:300,fixed:"right"}],b=c();M(()=>{setTimeout(()=>{b.value=I()},0)});const q=c({page:1});function I(){let e=Array(100).fill(0),i=0;return e=e.map((t,d)=>({id:++i,name:`name-${d}`,age:18,address:`address-${d}`,status:"all",fnE:"open",progress:80})),e}return(e,i)=>{const t=m("el-button"),d=m("el-space"),B=m("pro-table");return g(),f(o(D),null,{default:l(()=>[n(o($),{header:e.$route.meta.title},{default:l(()=>[n(B,{"header-title":"pro table",columns:T,data:b.value,params:q.value,"row-key":"id",editable:{mode:"multiple",enableValidate:!0,onSave:_,onDelete(a,s){C(a),s()},onChange:E,onError:x},"auto-fit-height":!1,onRegister:o(v)},{operation:l(({row:a,editableState:s})=>[s&&s.isEdit?(g(),f(d,{key:1},{default:l(()=>[n(t,{loading:r.value,type:"primary",onClick:p=>o(h)(a.id)},{default:l(()=>[u("保存")]),_:2},1032,["loading","onClick"]),n(t,{loading:r.value,onClick:p=>o(k)(a.id)},{default:l(()=>[u("取消")]),_:2},1032,["loading","onClick"]),n(t,{loading:r.value,type:"danger",onClick:p=>o(w)(a.id)},{default:l(()=>[u("删除")]),_:2},1032,["loading","onClick"])]),_:2},1024)):(g(),f(t,{key:0,type:"primary",onClick:p=>o(y)(a.id)},{default:l(()=>[u("编辑")]),_:2},1032,["onClick"]))]),_:1},8,["data","params","editable","onRegister"])]),_:1},8,["header"])]),_:1})}}});export{z as default};
