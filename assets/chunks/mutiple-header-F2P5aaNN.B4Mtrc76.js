import{A}from"./index.TqDZAx52.js";import{f as O}from"./index-Aw5De4F6.BS1nvXKG.js";import{d as R,h as E,E as m,o as L,b as P,w as i,J as u,p as D,a as g}from"./framework.DHfpg7u7.js";import"./theme.BzT8vPt6.js";const j=R({__name:"mutiple-header",setup(N){const c=E([]),{register:k,getTableRef:y}=A();c.value=w();const s=[{title:"ID",key:"id"},{title:"姓名",key:"namer",children:[{title:"姓名1",key:"name1",children:[{title:"姓名",key:"name",children:[]},{title:"姓名2",key:"name2",children:[]}]},{title:"姓名2",key:"name1",children:[]}]},{title:"年龄",key:"age"},{title:"编号",key:"code"},{title:"地址",key:"address"},{title:"开始时间",key:"startTime"},{title:"结束时间",key:"endTime"}],x=({rowIndex:n,columnIndex:e})=>{if(n%2===0){if(e===0)return[1,2];if(e===1)return[0,0]}},T=async()=>{const n=await y();console.log("tableRef",n)},_=()=>{const n={};s.forEach(t=>{n[t.key]=t.title});const e=C(s);O({data:[],merges:[],header:e,filename:`${new Date().getTime()}.xlsx`,json2sheetOpts:{header:e},write2excelOpts:{bookType:"xlsx"}})};function C(n){let e=[];h(n,e,0,0);let t=Math.max(...e.map(a=>a.length));return e.filter(a=>a.length<t).forEach(a=>f(a,t-a.length)),e}function h(n,e,t,a){let r=0,o=e[t];o||(o=e[t]=[]),f(o,a-o.length);for(let d=0;d<n.length;d++){let l=n[d];if(o.push(l.title),l.hasOwnProperty("children")&&Array.isArray(l.children)&&l.children.length>0){let p=h(l.children,e,t+1,o.length-1);b(o,p-1),r+=p}else r++}return r}function b(n,e){for(let t=0;t<e;t++)n.push("!$COL_SPAN_PLACEHOLDER")}function f(n,e){for(let t=0;t<e;t++)n.push("!$ROW_SPAN_PLACEHOLDER")}function w(){return[{id:"12987122",name:"Tom",amount1:"234",amount2:"3.2",amount3:10},{id:"12987123",name:"Tom",amount1:"165",amount2:"4.43",amount3:12},{id:"12987124",name:"Tom",amount1:"324",amount2:"1.9",amount3:9},{id:"12987125",name:"Tom",amount1:"621",amount2:"2.2",amount3:17},{id:"12987126",name:"Tom",amount1:"539",amount2:"4.1",amount3:15}]}return(n,e)=>{const t=m("el-button"),a=m("pro-table"),r=m("page-card"),o=m("page-wrapper");return L(),P(o,null,{default:i(()=>[u(r,{header:n.$route.meta.title},{default:i(()=>[u(a,{columns:s,data:c.value,"span-method":x,onRegister:D(k)},{toolbar:i(()=>[u(t,{onClick:T},{default:i(()=>[g("数组方式导出")]),_:1}),u(t,{onClick:_},{default:i(()=>[g("导出")]),_:1})]),_:1},8,["data","onRegister"])]),_:1},8,["header"])]),_:1})}}});export{j as default};
