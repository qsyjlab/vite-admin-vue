import"./index.V9EroKAY.js";import{E as _,M as k,N as C}from"../app.g2pGqmxW.js";import{d as x,D as c,o as w,b as B,w as e,m as s,a as l,I as n}from"./framework.SCZo_iHs.js";import"./theme.Lm0SghTC.js";function b(){}function h(){return{createMessageBox:b,message:_,notification:k,messageBox:C}}const V=x({__name:"message",setup(N){const{message:r,notification:i,messageBox:d}=h(),m=()=>{d.alert("This is a message","Title",{confirmButtonText:"OK",callback:p=>{r({type:"info",message:`action: ${p}`})}})};return(p,a)=>{const o=c("el-button"),f=c("el-space"),u=c("page-card"),g=c("page-wrapper");return w(),B(g,null,{default:e(()=>[n(u,{style:{"margin-bottom":"20px"},header:"message",full:!1},{default:e(()=>[n(f,null,{default:e(()=>[n(o,{plain:!0,onClick:a[0]||(a[0]=t=>s(r).success("success"))},{default:e(()=>[l("success")]),_:1}),n(o,{plain:!0,onClick:a[1]||(a[1]=t=>s(r).warning("warning"))},{default:e(()=>[l("warning")]),_:1}),n(o,{plain:!0,onClick:a[2]||(a[2]=t=>s(r).info("info"))},{default:e(()=>[l("info")]),_:1}),n(o,{plain:!0,onClick:a[3]||(a[3]=t=>s(r).error("error"))},{default:e(()=>[l("error")]),_:1})]),_:1})]),_:1}),n(u,{style:{"margin-bottom":"20px"},header:"notification",full:!1},{default:e(()=>[n(f,null,{default:e(()=>[n(o,{plain:!0,onClick:a[4]||(a[4]=t=>s(i).success("success"))},{default:e(()=>[l("success")]),_:1}),n(o,{plain:!0,onClick:a[5]||(a[5]=t=>s(i).warning("warning"))},{default:e(()=>[l("warning")]),_:1}),n(o,{plain:!0,onClick:a[6]||(a[6]=t=>s(i).info("info"))},{default:e(()=>[l("info")]),_:1}),n(o,{plain:!0,onClick:a[7]||(a[7]=t=>s(i).error("error"))},{default:e(()=>[l("error")]),_:1})]),_:1})]),_:1}),n(u,{header:"messageBox",full:!1},{default:e(()=>[n(f,null,{default:e(()=>[n(o,{plain:!0,onClick:m},{default:e(()=>[l("alert")]),_:1})]),_:1})]),_:1})]),_:1})}}});export{V as default};