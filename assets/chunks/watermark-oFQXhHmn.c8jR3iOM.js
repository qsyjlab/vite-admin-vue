import{d as $e,N as we}from"./index.OAlBif3f.js";import{d as te,h as U,an as ze,k as ne,l as oe,E as G,aJ as _e,o as ae,b as Se,w as g,J as y,m as E,t as Ae,p as j,ax as Ie,ay as Ee,ak as Ne,y as Re,ag as Ce,c as Be,r as De,Q as Me,U as Pe}from"./framework.D1HSi6sf.js";import"./theme.BC9Oi9St.js";const T=2,H=3,I=new WeakMap;function re(r,o){let t=null;return{render:a,destroy:s};function a(){const l=d();if(!l)return;const{zIndex:k=1e3,rotate:h=-22,width:$,height:c,image:N,content:u,font:le,gap:ie=[100,100],offset:w=[0]}=(o==null?void 0:o.value)||{},{color:se="rgba(0, 0, 0, 0.15)",fontSize:R=14,fontWeight:ce="normal",fontStyle:ue="normal",fontFamily:L="sans-serif"}=le||{},[b,z]=ie,O=b/2,V=z/2,fe=(w==null?void 0:w[0])??O,de=(w==null?void 0:w[1])??V,_=document.createElement("canvas"),v=_.getContext("2d");if(!v)return;if(I.has(l)){const e=I.get(l);e&&(t=e)}else t=document.createElement("div");const f=K(),[C,W]=ye(v),B=(b+C)*f,D=(z+W)*f;_.setAttribute("width",`${B*T}px`),_.setAttribute("height",`${D*T}px`);const F=b*f/2,J=z*f/2,Q=C*f,X=W*f,Y=(Q+b*f)/2,Z=(X+z*f)/2,pe=F+B,me=J+D,he=Y+B,xe=Z+D;v.save(),ee(v,Y,Z,h),ge(_,v,F,J,Q,X,he,xe,pe,me,C),t&&I.set(l,t);function ge(e,n,i,p,x,m,S,A,M,P,ke){q(n,i,p,x,m),n.restore(),ee(n,S,A,h),q(n,M,P,x,m),ve(e.toDataURL(),ke)}function q(e,n,i,p,x){const m=K(),S=Number(R)*m;e.font=`${ue} normal ${ce} ${S}px/${x}px ${L}`,e.fillStyle=se,e.textAlign="center",e.textBaseline="top",e.translate(p/2,0);const A=Array.isArray(u)?u:[u];A==null||A.forEach((M,P)=>{e.fillText(M??"",n,i+P*(S+H*m))})}function ye(e){let n=120,i=64;if(!N&&e.measureText){e.font=`${Number(R)}px ${L}`;const p=Array.isArray(u)?u:[u],x=p.map(m=>e.measureText(m||"").width);n=Math.ceil(Math.max(...x)),i=Number(R)*p.length+(p.length-1)*H}return[$??n,c??i]}function be(){const e={zIndex:k,position:"absolute",left:0,top:0,width:"100%",height:"100%",pointerEvents:"none",backgroundRepeat:"repeat"};let n=fe-O,i=de-V;return n>0&&(e.left=`${n}px`,e.width=`calc(100% - ${n}px)`,n=0),i>0&&(e.top=`${i}px`,e.height=`calc(100% - ${i}px)`,i=0),e.backgroundPosition=`${n}px ${i}px`,e}function ve(e,n){t&&t.setAttribute("style",Te({...be(),backgroundImage:`url('${e}')`,backgroundSize:`${(b+n)*T}px`})),t&&l&&l.append(t)}}function s(){if(t){t.remove(),t=null;const l=d();l&&I.delete(l)}}function d(){return j(r)}}function K(){return window.devicePixelRatio||1}function ee(r,o,t,a){r.translate(o,t),r.rotate(Math.PI/180*Number(a)),r.translate(-o,-t)}function Te(r){return Object.keys(r).map(o=>`${Ue(o)}: ${r[o]};`).join(" ")}function Ue(r){return r.replace(/([A-Z])/g,"-$1").toLowerCase()}const je=te({__name:"watermark",props:{zIndex:{},rotate:{},width:{},height:{},image:{},content:{},font:{},style:{},gap:{},offset:{}},setup(r){const o=U(null),t=r,{render:a,destroy:s}=re(o,U(t));oe(()=>{o.value&&a()}),Re(()=>t,()=>{s(),a()},{deep:!0}),Ce(()=>{s()});const d=ne(()=>({position:"relative"}));return(l,k)=>(ae(),Be("div",{ref_key:"watermarkContainerRef",ref:o,class:"watermark",style:Me(d.value)},[De(l.$slots,"default")],4))}}),Le=$e(je),Oe=E("div",{style:{height:"200px"}},null,-1),Ve={style:{position:"relative",height:"200px"}},Qe=te({__name:"watermark",setup(r){const o=[{label:"水印文字",key:"content",el:"el-input"},{label:"字体颜色",key:"color",el:"el-color-picker"},{label:"字体大小",key:"fontSize",el:"el-slider"},{label:"z-index",key:"zIndex",el:"el-slider"},{label:"旋转角度",key:"rotate",el:"el-slider",attrs:{min:-180,max:180}}],t=U(null),a=ze({content:"测试水印",fontSize:14,color:"rgba(0, 0, 0, 0.15)",zIndex:0,rotate:-22}),s=ne(()=>({content:a.content,font:{fontSize:a.fontSize,color:a.color},zIndex:a.zIndex,rotate:a.rotate})),{render:d,destroy:l}=re(t,s);oe(()=>{d()});const k=h=>{Object.keys(h).forEach($=>{const c=$;a[c]=h[c]}),l(),Pe(()=>{d()})};return(h,$)=>{const c=G("page-card"),N=G("page-wrapper"),u=_e("watermark");return ae(),Se(N,null,{default:g(()=>[y(c,{style:{"margin-bottom":"20px"},full:!1,header:"自定义配置"},{default:g(()=>[E("pre",null,"          "+Ae(s.value)+`
      `,1),y(j(we),{fields:o,model:a,"label-position":"top","enable-effect":"",onEffect:k},null,8,["model"])]),_:1}),y(c,{style:{"margin-bottom":"20px"},full:!1,header:"组件水印"},{default:g(()=>[y(j(Le),Ie(Ee(s.value)),{default:g(()=>[Oe]),_:1},16)]),_:1}),y(c,{style:{"margin-bottom":"20px"},full:!1,header:"hook 水印"},{default:g(()=>[E("div",{ref_key:"hookWaterRef",ref:t,style:{position:"relative",height:"200px"}},null,512)]),_:1}),y(c,{style:{"margin-bottom":"20px"},full:!1,header:"vue 指令 水印"},{default:g(()=>[Ne(E("div",Ve,null,512),[[u,s.value]])]),_:1})]),_:1})}}});export{Qe as default};