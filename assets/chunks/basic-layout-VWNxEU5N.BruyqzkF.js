import{d as T,h as q,y as pe,k as S,E as g,aK as Fe,o,c as f,m as u,J as i,w as d,p as e,aw as ce,ay as Y,az as me,F as G,b as x,e as w,al as ke,K as we,N as J,r as P,aD as N,b7 as We,Q as D,t as R,l as Ce,a as V,G as te,A as Te,b8 as _e,b9 as Ae,n as se,am as Oe,q as fe,s as ve}from"./framework.DHfpg7u7.js";import{I as B,q as Q,a as ee,k,X as Se,N as X,R as Ee,F as Me,D as ye,e as Ne,b as Ve,z as ze,C as j,r as $e,O as ne,c as Re,U as Ue,l as E,d as He,W as ue,B as Ie,g as qe}from"./index.TqDZAx52.js";import{Q as je,S as Ge,I as Ke,T as Ye,B as Pe,L as Z,C as Ze,D as de,F as Je,U as Xe,V as Qe}from"./theme.BzT8vPt6.js";import{i as et}from"./index-0syHYYlV.1uIrC9UU.js";import{m as tt}from"./index-M-AftMVB.SNnmW7gW.js";function at(){return!!(document.fullscreenElement||document.webkitFullscreenElement||document.mozFullScreenElement||document.msFullscreenElement)}function nt(){return navigator.clipboard&&window.isSecureContext}function lt(r,a){nt()&&navigator.clipboard.writeText(r).then(()=>{var n;(n=a==null?void 0:a.success)==null||n.call(a)}).catch(()=>{var n;(n=a==null?void 0:a.error)==null||n.call(a)})}function it(){const{replace:r,currentRoute:a}=ne();function n(){const{query:c,params:l={},fullPath:s,name:m}=e(a);if(m===ue)return Promise.resolve(!1);const t={...l};return m&&Object.keys(l).length>0?(t._origin_params=JSON.stringify(l??{}),t._redirect_type="name",t.path=String(m)):(t._redirect_type="path",t.path=s),r({name:ue,params:t,query:c}).then(()=>Promise.resolve(!0))}return{reload:n}}function Le(r){const{getMenus:a}=$e(),{layoutConfig:n}=Q(ee()),c=ne().currentRoute,l=S(()=>n.value.splitMenu);return{menus:S(()=>{var s,m;const t=a();if(!l.value)return t;const p=r==null?void 0:r.value.type,y=(s=c.value.matched[0])==null?void 0:s.name;return p==="left"?((m=t.find(b=>b.name===y))==null?void 0:m.children)||[]:p==="top"?t.map(b=>({...b,children:[]})):t})}}const ot={};function st(r,a){return o(),f("div",J({class:"layout-container"},r.$attrs),[P(r.$slots,"default")],16)}const dt=B(ot,[["render",st]]),ut=T({__name:"layout-header",props:{fixed:{type:Boolean,default:!0},zIndex:{default:1001},minWidth:{default:1200},height:{default:56},paddingLeft:{default:200},transitionDuration:{default:200},transitionTimingFunction:{default:"ease-in-out"}},setup(r){const a=r,n=S(()=>{const{fixed:c,zIndex:l,height:s,paddingLeft:m,transitionDuration:t,transitionTimingFunction:p}=a;return`position: ${c?"fixed":"static"};z-index: ${l};height: ${s}px;padding-left: ${m}px;transition-duration: ${t}ms;transition-timing-function: ${p};box-sizing: border-box;`});return(c,l)=>(o(),f("div",{class:"layout-header",style:D(n.value)},[P(c.$slots,"default")],4))}}),rt=T({__name:"layout-tabs",props:{fixed:{type:Boolean,default:!0},top:{default:56},zIndex:{default:999},minWidth:{default:0},height:{default:56},paddingLeft:{default:0},transitionDuration:{default:200},transitionTimingFunction:{default:"ease-in-out"}},setup(r){const a=r,n=S(()=>{const{fixed:c,top:l,zIndex:s,minWidth:m,height:t,paddingLeft:p,transitionDuration:y,transitionTimingFunction:b}=a;return`position: ${c?"fixed":"static"};top: ${l}px;z-index: ${s};min-width: ${m}px;height: ${t}px;padding-left: ${p}px;transition-duration: ${y}ms;transition-timing-function: ${b};box-sizing: border-box;`});return(c,l)=>(o(),f("div",{class:"layout-tab",style:D(n.value)},[P(c.$slots,"default")],4))}}),ct=T({__name:"layout-sidebar",props:{zIndex:{default:1002},width:{default:200},paddingTop:{default:0},transitionDuration:{default:200},transitionTimingFunction:{default:"ease-in-out"}},setup(r){const a=r,n=S(()=>{const{zIndex:c,width:l,paddingTop:s,transitionDuration:m,transitionTimingFunction:t}=a;return{zIndex:c,transitionTimingFunction:t,transitionDuration:`${m}ms`,width:`${l}px`,paddingTop:`${s}px`}});return(c,l)=>(o(),f("div",{class:"layout-sidebar",style:D(n.value)},[P(c.$slots,"default")],4))}}),mt=T({__name:"layout-main",props:{paddingTop:{default:0},paddingBottom:{default:0},paddingLeft:{default:200},transitionDuration:{default:200},transitionTimingFunction:{default:"ease-in-out"}},setup(r){const a=r,n=S(()=>{const{paddingTop:c,paddingBottom:l,paddingLeft:s,transitionDuration:m,transitionTimingFunction:t}=a;return`padding-top: ${c}px;padding-bottom: ${l}px;padding-left: ${s}px;transition-duration: ${m}ms;transition-timing-function: ${t};`});return(c,l)=>(o(),f("div",{class:"layout-main",style:D(n.value)},[P(c.$slots,"default")],4))}}),pt=T({__name:"layout-footer",props:{fixed:{type:Boolean,default:!0},zIndex:{default:999},minWidth:{default:1200},height:{default:56},paddingLeft:{default:0},transitionDuration:{default:200},transitionTimingFunction:{default:"ease-in-out"}},setup(r){const a=r,n=S(()=>{const{zIndex:c,height:l,paddingLeft:s,transitionDuration:m,transitionTimingFunction:t}=a;return` z-index: ${c};;height: ${l}px;padding-left: ${s}px;transition-duration: ${m}ms;transition-timing-function: ${t};box-sizing: border-box;`});return(c,l)=>(o(),f("div",{class:"layout-footer",style:D(n.value)},[P(c.$slots,"default")],4))}}),ft=T({__name:"layout",props:{asideWidth:{default:220},asidePaddingTop:{default:0},headerHeight:{default:48},headerPaddingLeft:{},headerZIndex:{default:1001},tabHeight:{default:32},footerHeight:{},config:{default:()=>({header:!0,tab:!0,aside:!0,main:!0,footer:!0})}},setup(r){const a=r,n=S(()=>({width:a.asideWidth,paddingTop:a.asidePaddingTop})),c=S(()=>({paddingLeft:a.headerPaddingLeft,height:a.headerHeight,zIndex:a.headerZIndex})),l=S(()=>({top:a.config.header?a.headerHeight:0,paddingLeft:a.asideWidth,height:a.tabHeight})),s=S(()=>{let t=0;return a.config.header&&(t+=a.headerHeight),a.config.tab&&(t+=a.tabHeight),{paddingLeft:a.asideWidth,paddingTop:t}}),m=S(()=>({paddingLeft:a.asideWidth,height:a.footerHeight}));return(t,p)=>(o(),x(e(dt),null,{default:d(()=>[t.config.aside?(o(),x(e(ct),Y(J({key:0},n.value)),{default:d(()=>[P(t.$slots,"aside")]),_:3},16)):w("v-if",!0),t.config.header?(o(),x(e(ut),Y(J({key:1},c.value)),{default:d(()=>[P(t.$slots,"header")]),_:3},16)):w("v-if",!0),t.config.tab?(o(),x(e(rt),Y(J({key:2},l.value)),{default:d(()=>[P(t.$slots,"tabs")]),_:3},16)):w("v-if",!0),t.config.main?(o(),x(e(mt),Y(J({key:3},s.value)),{default:d(()=>[P(t.$slots,"default")]),_:3},16)):w("v-if",!0),t.config.footer?(o(),x(e(pt),Y(J({key:4},m.value)),{default:d(()=>[P(t.$slots,"footer")]),_:3},16)):w("v-if",!0)]),_:3}))}}),vt=r=>{const a=X.keepAliveCachePolicy!=="never";return T({name:r,setup(){const n=Ee(),c=Me();return()=>N(Ne,{},{default:l=>{if(a){const s=X.keepAliveCachePolicy==="normal"?n.getAliveCache:c.getKeepAliveCache;return N(ye,{},()=>N(We,{include:s},N(l.Component,{key:l.route.fullPath})))}return N(ye,{},N(l.Component,{key:l.route.fullPath}))}})}})},gt=Symbol();function ht(){return Re(gt)}function Be(){const r=ht();return{...r,isMobile:S(()=>e(r.isMobile))}}const _t={class:"breadcrumb-item"},yt={key:0,class:"icon"},bt={class:"title"},xt=T({__name:"breadcrumb",setup(r){const a=q([]),n=Ie((c,l,s)=>{c.name!==ue&&(a.value=s.filter(m=>m.meta.hideInBreadcrumb!==!0))});return Te(()=>{n()}),(c,l)=>{const s=g("el-breadcrumb-item"),m=g("el-breadcrumb");return o(),x(m,{separator:"/"},{default:d(()=>[(o(!0),f(G,null,te(a.value,t=>(o(),x(s,{key:t.path,to:{name:t.name}},{default:d(()=>{var p;return[u("div",_t,[e(X).defaultLayoutSetting.showBreadCrumbIcon?(o(),f("div",yt,[i(e(j),{icon:t.meta.icon,size:18},null,8,["icon"])])):w("v-if",!0),u("div",bt,R((p=t==null?void 0:t.meta)==null?void 0:p.title),1)])]}),_:2},1032,["to"]))),128))]),_:1})}}}),kt=B(xt,[["__scopeId","data-v-ce7ef8bb"]]),wt=T({__name:"user-menu",setup(r){const{loginOutSystem:a,userInfo:n}=Ue(),c=ne(),l=()=>{a(),c.push({name:"Login"})};return(s,m)=>{const t=g("el-avatar"),p=g("el-space"),y=g("el-button"),b=g("el-dropdown-item"),z=g("el-dropdown-menu"),L=g("el-dropdown");return o(),x(L,{style:{height:"100%"}},{dropdown:d(()=>[i(z,null,{default:d(()=>[i(b,null,{default:d(()=>[V("个人首页")]),_:1}),i(b,{onClick:l},{default:d(()=>[V("退出登录")]),_:1})]),_:1})]),default:d(()=>[i(y,{type:"primary",text:""},{default:d(()=>[i(p,null,{default:d(()=>[i(t,{size:32,src:"https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png"})]),_:1}),u("span",null,R(e(n).userName),1)]),_:1})]),_:1})}}}),Ct={key:0,class:"icon"},Tt={class:"ellipsis"},St={key:0,class:"icon"},Mt={class:"ellipsis"},zt={key:0,class:"icon"},$t={class:"ellipsis"},Ht={name:"MenuItem"},It=T({...Ht,props:{item:{}},setup(r){const a=n=>{var c,l;return!((c=n.meta)!=null&&c.hideChildrenInMenu)&&!!((l=n.children)!=null&&l.length)};return(n,c)=>{const l=g("el-menu-item"),s=g("menu-item",!0),m=g("el-sub-menu");return a(n.item)?(o(),x(m,{key:1,index:n.item.name},{title:d(()=>{var t,p,y,b;return[(t=n.item.meta)!=null&&t.icon?(o(),f("div",St,[i(e(j),{size:18,icon:(p=n.item.meta)==null?void 0:p.icon},null,8,["icon"])])):w("v-if",!0),u("span",Mt,R((b=(y=n.item)==null?void 0:y.meta)==null?void 0:b.title),1)]}),default:d(()=>[(o(!0),f(G,null,te(n.item.children,t=>{var p;return o(),f(G,{key:t.name},[(p=t.children)!=null&&p.length?(o(),x(s,{key:1,item:t},null,8,["item"])):(o(),x(l,{key:0,index:t.name,route:{name:t.name}},{title:d(()=>{var y;return[u("span",$t,R((y=t==null?void 0:t.meta)==null?void 0:y.title),1)]}),default:d(()=>{var y,b;return[(y=t.meta)!=null&&y.icon?(o(),f("div",zt,[i(e(j),{size:18,icon:(b=t.meta)==null?void 0:b.icon},null,8,["icon"])])):w("v-if",!0)]}),_:2},1032,["index","route"]))],64)}),128))]),_:1},8,["index"])):(o(),x(l,{key:0,index:n.item.name,route:{name:n.item.name}},{title:d(()=>{var t,p;return[u("span",Tt,R((p=(t=n.item)==null?void 0:t.meta)==null?void 0:p.title),1)]}),default:d(()=>{var t,p;return[(t=n.item.meta)!=null&&t.icon?(o(),f("div",Ct,[i(e(j),{size:18,icon:(p=n.item.meta)==null?void 0:p.icon},null,8,["icon"])])):w("v-if",!0)]}),_:1},8,["index","route"]))}}}),Pt=B(It,[["__scopeId","data-v-d74561c6"]]),ge=T({__name:"menu",props:{collapsed:{type:Boolean,default:!1},menus:{default:()=>[]},menuType:{default:"side"},isSplit:{type:Boolean,default:!1}},setup(r){const a=r,{currentRoute:n}=ne(),c=S(()=>{var l;const s=e(n);return a.isSplit&&a.menuType==="top"?(l=s.matched[0])==null?void 0:l.name:s.meta.currentActiveMenu||String(s.name)});return(l,s)=>{const m=g("el-menu");return o(),x(m,{collapse:l.collapsed,"default-active":c.value,"collapse-transition":!1,router:""},{default:d(()=>[(o(!0),f(G,null,te(l.menus,t=>(o(),x(Pt,{key:t.name,item:t},null,8,["item"]))),128))]),_:1},8,["collapse","default-active"])}}}),Lt=["src"],ae=T({__name:"logo",props:{logoWidth:{default:78},showTitle:{type:Boolean,default:!0},height:{default:48},width:{default:220},transitionDuration:{default:300},transitionTimingFunction:{default:"ease-in-out"}},setup(r){const a=r,n=S(()=>{const{width:l,height:s}=a;return{width:`${l}px`,height:`${s}px`}}),c=S(()=>({width:`${a.logoWidth}px`}));return(l,s)=>(o(),f("div",{class:"basic-layout-logo",style:D(n.value)},[u("div",{class:"basic-layout-logo__img",style:D(c.value)},[u("img",{src:e(X).logo,alt:"/"},null,8,Lt)],4),u("div",{class:"basic-layout-logo__title",style:D({display:l.showTitle?"block":"none"})},R(e(Se).projectTitle),5)],4))}}),Bt=T({__name:"notification",setup(r){const a=q("1");return(n,c)=>{const l=g("el-badge"),s=g("el-tab-pane"),m=g("el-tabs"),t=g("el-popover");return o(),f("div",null,[i(t,{placement:"bottom",width:300,trigger:"click","show-arrow":!1},{reference:d(()=>[i(l,{"is-dot":""},{default:d(()=>[P(n.$slots,"default")]),_:3})]),default:d(()=>[i(m,{modelValue:a.value,"onUpdate:modelValue":c[0]||(c[0]=p=>a.value=p)},{default:d(()=>[i(s,{label:"通知",name:"1"}),i(s,{label:"消息",name:"2"}),i(s,{label:"代办",name:"3"})]),_:1},8,["modelValue"])]),_:3})])}}}),Dt={class:"basic-layout-header__wrapper"},Ft={class:"basic-layout-header__left"},Wt={key:1,class:"horizontal-menu"},At={class:"basic-layout-header__right"},Ot=T({__name:"basic-header",setup(r){const a=ee(),{toggleSettingDrawer:n}=a,{isFullscreen:c,toggle:l}=Ve(),{setLayoutConfig:s,layoutConfig:m}=ze(),{isMobile:t,projectConfig:p}=Be(),{menus:y}=Le(S(()=>({type:"top"})));Ce(()=>{c.value=at()});const b=()=>{s("theme",m.value.theme==="light"?"dark":"light")};return(z,L)=>{const v=g("el-button"),I=g("el-tooltip"),_=g("el-space");return o(),f("div",Dt,[u("div",Ft,[P(z.$slots,"logo",{},()=>[e(m).layoutMode===e(k).Top?(o(),x(e(ae),{key:0})):w("v-if",!0)]),w(" 面包屑导航 "),e(m).showBreadCrumb&&!e(t)&&[e(k).Side,e(k).SideMix].includes(e(m).layoutMode)?(o(),x(e(kt),{key:0,style:{"padding-left":"15px"}})):w("v-if",!0),[e(k).Top].includes(e(m).layoutMode)||e(k).TopMix===e(m).layoutMode&&e(m).splitMenu?(o(),f("div",Wt,[i(e(ge),{menus:e(y),mode:"horizontal","menu-type":"top","is-split":e(m).splitMenu},null,8,["menus","is-split"])])):w("v-if",!0)]),u("div",At,[i(_,null,{default:d(()=>[i(I,{effect:"dark",content:"消息通知",placement:"bottom"},{default:d(()=>[i(Bt,null,{default:d(()=>[i(v,{icon:e(je),circle:""},null,8,["icon"])]),_:1})]),_:1}),i(I,{effect:"dark",content:e(c)?"退出全屏":"全屏",placement:"bottom"},{default:d(()=>[i(v,{icon:e(Ge),circle:"",onClick:e(l)},null,8,["icon","onClick"])]),_:1},8,["content"]),i(I,{effect:"dark",content:e(m).theme==="light"?"切换为暗黑模式":"切换为亮色模式",placement:"bottom"},{default:d(()=>[i(v,{circle:"",onClick:b},{default:d(()=>[e(m).theme==="light"?(o(),x(e(j),{key:0,icon:"svg.sun",size:14})):(o(),x(e(j),{key:1,icon:"svg.moon",size:14}))]),_:1})]),_:1},8,["content"]),e(p).defaultLayoutSetting.showSettingButton?(o(),x(I,{key:0,effect:"dark",content:"页面配置",placement:"bottom"},{default:d(()=>[i(v,{icon:e(Ke),circle:"",onClick:e(n)},null,8,["icon","onClick"])]),_:1})):w("v-if",!0),i(e(wt))]),_:1})])])}}}),Et={},Nt=r=>(fe("data-v-4dae3501"),r=r(),ve(),r),Vt={className:"drawer-icon drawer-icon-left-side-mix"},Rt=Nt(()=>u("div",{className:"drawer-icon-left-side-mix__side"},null,-1)),Ut=[Rt];function qt(r,a){return o(),f("div",Vt,Ut)}const jt=B(Et,[["render",qt],["__scopeId","data-v-4dae3501"]]),Gt={},Kt={className:"drawer-icon drawer-icon-top"};function Yt(r,a){return o(),f("div",Kt)}const Zt=B(Gt,[["render",Yt],["__scopeId","data-v-da6c245b"]]),Jt={},Xt={className:"drawer-icon drawer-icon-side-top"};function Qt(r,a){return o(),f("div",Xt)}const ea=B(Jt,[["render",Qt],["__scopeId","data-v-3c84d965"]]),ta={},aa={className:"drawer-icon drawer-icon-side"};function na(r,a){return o(),f("div",aa)}const la=B(ta,[["render",na],["__scopeId","data-v-b53998a0"]]),ia={},oa={viewBox:"64 64 896 896",focusable:"false","data-icon":"check",width:"1em",height:"1em",fill:"currentColor","aria-hidden":"true"},sa=u("path",{d:"M912 190h-69.9c-9.8 0-19.1 4.5-25.1 12.2L404.7 724.5 207 474a32 32 0 00-25.1-12.2H112c-6.7 0-10.4 7.7-6.3 12.9l273.9 347c12.8 16.2 37.4 16.2 50.3 0l488.4-618.9c4.1-5.1.4-12.8-6.3-12.8z"},null,-1),da=[sa];function ua(r,a){return o(),f("svg",oa,da)}const ra=B(ia,[["render",ua]]),ca={style:{display:"flex",alignItems:"center",flexWrap:"wrap",cursor:"pointer"}},ma=["onClick"],pa={style:{position:"relative"}},fa={key:0,style:{fontSize:"20px",position:"absolute",right:0,bottom:"-4%",color:"#1677ff",zIndex:1,cursor:"pointer"}},va=T({__name:"check-button-group",props:_e({modelValue:{},options:{}},{modelValue:{},modelModifiers:{}}),emits:_e(["change"],["update:modelValue"]),setup(r,{emit:a}){const n=a,c=Ae(r,"modelValue"),l=s=>{c.value=s,n("change",s)};return(s,m)=>{const t=g("el-tooltip");return o(),f("div",ca,[(o(!0),f(G,null,te(s.options,(p,y)=>(o(),f("div",{key:y,style:{marginRight:"30px",fontSize:"30px"},onClick:b=>l(p.value)},[i(t,{effect:"dark",content:p.title,style:{position:"relative"}},{default:d(()=>[u("div",pa,[p.value==c.value?(o(),f("div",fa,[i(e(ra))])):w("v-if",!0),(o(),x(we(p.icon)))])]),_:2},1032,["content"])],8,ma))),128))])}}}),ga={class:"setting-item"},ha={class:"setting-item__label"},_a={class:"setting-item__content"},ya=T({__name:"setting-item",props:{title:{}},setup(r){return(a,n)=>(o(),f("div",ga,[u("div",ha,R(a.title),1),u("div",_a,[P(a.$slots,"default",{},void 0,!0)])]))}}),be=B(ya,[["__scopeId","data-v-e4eaeb19"]]),K=r=>(fe("data-v-b4104ca7"),r=r(),ve(),r),ba={class:"setting"},xa=K(()=>u("div",{class:"setting-title"},"系统布局配置",-1)),ka={class:"setting-body"},wa={class:"setting-item"},Ca=K(()=>u("div",{class:"setting-item__label"},"主题色",-1)),Ta={class:"setting-item__content"},Sa={class:"setting-item is-vertical"},Ma=K(()=>u("div",{class:"setting-item__label"},"导航模式",-1)),za={class:"setting-item__content"},$a={class:"setting-item"},Ha=K(()=>u("div",{class:"setting-item__label"},"折叠菜单",-1)),Ia={class:"setting-item__content"},Pa={class:"setting-item"},La=K(()=>u("div",{class:"setting-item__label"},"是否分割菜单",-1)),Ba={class:"setting-item__content"},Da={class:"setting-item"},Fa=K(()=>u("div",{class:"setting-item__label"},"菜单展开宽度",-1)),Wa={class:"setting-item__content"},Aa={class:"setting-item"},Oa=K(()=>u("div",{class:"setting-item__label"},"头部高度",-1)),Ea={class:"setting-item__content"},Na={class:"setting-item"},Va=K(()=>u("div",{class:"setting-item__label"},"显示面包屑导航",-1)),Ra={class:"setting-item__content"},Ua={class:"setting-item"},qa=K(()=>u("div",{class:"setting-item__label"},"标签页高度",-1)),ja={class:"setting-item__content"},Ga={class:"setting-footer"},Ka=T({__name:"setting-draver",setup(r){const{message:a,messageBox:n}=et(),c=ee(),{layoutConfig:l,setLayoutConfig:s,getProjectSetting:m,resetLayoutConfig:t}=ze(),{isOpenSettig:p}=Q(c),y=[{title:"侧边栏布局",value:k.Side,icon:la},{title:"顶部菜单布局",value:k.Top,icon:Zt},{title:"顶部混合菜单",value:k.TopMix,icon:ea},{title:"左侧菜单混合",value:k.SideMix,icon:jt}],b=()=>{lt(JSON.stringify(m(),null,2),{success:()=>{n.confirm("复制成功,请到 src/config/project-setting.ts 中修改配置！","复制成功",{showCancelButton:!1,confirmButtonText:"确认",type:"success"})}})},z=()=>{t(),a.success("重置成功")};return(L,v)=>{const I=g("el-color-picker"),_=g("el-switch"),H=g("el-input-number"),M=g("el-button"),F=g("el-space"),W=g("el-drawer");return o(),x(W,{"model-value":e(p),"with-header":!1,direction:"rtl",size:"370px"},{default:d(()=>[u("div",ba,[xa,u("div",ka,[u("div",wa,[Ca,u("div",Ta,[i(I,{"model-value":e(l).themeColor,onChange:v[0]||(v[0]=h=>e(s)(e(E).THEME_COLOR,h))},null,8,["model-value"])])]),u("div",Sa,[Ma,u("div",za,[i(va,{"model-value":e(l).layoutMode,options:y,onChange:v[1]||(v[1]=h=>e(s)(e(E).LAYOUT_MODE,h))},null,8,["model-value"])])]),u("div",$a,[Ha,u("div",Ia,[i(_,{"model-value":e(l).collapsed,onChange:v[2]||(v[2]=h=>e(s)(e(E).COLLAPSED,h))},null,8,["model-value"])])]),u("div",Pa,[La,u("div",Ba,[i(_,{"model-value":e(l).splitMenu,disabled:e(k).TopMix!==e(l).layoutMode,onChange:v[3]||(v[3]=h=>e(s)(e(E).SPLIT_MENU,h))},null,8,["model-value","disabled"])])]),u("div",Da,[Fa,u("div",Wa,[i(H,{"model-value":e(l).asideWidth,onChange:v[4]||(v[4]=h=>e(s)(e(E).MENU_WIDTH,h))},null,8,["model-value"])])]),u("div",Aa,[Oa,u("div",Ea,[i(H,{"model-value":e(l).headerHeight,onChange:v[5]||(v[5]=h=>e(s)(e(E).HEADER_HEIGHT,h))},null,8,["model-value"])])]),u("div",Na,[Va,u("div",Ra,[i(_,{"model-value":e(l).showBreadCrumb,onChange:v[6]||(v[6]=h=>e(s)(e(E).SHOW_BREAD_CRUMB,h))},null,8,["model-value"])])]),i(be,{title:"标签页显示"},{default:d(()=>[i(_,{"model-value":e(l).showTagPage,onChange:v[7]||(v[7]=h=>e(s)(e(E).SHOW_TAB_PAGE,h))},null,8,["model-value"])]),_:1}),i(be,{title:"显示页脚"},{default:d(()=>[i(_,{"model-value":e(l).showFooter,onChange:v[8]||(v[8]=h=>e(s)(e(E).SHOW_FOOTER,h))},null,8,["model-value"])]),_:1}),u("div",Ua,[qa,u("div",ja,[i(H,{"model-value":e(l).tabBarHeight,onChange:v[9]||(v[9]=h=>e(s)(e(E).TAB_BAR_HEIGHT,h))},null,8,["model-value"])])])]),u("div",Ga,[i(F,{style:{width:"100%"},fill:"",direction:"vertical"},{default:d(()=>[i(M,{icon:e(Ye),type:"primary",onClick:b},{default:d(()=>[V("复制")]),_:1},8,["icon"]),i(M,{icon:e(Pe),type:"warning",onClick:z},{default:d(()=>[V("重置")]),_:1},8,["icon"])]),_:1})])])]),_:1},8,["model-value"])}}}),Ya=B(Ka,[["__scopeId","data-v-b4104ca7"]]),Za={class:"basic-layout-footer__wrapper"},Ja={class:"basic-layout-footer__content"},Xa=T({__name:"footer",setup(r){return(a,n)=>(o(),f("div",Za,[u("div",Ja,[P(a.$slots,"default",{},()=>[V(" Copyright 2021 - "+R(new Date().getFullYear())+" by 青衫依旧 ",1)])])]))}}),Qa={class:"basic-layout-tabs__wrapper"},en={class:"tabs-bar-container"},tn={class:"tab-scroll"},an=["onContextmenu"],nn={key:0,class:"icon"},ln={class:"tabs-bar__operate"},on={class:"operate-btn"},sn=T({__name:"tab-page",props:{fontSize:{default:14}},setup(r){const a=q(),n=Me(),{reload:c}=it(),{getTabPages:l,getCurrentActivityTabPage:s}=Q(n),{isAffixTab:m,addTabPage:t,goTabPage:p,removeTabPage:y,removeAllTabPage:b,removeOhterTabPages:z,removeLeftAllTabPages:L,removeRightAllTabPages:v}=n,I=He(),_=q(""),H=q([]),M=C=>{var $,U;const re=C==="operate"?($=s.value)==null?void 0:$.fullPath:_.value,le=l.value.findIndex(A=>A.fullPath===re),O=C==="operate"?!0:((U=s.value)==null?void 0:U.fullPath)===_.value,ie=l.value.filter(A=>m(A)).length,oe=ie===l.value.length;return[{title:"重新加载",command:"reload",onClick:c,disabled:!O,icon:"ep.refresh"},{title:"关闭其他",command:"closeOtherstabs",icon:"ep.close",onClick:()=>{z()},disabled:oe||!O},{title:"关闭左侧",command:"closeLefttabs",onClick:()=>{L()},disabled:!O||le<=ie,icon:()=>N(Z,{size:12,style:{transform:"rotate(-90deg)"}},()=>N(de))},{title:"关闭右侧",command:"closeRighttabs",onClick:v,disabled:!O||le===l.value.length-1,icon:()=>N(Z,{size:12,style:{transform:"rotate(90deg)"}},()=>N(de))},{title:"关闭全部",command:"closeAlltabs",onClick:b,disabled:oe,icon:"ep.circle-close"}]};Ce(()=>{W(),pe(()=>I,C=>{if(C.name===ue)return;const $=C.matched.find(U=>U.name===C.name);t({name:C.name,fullPath:C.fullPath,query:C.query,params:C.params,meta:($==null?void 0:$.meta)||{}})},{deep:!0,immediate:!0})});function F(C,$){C.preventDefault(),_.value=$,a.value.show(C)}function W(){function C(){return qe.getRoutes().filter($=>$.meta.affixTab)}H.value=[],C().forEach($=>{t({name:$.name,fullPath:$.path,query:{},params:{},meta:$.meta}),H.value.push($.path)})}const h=C=>{if(!C.index)return;const $=l.value[Number(C.index)];p($)},he=C=>{const $=l.value.findIndex(U=>U.fullPath===C);y($)};return(C,$)=>{var U;const re=g("el-tab-pane"),le=g("el-tabs"),O=g("el-dropdown-item"),ie=g("el-dropdown-menu"),oe=g("el-dropdown");return o(),f("div",Qa,[u("div",en,[u("div",tn,[i(le,{"model-value":(U=e(s))==null?void 0:U.fullPath,type:"card",class:"tabs-content",onTabClick:h,onTabRemove:he},{default:d(()=>[(o(!0),f(G,null,te(e(l),A=>(o(),x(re,{key:A.fullPath,name:A.fullPath,closable:!H.value.includes(A.fullPath)},{label:d(()=>[u("div",{class:"tab-item",onContextmenu:De=>F(De,A.fullPath)},[A.meta.icon?(o(),f("span",nn,[i(e(j),{icon:A.meta.icon,size:C.fontSize},null,8,["icon","size"])])):w("v-if",!0),u("span",{style:D({fontSize:`${C.fontSize}px`})},R(A.meta.title),5)],40,an)]),_:2},1032,["name","closable"]))),128))]),_:1},8,["model-value"])]),i(e(tt),{ref_key:"contextRef",ref:a,menus:M("contextmenu"),"item-height":25,"font-size":12,style:{width:"80px","font-size":"12px"}},null,8,["menus"]),u("div",ln,[i(oe,{style:{height:"100%"}},{dropdown:d(()=>[i(ie,{class:"tabs-more"},{default:d(()=>[i(O,{command:"reload",onClick:e(c)},{default:d(()=>[i(e(Z),null,{default:d(()=>[i(e(Pe))]),_:1}),V(" 重新加载 ")]),_:1},8,["onClick"]),i(O,{command:"closeOtherstabs",onClick:e(z)},{default:d(()=>[i(e(Z),null,{default:d(()=>[i(e(Ze))]),_:1}),V(" 关闭其他 ")]),_:1},8,["onClick"]),i(O,{command:"closeLefttabs",onClick:e(L)},{default:d(()=>[i(e(Z),{style:D({transform:"rotate(-90deg)"})},{default:d(()=>[i(e(de))]),_:1},8,["style"]),V(" 关闭左侧 ")]),_:1},8,["onClick"]),i(O,{command:"closeRighttabs",onClick:e(v)},{default:d(()=>[i(e(Z),{style:D({transform:"rotate(90deg)"})},{default:d(()=>[i(e(de))]),_:1},8,["style"]),V(" 关闭右侧 ")]),_:1},8,["onClick"]),i(O,{command:"closeAlltabs",onClick:e(b)},{default:d(()=>[i(e(Z),null,{default:d(()=>[i(e(Je))]),_:1}),V(" 关闭全部 ")]),_:1},8,["onClick"])]),_:1})]),default:d(()=>[u("span",on,[w(" <el-icon><ArrowDown /></el-icon> "),i(e(j),{icon:"ep.arrow-down",size:16})])]),_:1})])])])}}}),dn=B(sn,[["__scopeId","data-v-3d62d94e"]]),un=r=>(fe("data-v-56201e4a"),r=r(),ve(),r),rn={class:"basic-layout-aside__wrapper"},cn={class:"scroll-wrapper"},mn={class:"basic-layout-aside__menus"},pn={class:"trigger"},fn=un(()=>u("div",null,null,-1)),vn=T({__name:"sidebar",props:{collapsed:{type:Boolean,default:!1}},setup(r){const a=r,n=ee(),{layoutConfig:c}=Q(n),{menus:l}=Le(S(()=>({type:"left"})));return(s,m)=>{const t=g("el-scrollbar"),p=g("el-icon"),y=g("el-button");return o(),f("div",rn,[P(s.$slots,"logo",{},void 0,!0),u("div",cn,[i(t,null,{default:d(()=>[u("div",mn,[i(e(ge),{collapsed:a.collapsed,menus:e(l)},null,8,["collapsed","menus"])])]),_:1})]),P(s.$slots,"trigger",{},()=>[u("div",pn,[i(y,{text:"",bg:"",onClick:m[0]||(m[0]=b=>e(n).setLayoutConfig({collapsed:!e(c).collapsed}))},{default:d(()=>[i(p,{size:14},{default:d(()=>[e(c).collapsed?(o(),x(e(Xe),{key:1})):(o(),x(e(Qe),{key:0}))]),_:1})]),_:1})])],!0),fn])}}}),xe=B(vn,[["__scopeId","data-v-56201e4a"]]),gn={},hn={xmlns:"http://www.w3.org/2000/svg",xmlnsXlink:"http://www.w3.org/1999/xlink","aria-hidden":"true",role:"img",className:"iconify iconify--ri",width:"1em",height:"1em",preserveAspectRatio:"xMidYMid meet",viewBox:"0 0 24 24"},_n=u("path",{fill:"currentColor",d:"M18 3v2h-1v6l2 3v2h-6v7h-2v-7H5v-2l2-3V5H6V3z"},null,-1),yn=[_n];function bn(r,a){return o(),f("svg",hn,yn)}const xn=B(gn,[["render",bn]]),kn={class:"basic-layout-mix-menu-module",style:{width:"90px"}},wn=["onClick"],Cn={class:"basic-layout-mix-menu-module__line"},Tn={class:"basic-layout-mix-menu-children__content"},Sn=T({__name:"menu",props:{menuWidth:{},headerHeight:{}},setup(r){const a=ee(),{layoutConfig:n}=Q(a),{getMenus:c}=$e(),l=He(),s=ne(),m=q(l.name),t=q(!1),p=q([]),y=S(()=>c()),b=Ie((_,H,M)=>{const F=M[0];m.value=F.name,p.value=L(),p.value.length===0&&(t.value=!1)});Te(()=>{b()}),pe(t,_=>{a.setShowMixChildrenMenu(_)});const z=_=>{if(_.name){if(t.value=!1,m.value=_.name,p.value=L(),p.value.length===0){t.value=!1,s.push({name:_.name,query:{}});return}t.value=!0}};function L(){const _=y.value.find(F=>F.name===m.value);if(!_)return[];const{children:H=[],meta:M}=_;return M!=null&&M.hideChildrenInMenu&&H!=null&&H.length&&(H==null?void 0:H.length)<=1?[]:H}const v=()=>{n.value.sideMixFixedMenu&&t.value||(t.value=!1)},I=()=>{a.setLayoutConfig({sideMixFixedMenu:!a.layoutConfig.sideMixFixedMenu})};return(_,H)=>(o(),f("div",{class:"basic-layout-mix-menu",tabindex:-1,onBlur:v},[w(""),u("div",kn,[(o(!0),f(G,null,te(y.value,(M,F)=>{var W,h;return o(),f("div",{key:F,class:se(["basic-layout-mix-menu-module__item",M.name===m.value?"is-active":""]),onClick:he=>z(M)},[u("div",{class:se([M.name===m.value?"is-active":"","basic-layout-mix-menu-module__icon"])},[i(e(j),{icon:(W=M.meta)==null?void 0:W.icon,size:20},null,8,["icon"])],2),u("div",{class:se([M.name===m.value?"is-active":"","basic-layout-mix-menu-module__label"])},R((h=M.meta)==null?void 0:h.title),3),ke(u("div",Cn,null,512),[[Oe,M.name===m.value]])],10,wn)}),128))]),u("div",{class:se(["basic-layout-mix-menu-children",t.value?"is-show":""]),style:D({width:t.value?`${_.menuWidth}px`:"0px"})},[u("div",Tn,[u("div",{class:"basic-layout-mix-menu-children-header",style:D({height:_.headerHeight+"px"})},[u("div",{class:"basic-layout-mix-menu-children-header-icon",style:D({color:"rgba(0, 0, 0, 0.35)"}),onClick:I},[i(xn)],4)],4),i(e(ge),{menus:p.value},null,8,["menus"])])],6)],32))}}),Mn=B(Sn,[["__scopeId","data-v-7b895ce6"]]),zn={class:"mix-sidebar basic-layout-aside__wrapper"},$n=T({__name:"mix-sidebar",setup(r){const{layoutConfig:a}=Q(ee());return(n,c)=>(o(),f("div",zn,[i(ae,{"show-title":!1,"logo-width":90,height:e(a).headerHeight},null,8,["height"]),i(Mn,{"header-height":e(a).headerHeight,"menu-width":e(a).asideWidth},null,8,["header-height","menu-width"])]))}}),Hn={class:"page-container"},In={key:0,class:"mobile-menu"},Pn={class:"basic-layout-main__wrapper"},Ln=T({__name:"basic-layout",setup(r){const a=vt("BasicLayout"),{layoutConfig:n,mixMenuLayoutConfig:c}=Q(ee()),{isMobile:l}=Be(),s=q(!1);pe(l,()=>{n.value.layoutMode&&![k.Top].includes(n.value.layoutMode)&&(s.value=l.value)},{immediate:!0});const m=()=>{s.value=!s.value},t=S(()=>({fontSize:12})),p=S(()=>{const{layoutMode:b,asideWidth:z=220,collapsed:L,headerHeight:v,tabBarHeight:I=0,footerHeight:_}=e(n),H=78,M=90,{sideMixFixedMenu:F}=e(n),{showTagPage:W}=n.value;return{[k.Side]:()=>{const h=l.value?0:L?H:z;return{footerHeight:_,headerHeight:v,tabHeight:W?I:0,asideWidth:h,headerPaddingLeft:h,headerZIndex:1001}},[k.TopMix]:()=>{const h=l.value?0:L?H:z;return{footerHeight:_,headerHeight:v,tabHeight:W?I:0,asideWidth:h,asidePaddingTop:v,headerZIndex:1003,headerPaddingLeft:0}},[k.Top]:()=>({footerHeight:_,tabHeight:W?I:0,asideWidth:0,headerPaddingLeft:0}),[k.SideMix]:()=>{const h=l.value?0:F&&c.value.showChildren?M+z:M;return{footerHeight:_,headerHeight:v,tabHeight:W?I:0,asideWidth:h,headerPaddingLeft:h}}}[b||k.Side]()}),y=S(()=>{const{layoutMode:b,asideWidth:z,collapsed:L,headerHeight:v}=e(n);return{[k.Side]:()=>({height:v,width:z,showTitle:!L}),[k.SideMix]:()=>({}),[k.TopMix]:()=>({}),[k.Top]:()=>({})}[b||k.Side]()});return(b,z)=>{const L=g("el-drawer"),v=g("el-backtop"),I=Fe("watermark");return o(),f(G,null,[u("div",Hn,[i(e(ft),J(p.value,{config:{footer:e(n).showFooter,header:e(X).defaultLayoutSetting.showHeader,tab:e(n).showTagPage,aside:!!p.value.asideWidth,main:!0}}),{aside:d(()=>[e(l)?(o(),f("div",In,[i(L,{modelValue:s.value,"onUpdate:modelValue":z[0]||(z[0]=_=>s.value=_),direction:"ltr","with-header":!1,size:e(n).asideWidth||250},{default:d(()=>[i(e(xe),{collapsed:e(n).collapsed},ce({_:2},[e(k).Side===e(n).layoutMode?{name:"logo",fn:d(()=>[i(e(ae),Y(me(y.value)),null,16)]),key:"0"}:void 0]),1032,["collapsed"])]),_:1},8,["modelValue","size"])])):(o(),f(G,{key:1},[e(n).layoutMode&&![e(k).Top,e(k).SideMix].includes(e(n).layoutMode)?(o(),x(e(xe),{key:0,collapsed:e(n).collapsed},ce({_:2},[e(k).Side===e(n).layoutMode?{name:"logo",fn:d(()=>[i(e(ae),Y(me(y.value)),null,16)]),key:"0"}:void 0]),1032,["collapsed"])):w("v-if",!0),e(n).layoutMode&&[e(k).SideMix].includes(e(n).layoutMode)?(o(),x(e($n),{key:1})):w("v-if",!0)],64))]),header:d(()=>[i(e(Ot),{onMobileDrawer:m},ce({_:2},[e(k).TopMix===e(n).layoutMode?{name:"logo",fn:d(()=>[i(e(ae),{width:e(n).asideWidth},null,8,["width"])]),key:"0"}:void 0]),1024)]),tabs:d(()=>[i(e(dn),Y(me(t.value)),null,16)]),footer:d(()=>[i(e(Xa))]),default:d(()=>[ke((o(),f("div",Pn,[(o(),x(we(e(a))))])),[[I,{content:e(Se).projectTitle}]])]),_:1},16,["config"])]),w(" 回到顶部 "),e(X).defaultLayoutSetting.showBackTop?(o(),x(v,{key:0})):w("v-if",!0),w(" 设置 "),e(X).defaultLayoutSetting.showSettingButton?(o(),x(e(Ya),{key:1})):w("v-if",!0)],64)}}}),On=B(Ln,[["__scopeId","data-v-3ec464f9"]]);export{On as default};
