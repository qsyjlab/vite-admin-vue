import{r as $e,o as we}from"./index.D6icXynQ.js";import{d as te,h as T,ao as ze,k as ne,l as oe,E as G,aK as _e,o as ae,b as Se,w as g,J as y,m as I,t as Ae,p as j,ay as Ee,az as Ie,al as Ce,y as Me,ah as Ne,c as Re,r as Be,Q as De,U as Oe}from"./framework.DHfpg7u7.js";import"./theme.PK2hWhlx.js";const P=2,H=3,E=new WeakMap;function re(r,o){let t=null;return{render:a,destroy:s};function a(){const l=d();if(!l)return;const{zIndex:k=1e3,rotate:h=-22,width:$,height:c,image:C,content:u,font:le,gap:ie=[100,100],offset:w=[0]}=(o==null?void 0:o.value)||{},{color:se="rgba(0, 0, 0, 0.15)",fontSize:M=14,fontWeight:ce="normal",fontStyle:ue="normal",fontFamily:L="sans-serif"}=le||{},[b,z]=ie,U=b/2,W=z/2,fe=(w==null?void 0:w[0])??U,de=(w==null?void 0:w[1])??W,_=document.createElement("canvas"),v=_.getContext("2d");if(!v)return;if(E.has(l)){const e=E.get(l);e&&(t=e)}else t=document.createElement("div");const f=J(),[N,V]=ye(v),R=(b+N)*f,B=(z+V)*f;_.setAttribute("width",`${R*P}px`),_.setAttribute("height",`${B*P}px`);const F=b*f/2,K=z*f/2,Q=N*f,X=V*f,Y=(Q+b*f)/2,Z=(X+z*f)/2,pe=F+R,me=K+B,he=Y+R,xe=Z+B;v.save(),ee(v,Y,Z,h),ge(_,v,F,K,Q,X,he,xe,pe,me,N),t&&E.set(l,t);function ge(e,n,i,p,x,m,S,A,D,O,ke){q(n,i,p,x,m),n.restore(),ee(n,S,A,h),q(n,D,O,x,m),ve(e.toDataURL(),ke)}function q(e,n,i,p,x){const m=J(),S=Number(M)*m;e.font=`${ue} normal ${ce} ${S}px/${x}px ${L}`,e.fillStyle=se,e.textAlign="center",e.textBaseline="top",e.translate(p/2,0);const A=Array.isArray(u)?u:[u];A==null||A.forEach((D,O)=>{e.fillText(D??"",n,i+O*(S+H*m))})}function ye(e){let n=120,i=64;if(!C&&e.measureText){e.font=`${Number(M)}px ${L}`;const p=Array.isArray(u)?u:[u],x=p.map(m=>e.measureText(m||"").width);n=Math.ceil(Math.max(...x)),i=Number(M)*p.length+(p.length-1)*H}return[$??n,c??i]}function be(){const e={zIndex:k,position:"absolute",left:0,top:0,width:"100%",height:"100%",pointerEvents:"none",backgroundRepeat:"repeat"};let n=fe-U,i=de-W;return n>0&&(e.left=`${n}px`,e.width=`calc(100% - ${n}px)`,n=0),i>0&&(e.top=`${i}px`,e.height=`calc(100% - ${i}px)`,i=0),e.backgroundPosition=`${n}px ${i}px`,e}function ve(e,n){t&&t.setAttribute("style",Pe({...be(),backgroundImage:`url('${e}')`,backgroundSize:`${(b+n)*P}px`})),t&&l&&l.append(t)}}function s(){if(t){t.remove(),t=null;const l=d();l&&E.delete(l)}}function d(){return j(r)}}function J(){return window.devicePixelRatio||1}function ee(r,o,t,a){r.translate(o,t),r.rotate(Math.PI/180*Number(a)),r.translate(-o,-t)}function Pe(r){return Object.keys(r).map(o=>`${Te(o)}: ${r[o]};`).join(" ")}function Te(r){return r.replace(/([A-Z])/g,"-$1").toLowerCase()}const je=te({__name:"watermark",props:{zIndex:{},rotate:{},width:{},height:{},image:{},content:{},font:{},style:{},gap:{},offset:{}},setup(r){const o=T(null),t=r,{render:a,destroy:s}=re(o,T(t));oe(()=>{o.value&&a()}),Me(()=>t,()=>{s(),a()},{deep:!0}),Ne(()=>{s()});const d=ne(()=>({position:"relative"}));return(l,k)=>(ae(),Re("div",{ref_key:"watermarkContainerRef",ref:o,class:"watermark",style:De(d.value)},[Be(l.$slots,"default")],4))}}),Le=$e(je),Ue=I("div",{style:{height:"200px"}},null,-1),We={style:{position:"relative",height:"200px"}},Qe=te({__name:"watermark",setup(r){const o=[{label:"水印文字",key:"content",el:"el-input"},{label:"字体颜色",key:"color",el:"el-color-picker"},{label:"字体大小",key:"fontSize",el:"el-slider"},{label:"z-index",key:"zIndex",el:"el-slider"},{label:"旋转角度",key:"rotate",el:"el-slider",attrs:{min:-180,max:180}}],t=T(null),a=ze({content:"测试水印",fontSize:14,color:"rgba(0, 0, 0, 0.15)",zIndex:0,rotate:-22}),s=ne(()=>({content:a.content,font:{fontSize:a.fontSize,color:a.color},zIndex:a.zIndex,rotate:a.rotate})),{render:d,destroy:l}=re(t,s);oe(()=>{d()});const k=h=>{Object.keys(h).forEach($=>{const c=$;a[c]=h[c]}),l(),Oe(()=>{d()})};return(h,$)=>{const c=G("page-card"),C=G("page-wrapper"),u=_e("watermark");return ae(),Se(C,null,{default:g(()=>[y(c,{style:{"margin-bottom":"20px"},full:!1,header:"自定义配置"},{default:g(()=>[I("pre",null,"          "+Ae(s.value)+`
      `,1),y(j(we),{fields:o,model:a,"label-position":"top","enable-effect":"",onEffect:k},null,8,["model"])]),_:1}),y(c,{style:{"margin-bottom":"20px"},full:!1,header:"组件水印"},{default:g(()=>[y(j(Le),Ee(Ie(s.value)),{default:g(()=>[Ue]),_:1},16)]),_:1}),y(c,{style:{"margin-bottom":"20px"},full:!1,header:"hook 水印"},{default:g(()=>[I("div",{ref_key:"hookWaterRef",ref:t,style:{position:"relative",height:"200px"}},null,512)]),_:1}),y(c,{style:{"margin-bottom":"20px"},full:!1,header:"vue 指令 水印"},{default:g(()=>[Ce(I("div",We,null,512),[[u,s.value]])]),_:1})]),_:1})}}});export{Qe as default};
