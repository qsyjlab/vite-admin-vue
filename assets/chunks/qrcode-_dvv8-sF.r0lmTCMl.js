import{f,u as m}from"./index.TqDZAx52.js";import{d as u,E as n,o as d,b as h,w as l,J as c,p as v,h as w,l as _,y as b,c as y,m as q}from"./framework.DHfpg7u7.js";import"./theme.BzT8vPt6.js";function x(r,o,e){return new Promise((a,t)=>{m(r,o,{...e||{}},s=>{s&&t(s),a(r)})})}function i(r,o){const{size:e=30,crossOrigin:a}=o||{};if(o!=null&&o.src){const t=new Image;t.src=(o==null?void 0:o.src)||"",t.width=e,t.height=e,a&&t.setAttribute("crossOrigin",a||"anonymous"),t.onload=()=>{const s=r.getContext("2d"),p=(r.width-e)/2,g=(r.height-e)/2;s==null||s.drawImage(t,p,g,e,e)}}}const z={class:"qrcode"},C=u({__name:"qrcode",props:{version:{},errorLevel:{},margin:{},scale:{},text:{},type:{default:"canvas"},size:{default:160},logo:{}},setup(r){const o=w(),e=r;_(()=>{a()}),b(()=>e,()=>{a()},{deep:!0});function a(){o.value&&x(o.value,e.text,{width:e.size,version:e.version,errorCorrectionLevel:e.errorLevel,margin:e.margin,scale:e.scale}).then(t=>{e.logo&&(typeof e.logo=="string"?i(t,{src:e.logo}):i(t,e.logo))})}return(t,s)=>(d(),y("div",z,[q("canvas",{ref_key:"qrcodeRef",ref:o},null,512)]))}}),k=f(C),E=u({__name:"qrcode",setup(r){return(o,e)=>{const a=n("page-card"),t=n("page-wrapper");return d(),h(t,null,{default:l(()=>[c(a,{header:o.$route.meta.title},{default:l(()=>[c(v(k),{text:"https://qsyjlab.club/",logo:{src:"https://api.qsyjlab.club/file/uploads/cover/20220526/628edee1a79a4.jpg",size:60},size:300},null,8,["logo"])]),_:1},8,["header"])]),_:1})}}});export{E as default};
