import"./index.OAlBif3f.js";import{c as x,f as h}from"./index-rzEixQxK.Bl_qYJGh.js";import{d as w,h as y,E as r,o as _,b as T,w as a,J as l,a as i}from"./framework.D1HSi6sf.js";import"./theme.BC9Oi9St.js";const C=w({__name:"excel",setup(g){const o=y([]);o.value=m();const n=[{title:"ID",key:"id"},{title:"姓名",key:"name"},{title:"年龄",key:"age"},{title:"编号",key:"code"},{title:"地址",key:"address"},{title:"开始时间",key:"startTime"},{title:"结束时间",key:"endTime"}],d=()=>{x({data:p(),header:n.map(e=>e.title),filename:"二维数组方式导出excel.xlsx"})},c=()=>{const e={};n.forEach(t=>{e[t.key]=t.title}),h({data:o.value,header:e,filename:`${new Date().getTime()}.xlsx`,json2sheetOpts:{header:["name","id"]},write2excelOpts:{bookType:"xlsx"}})};function m(){const e=[];for(let t=0;t<40;t++)e.push({id:`${t}`,name:`${t} John Brown`,age:`${t+10}`,code:`${t}98678`,address:"New York No. 1 Lake ParkNew York No. 1 Lake Park",startTime:new Date().toLocaleString(),endTime:new Date().toLocaleString()});return e}function p(){return o.value.map(e=>Object.keys(e).map(t=>e[t]))}return(e,t)=>{const s=r("el-button"),u=r("pro-table"),k=r("page-card"),f=r("page-wrapper");return _(),T(f,null,{default:a(()=>[l(k,{header:e.$route.meta.title},{default:a(()=>[l(u,{columns:n,data:o.value},{toolbar:a(()=>[l(s,{onClick:d},{default:a(()=>[i("数组方式导出")]),_:1}),l(s,{onClick:c},{default:a(()=>[i("导出")]),_:1})]),_:1},8,["data"])]),_:1},8,["header"])]),_:1})}}});export{C as default};