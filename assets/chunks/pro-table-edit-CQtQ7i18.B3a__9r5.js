import{C as $,f as M,h as V}from"./index.B_-AZqtN.js";import{E as B}from"./theme.af-yJUCQ.js";import{d as N,h as c,l as S,E as m,o as g,b as f,w as o,J as n,p as a,a as u}from"./framework.D1sHVKzl.js";const J=N({__name:"pro-table-edit",setup(j){const{startEditable:y,cancelEditable:k,saveEditable:h,register:v,deleteEditable:w}=$(),i=c(!1);function C(e){console.log("changeHandler",e)}const E=e=>{console.log("delRow",e)},x=e=>{console.log("errors",e),e&&B.error("请填写正确数据")};function _(e,t){console.log("save",e),i.value=!0,setTimeout(()=>{t(),i.value=!1},200)}const T=[{title:"名称",key:"name",tip:"测试tip提示",fixed:"left",editable:!0,rowComponent:{el:"ElInput",rules:[{required:!0,validator:(e,t,l)=>{if(!e)return l(new Error("错误提示有没有"));l()},message:"名称必填"}]}},{title:"地址",key:"address",width:200,editable:!0,rowComponent:{el:"ElInput",rules:[{required:!0,message:"地址"}]}},{title:"邮箱",key:"email",fixed:"left",width:200,editable:!0,rowComponent:{el:"ElInput",rules:[{required:!0,message:"邮箱"}]}},{title:"年份",key:"year",width:200,editable:!0,rowComponent:{el:"ElInput",rules:[{required:!0,message:"年份"}]}},{title:"进度条",key:"progress",width:200,editable:!1,valueType:()=>({type:"progress"})},{title:"函数式返回 enum",key:"fnE",valueType:"enum",width:200,editable:!1,valueEnum:()=>({all:{text:"全部",color:"blue"},open:{text:"未解决",color:"green"},closed:{text:"已解决",color:"red"},processing:{text:"解决中",color:"blue"}})},{title:"状态",key:"status",valueType:"enum",width:200,editable:!1,valueEnum:{all:{text:"全部",color:"blue"},open:{text:"未解决",color:"green"},closed:{text:"已解决",color:"red"},processing:{text:"解决中",color:"blue"}}},{title:"地址1",key:"address1",width:200,editable:!0},{title:"操作",key:"operation",width:300,fixed:"right"}],b=c();S(()=>{setTimeout(()=>{b.value=I()},0)});const q=c({page:1});function I(){let e=Array(100).fill(0),t=0;return e=e.map((l,d)=>({id:++t,name:`name-${d}`,age:18,address:`address-${d}`,status:"all",fnE:"open",progress:80})),e}return(e,t)=>{const l=m("el-button"),d=m("el-space"),R=m("pro-table");return g(),f(a(V),null,{default:o(()=>[n(a(M),{header:e.$route.meta.title},{default:o(()=>[n(R,{"header-title":"pro table",columns:T,data:b.value,params:q.value,"row-key":"id",editable:{mode:"multiple",enableValidate:!0,onSave:_,onDelete(r,s){E(r),s()},onChange:C,onError:x},"auto-fit-height":!1,onRegister:a(v)},{operation:o(({row:r,editableState:s})=>[s&&s.isEdit?(g(),f(d,{key:1},{default:o(()=>[n(l,{loading:i.value,type:"primary",onClick:p=>a(h)(r.id)},{default:o(()=>t[1]||(t[1]=[u("保存")])),_:2},1032,["loading","onClick"]),n(l,{loading:i.value,onClick:p=>a(k)(r.id)},{default:o(()=>t[2]||(t[2]=[u("取消")])),_:2},1032,["loading","onClick"]),n(l,{loading:i.value,type:"danger",onClick:p=>a(w)(r.id)},{default:o(()=>t[3]||(t[3]=[u("删除")])),_:2},1032,["loading","onClick"])]),_:2},1024)):(g(),f(l,{key:0,type:"primary",onClick:p=>a(y)(r.id)},{default:o(()=>t[0]||(t[0]=[u("编辑")])),_:2},1032,["onClick"]))]),_:1},8,["data","params","editable","onRegister"])]),_:1},8,["header"])]),_:1})}}});export{J as default};
