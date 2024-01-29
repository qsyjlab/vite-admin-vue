import{d as H,h as N,y as pe,g as L,m as e,D as _,aH as Oe,o as d,c as g,k as f,I as s,w as m,at as fe,av as j,aD as he,F as G,b,e as M,aj as Te,J as He,M as te,r as D,az as U,b4 as Re,O as A,t as Y,j as Le,a as K,E as ae,ag as Ue,A as Se,n as ue,ak as Fe,p as ve,q as ge}from"./framework.kGBdJdCt.js";import{r as B,_ as Q,A as J,h as y,o as F,k as Ee,x as Ne,D as Pe,a as be,C as Ze,y as Ye,E as _e,d as q,m as qe,g as Ge,t as je,b as Ke,c as le,T as Ie,H as ce,e as ze,Q as Je,f as $e,i as De}from"./index.mdm6ka2m.js";import{J as Qe,K as Xe,A as et,C as ee,r as tt,q as at,v as de,x as nt,L as lt,M as ot}from"../app.4OzQX80d.js";import{m as it}from"./index-f62365c4.uRTyQ08r.js";import"./theme.IDZC-AZR.js";function st(){return!!(document.fullscreenElement||document.webkitFullscreenElement||document.mozFullScreenElement||document.msFullscreenElement)}const xe=$e,{getColorString:ut}=De;function dt(u,o,a){const i=xe(u),n=i.hue(),l=i.saturationv(),p=i.value(),t=2,r=100,c=9,v=100,x=30;function h(z,C){let w;return n>=60&&n<=240?w=z?n-t*C:n+t*C:w=z?n+t*C:n-t*C,w<0?w+=360:w>=360&&(w-=360),Math.round(w)}function E(z,C){let w;return z?w=l<=c?l:l-(l-c)/5*C:w=l+(r-l)/4*C,w}function I(z,C){return z?p+(v-p)/5*C:p<=x?p:p-(p-x)/4*C}const T=o<6,V=T?6-o:o-6,P=o===6?i:xe({h:h(T,V),s:E(T,V),v:I(T,V)});return ut(P,a)}var Ae=dt;const re=$e,rt=Ae,{getColorString:ct}=De;function mt(u,o,a){const i=re(rt(u,10-o+1)),n=re(u),l=n.hue(),p=n.saturationv(),t=re({h:n.hue(),s:v(6),v:n.value()}).saturationv(),r=Math.ceil((t-9)/4),c=Math.ceil((100-t)/5);function v(h){if(h<6)return t+(6-h)*c;if(h===6){if(l>=0&&l<50)return p-15;if(l>=50&&l<191)return p-20;if(l>=191&&l<=360)return p-15}return t-r*(h-6)}const x=re({h:i.hue(),s:v(o),v:i.value()});return ct(x,a)}var ft=mt;const Ce=Ae,ke=ft;function ht(u,o={}){const{dark:a,list:i,index:n=6,format:l="hex"}=o;if(i){const p=[],t=a?ke:Ce;for(let r=1;r<=10;r++)p.push(t(u,r,l));return p}return a?ke(u,n,l):Ce(u,n,l)}var pt=ht;const vt=pt;var Me=vt;const gt=u=>{const o=document.documentElement.style;return{setElementCssVar:(a,i)=>{let n=[];i==="light"?n=Me(a,{index:10,list:!0,dark:!1}):(n=Me(a,{index:10,list:!0,dark:!0}),n.unshift(a)),o.setProperty("--el-color-primary",n[0]);for(let l=1;l<=9;l++)o.setProperty(`--el-color-primary-light-${l}`,n[l])},removeElementCssVar:()=>{o.removeProperty("--el-color-primary");for(let a=1;a<=9;a++)o.removeProperty(`--el-color-primary-light-${a}`)}}},$={LAYOUT_MODE:"layoutMode",COLLAPSED:"collapsed",MENU_WIDTH:"asideWidth",LAYOUT_THEME:"theme",HEADER_HEIGHT:"headerHeight",THEME_COLOR:"themeColor",TAB_BAR_HEIGHT:"tabBarHeight",SPLIT_MENU:"splitMenu"};function Ve(){const u=J(),{setElementCssVar:o,removeElementCssVar:a}=gt(),{layoutConfig:i}=Q(u),n=qe({storageKey:"LAYOUT_THEME",storage:localStorage}),l=Ge(n);function p(r,c){switch(r){case $.SPLIT_MENU:return{splitMenu:c};case $.COLLAPSED:return{collapsed:c};case $.MENU_WIDTH:return{asideWidth:c};case $.HEADER_HEIGHT:return{headerHeight:c};case $.LAYOUT_MODE:return c!==y.TopMix?{splitMenu:void 0,layoutMode:c}:{layoutMode:c};case $.THEME_COLOR:return o(c),{themeColor:c};case $.LAYOUT_THEME:return c==="dark"&&!n.value?(l(),a(),i.value.themeColor&&o(i.value.themeColor)):c==="light"&&n.value&&(l(),i.value.themeColor&&o(i.value.themeColor)),{theme:c};case $.TAB_BAR_HEIGHT:return{tabBarHeight:c};default:return null}}const t=(r,c)=>{const v=p(r,c);v&&u.setLayoutConfig(v)};return{initLayout:r=>{u.setLayoutConfig(r);const c=r.themeColor||i.value.themeColor;c&&t($.THEME_COLOR,c);const v=r.theme||i.value.theme;t($.LAYOUT_THEME,v)},layoutConfig:i,setLayoutConfig:t}}function _t(){const{replace:u,currentRoute:o}=le();function a(){const{query:i,params:n={},fullPath:l,name:p}=e(o);if(p===ce)return Promise.resolve(!1);const t={...n};return p&&Object.keys(n).length>0?(t._origin_params=JSON.stringify(n??{}),t._redirect_type="name",t.path=String(p)):(t._redirect_type="path",t.path=l),u({name:ce,params:t,query:i}).then(()=>Promise.resolve(!0))}return{reload:a}}const yt={};function bt(u,o){return d(),g("div",te({class:"layout-container"},u.$attrs),[D(u.$slots,"default")],16)}const xt=B(yt,[["render",bt]]),Ct=H({__name:"layout-header",props:{fixed:{type:Boolean,default:!0},zIndex:{default:1001},minWidth:{default:1200},height:{default:56},paddingLeft:{default:200},transitionDuration:{default:200},transitionTimingFunction:{default:"ease-in-out"}},setup(u){const o=u,a=L(()=>{const{fixed:i,zIndex:n,height:l,paddingLeft:p,transitionDuration:t,transitionTimingFunction:r}=o;return`position: ${i?"fixed":"static"};z-index: ${n};height: ${l}px;padding-left: ${p}px;transition-duration: ${t}ms;transition-timing-function: ${r};box-sizing: border-box;`});return(i,n)=>(d(),g("div",{class:"layout-header",style:A(a.value)},[D(i.$slots,"default")],4))}}),kt=H({__name:"layout-tabs",props:{fixed:{type:Boolean,default:!0},top:{default:56},zIndex:{default:999},minWidth:{default:0},height:{default:56},paddingLeft:{default:0},transitionDuration:{default:200},transitionTimingFunction:{default:"ease-in-out"}},setup(u){const o=u,a=L(()=>{const{fixed:i,top:n,zIndex:l,minWidth:p,height:t,paddingLeft:r,transitionDuration:c,transitionTimingFunction:v}=o;return`position: ${i?"fixed":"static"};top: ${n}px;z-index: ${l};min-width: ${p}px;height: ${t}px;padding-left: ${r}px;transition-duration: ${c}ms;transition-timing-function: ${v};box-sizing: border-box;`});return(i,n)=>(d(),g("div",{class:"layout-tab",style:A(a.value)},[D(i.$slots,"default")],4))}}),Mt=H({__name:"layout-sidebar",props:{zIndex:{default:1002},width:{default:200},paddingTop:{default:0},transitionDuration:{default:200},transitionTimingFunction:{default:"ease-in-out"}},setup(u){const o=u,a=L(()=>{const{zIndex:i,width:n,paddingTop:l,transitionDuration:p,transitionTimingFunction:t}=o;return{zIndex:i,transitionTimingFunction:t,transitionDuration:`${p}ms`,width:`${n}px`,paddingTop:`${l}px`}});return(i,n)=>(d(),g("div",{class:"layout-sidebar",style:A(a.value)},[D(i.$slots,"default")],4))}}),wt=H({__name:"layout-main",props:{paddingTop:{default:0},paddingBottom:{default:0},paddingLeft:{default:200},transitionDuration:{default:200},transitionTimingFunction:{default:"ease-in-out"}},setup(u){const o=u,a=L(()=>{const{paddingTop:i,paddingBottom:n,paddingLeft:l,transitionDuration:p,transitionTimingFunction:t}=o;return`padding-top: ${i}px;padding-bottom: ${n}px;padding-left: ${l}px;transition-duration: ${p}ms;transition-timing-function: ${t};`});return(i,n)=>(d(),g("div",{class:"layout-main",style:A(a.value)},[D(i.$slots,"default")],4))}}),Tt=H({__name:"layout-footer",props:{fixed:{type:Boolean,default:!0},zIndex:{default:999},minWidth:{default:1200},height:{default:56},paddingLeft:{default:0},transitionDuration:{default:200},transitionTimingFunction:{default:"ease-in-out"}},setup(u){const o=u,a=L(()=>{const{zIndex:i,height:n,paddingLeft:l,transitionDuration:p,transitionTimingFunction:t}=o;return` z-index: ${i};;height: ${n}px;padding-left: ${l}px;transition-duration: ${p}ms;transition-timing-function: ${t};box-sizing: border-box;`});return(i,n)=>(d(),g("div",{class:"layout-footer",style:A(a.value)},[D(i.$slots,"default")],4))}}),Ht=H({__name:"layout",props:{asideWidth:{default:220},asidePaddingTop:{default:0},headerHeight:{default:48},headerPaddingLeft:{},headerZIndex:{default:1001},tabHeight:{default:32},footerHeight:{},config:{default:()=>({header:!0,tab:!0,aside:!0,main:!0,footer:!0})}},setup(u){const o=u,a=L(()=>({width:o.asideWidth,paddingTop:o.asidePaddingTop})),i=L(()=>({paddingLeft:o.headerPaddingLeft,height:o.headerHeight,zIndex:o.headerZIndex})),n=L(()=>({top:o.config.header?o.headerHeight:0,paddingLeft:o.asideWidth,height:o.tabHeight})),l=L(()=>{let t=0;return o.config.header&&(t+=o.headerHeight),o.config.tab&&(t+=o.tabHeight),{paddingLeft:o.asideWidth,paddingTop:t}}),p=L(()=>({paddingLeft:o.asideWidth,height:o.footerHeight}));return(t,r)=>(d(),b(e(xt),null,{default:m(()=>[t.config.aside?(d(),b(e(Mt),j(te({key:0},a.value)),{default:m(()=>[D(t.$slots,"aside")]),_:3},16)):M("v-if",!0),t.config.header?(d(),b(e(Ct),j(te({key:1},i.value)),{default:m(()=>[D(t.$slots,"header")]),_:3},16)):M("v-if",!0),t.config.tab?(d(),b(e(kt),j(te({key:2},n.value)),{default:m(()=>[D(t.$slots,"tabs")]),_:3},16)):M("v-if",!0),t.config.main?(d(),b(e(wt),j(te({key:3},l.value)),{default:m(()=>[D(t.$slots,"default")]),_:3},16)):M("v-if",!0),t.config.footer?(d(),b(e(Tt),j(te({key:4},p.value)),{default:m(()=>[D(t.$slots,"footer")]),_:3},16)):M("v-if",!0)]),_:3}))}}),Lt=u=>{const o=F.keepAliveCachePolicy!=="never";return H({name:u,setup(){const a=Ne(),i=Pe();return()=>U(Ze,{},{default:n=>{if(o){const l=F.keepAliveCachePolicy==="normal"?a.getAliveCache:i.getKeepAliveCache;return U(be,{},()=>U(Re,{include:l},U(n.Component,{key:n.route.fullPath})))}return U(be,{},U(n.Component,{key:n.route.fullPath}))}})}})},St=Symbol();function Et(){return je(St)}function Be(){const u=Et();return{...u,isMobile:L(()=>e(u.isMobile))}}const Pt={class:"breadcrumb-item"},It={key:0,class:"icon"},zt={class:"title"},$t=H({__name:"breadcrumb",setup(u){const o=N([]),a=ze((i,n,l)=>{i.name!==ce&&(o.value=l.filter(p=>p.meta.hideInBreadcrumb!==!0))});return Se(()=>{a()}),(i,n)=>{const l=_("el-breadcrumb-item"),p=_("el-breadcrumb");return d(),b(p,{separator:"/"},{default:m(()=>[(d(!0),g(G,null,ae(o.value,t=>(d(),b(l,{key:t.path,to:{name:t.name}},{default:m(()=>{var r;return[f("div",Pt,[e(F).defaultLayoutSetting.showBreadCrumbIcon?(d(),g("div",It,[s(e(q),{icon:t.meta.icon,size:18},null,8,["icon"])])):M("v-if",!0),f("div",zt,Y((r=t==null?void 0:t.meta)==null?void 0:r.title),1)])]}),_:2},1032,["to"]))),128))]),_:1})}}}),Dt=B($t,[["__scopeId","data-v-ce7ef8bb"]]),At=H({__name:"user-menu",setup(u){const{loginOutSystem:o,userInfo:a}=Ke(),i=le(),n=()=>{o(),i.push({name:"Login"})};return(l,p)=>{const t=_("el-avatar"),r=_("el-space"),c=_("el-button"),v=_("el-dropdown-item"),x=_("el-dropdown-menu"),h=_("el-dropdown");return d(),b(h,{style:{height:"100%"}},{dropdown:m(()=>[s(x,null,{default:m(()=>[s(v,null,{default:m(()=>[K("个人首页")]),_:1}),s(v,{onClick:n},{default:m(()=>[K("退出登录")]),_:1})]),_:1})]),default:m(()=>[s(c,{type:"primary",text:""},{default:m(()=>[s(r,null,{default:m(()=>[s(t,{size:32,src:"https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png"})]),_:1}),f("span",null,Y(e(a).userName),1)]),_:1})]),_:1})}}}),Vt={key:0,class:"icon"},Bt={class:"ellipsis"},Wt={key:0,class:"icon"},Ot={class:"ellipsis"},Rt={key:0,class:"icon"},Ut={class:"ellipsis"},Ft={name:"MenuItem"},Nt=H({...Ft,props:{item:{}},setup(u){const o=a=>{var i,n;return!((i=a.meta)!=null&&i.hideChildrenInMenu)&&!!((n=a.children)!=null&&n.length)};return(a,i)=>{const n=_("el-menu-item"),l=_("menu-item",!0),p=_("el-sub-menu");return o(a.item)?(d(),b(p,{key:1,index:a.item.name},{title:m(()=>{var t,r,c,v;return[(t=a.item.meta)!=null&&t.icon?(d(),g("div",Wt,[s(e(q),{size:18,icon:(r=a.item.meta)==null?void 0:r.icon},null,8,["icon"])])):M("v-if",!0),f("span",Ot,Y((v=(c=a.item)==null?void 0:c.meta)==null?void 0:v.title),1)]}),default:m(()=>[(d(!0),g(G,null,ae(a.item.children,t=>{var r;return d(),g(G,{key:t.name},[(r=t.children)!=null&&r.length?(d(),b(l,{key:1,item:t},null,8,["item"])):(d(),b(n,{key:0,index:t.name,route:{name:t.name}},{title:m(()=>{var c;return[f("span",Ut,Y((c=t==null?void 0:t.meta)==null?void 0:c.title),1)]}),default:m(()=>{var c,v;return[(c=t.meta)!=null&&c.icon?(d(),g("div",Rt,[s(e(q),{size:18,icon:(v=t.meta)==null?void 0:v.icon},null,8,["icon"])])):M("v-if",!0)]}),_:2},1032,["index","route"]))],64)}),128))]),_:1},8,["index"])):(d(),b(n,{key:0,index:a.item.name,route:{name:a.item.name}},{title:m(()=>{var t,r;return[f("span",Bt,Y((r=(t=a.item)==null?void 0:t.meta)==null?void 0:r.title),1)]}),default:m(()=>{var t,r;return[(t=a.item.meta)!=null&&t.icon?(d(),g("div",Vt,[s(e(q),{size:18,icon:(r=a.item.meta)==null?void 0:r.icon},null,8,["icon"])])):M("v-if",!0)]}),_:1},8,["index","route"]))}}}),Zt=B(Nt,[["__scopeId","data-v-d74561c6"]]),ye=H({__name:"menu",props:{collapsed:{type:Boolean,default:!1},menus:{default:()=>[]},menuType:{default:"side"},isSplit:{type:Boolean,default:!1}},setup(u){const o=u,{currentRoute:a}=le(),i=L(()=>{var n;const l=e(a);return o.isSplit&&o.menuType==="top"?(n=l.matched[0])==null?void 0:n.name:l.meta.currentActiveMenu||String(l.name)});return(n,l)=>{const p=_("el-menu");return d(),b(p,{collapse:n.collapsed,"default-active":i.value,"collapse-transition":!1,router:""},{default:m(()=>[(d(!0),g(G,null,ae(n.menus,t=>(d(),b(Zt,{key:t.name,item:t},null,8,["item"]))),128))]),_:1},8,["collapse","default-active"])}}}),Yt=["src"],ne=H({__name:"logo",props:{logoWidth:{default:78},showTitle:{type:Boolean,default:!0},height:{default:48},width:{default:220},transitionDuration:{default:300},transitionTimingFunction:{default:"ease-in-out"}},setup(u){const o=u,a=L(()=>{const{width:n,height:l}=o;return{width:`${n}px`,height:`${l}px`}}),i=L(()=>({width:`${o.logoWidth}px`}));return(n,l)=>(d(),g("div",{class:"basic-layout-logo",style:A(a.value)},[f("div",{class:"basic-layout-logo__img",style:A(i.value)},[f("img",{src:e(F).logo,alt:"/"},null,8,Yt)],4),f("div",{class:"basic-layout-logo__title",style:A({display:n.showTitle?"block":"none"})},Y(e(Ee).projectTitle),5)],4))}}),qt=H({__name:"notification",setup(u){const o=N("1");return(a,i)=>{const n=_("el-badge"),l=_("el-tab-pane"),p=_("el-tabs"),t=_("el-popover");return d(),g("div",null,[s(t,{placement:"bottom",width:300,trigger:"click","show-arrow":!1},{reference:m(()=>[s(n,{"is-dot":""},{default:m(()=>[D(a.$slots,"default")]),_:3})]),default:m(()=>[s(p,{modelValue:o.value,"onUpdate:modelValue":i[0]||(i[0]=r=>o.value=r)},{default:m(()=>[s(l,{label:"通知",name:"1"}),s(l,{label:"消息",name:"2"}),s(l,{label:"代办",name:"3"})]),_:1},8,["modelValue"])]),_:3})])}}}),Gt={class:"basic-layout-header__wrapper"},jt={class:"basic-layout-header__left"},Kt={key:1,class:"horizontal-menu"},Jt={class:"basic-layout-header__right"},Qt=H({__name:"basic-header",setup(u){const o=J(),{toggleSettingDrawer:a}=o,{isFullscreen:i,toggle:n}=Ye(),{layoutConfig:l}=Q(J()),{getMenus:p}=_e(),{setLayoutConfig:t}=Ve(),{isMobile:r,projectConfig:c}=Be();Le(()=>{i.value=st()});const v=()=>{t("theme",l.value.theme==="light"?"dark":"light")},x=L(()=>{const h=p();return l.value.splitMenu&&l.value.layoutMode===y.TopMix?h.map(E=>({...E,children:[]})):h});return(h,E)=>{const I=_("el-button"),T=_("el-tooltip"),V=_("el-space");return d(),g("div",Gt,[f("div",jt,[D(h.$slots,"logo",{},()=>[e(l).layoutMode===e(y).Top?(d(),b(e(ne),{key:0})):M("v-if",!0)]),M(" 面包屑导航 "),e(c).defaultLayoutSetting.showBreadCrumb&&!e(r)&&[e(y).Side,e(y).SideMix].includes(e(l).layoutMode)?(d(),b(e(Dt),{key:0,style:{"padding-left":"15px"}})):M("v-if",!0),[e(y).Top].includes(e(l).layoutMode)||e(y).TopMix===e(l).layoutMode&&e(l).splitMenu?(d(),g("div",Kt,[s(e(ye),{menus:x.value,mode:"horizontal","menu-type":"top","is-split":e(l).splitMenu},null,8,["menus","is-split"])])):M("v-if",!0)]),f("div",Jt,[s(V,null,{default:m(()=>[s(T,{effect:"dark",content:"消息通知",placement:"bottom"},{default:m(()=>[s(qt,null,{default:m(()=>[s(I,{icon:e(Qe),circle:""},null,8,["icon"])]),_:1})]),_:1}),s(T,{effect:"dark",content:e(i)?"退出全屏":"全屏",placement:"bottom"},{default:m(()=>[s(I,{icon:e(Xe),circle:"",onClick:e(n)},null,8,["icon","onClick"])]),_:1},8,["content"]),s(T,{effect:"dark",content:e(l).theme==="light"?"切换为暗黑模式":"切换为亮色模式",placement:"bottom"},{default:m(()=>[s(I,{circle:"",onClick:v},{default:m(()=>[e(l).theme==="light"?(d(),b(e(q),{key:0,icon:"svg.sun",size:14})):(d(),b(e(q),{key:1,icon:"svg.moon",size:14}))]),_:1})]),_:1},8,["content"]),e(c).defaultLayoutSetting.showSettingButton?(d(),b(T,{key:0,effect:"dark",content:"页面配置",placement:"bottom"},{default:m(()=>[s(I,{icon:e(et),circle:"",onClick:e(a)},null,8,["icon","onClick"])]),_:1})):M("v-if",!0),s(e(At))]),_:1})])])}}}),Xt={},ea=u=>(ve("data-v-4dae3501"),u=u(),ge(),u),ta={className:"drawer-icon drawer-icon-left-side-mix"},aa=ea(()=>f("div",{className:"drawer-icon-left-side-mix__side"},null,-1)),na=[aa];function la(u,o){return d(),g("div",ta,na)}const oa=B(Xt,[["render",la],["__scopeId","data-v-4dae3501"]]),ia={},sa={className:"drawer-icon drawer-icon-top"};function ua(u,o){return d(),g("div",sa)}const da=B(ia,[["render",ua],["__scopeId","data-v-da6c245b"]]),ra={},ca={className:"drawer-icon drawer-icon-side-top"};function ma(u,o){return d(),g("div",ca)}const fa=B(ra,[["render",ma],["__scopeId","data-v-3c84d965"]]),ha={},pa={className:"drawer-icon drawer-icon-side"};function va(u,o){return d(),g("div",pa)}const ga=B(ha,[["render",va],["__scopeId","data-v-b53998a0"]]),_a={},ya={viewBox:"64 64 896 896",focusable:"false","data-icon":"check",width:"1em",height:"1em",fill:"currentColor","aria-hidden":"true"},ba=f("path",{d:"M912 190h-69.9c-9.8 0-19.1 4.5-25.1 12.2L404.7 724.5 207 474a32 32 0 00-25.1-12.2H112c-6.7 0-10.4 7.7-6.3 12.9l273.9 347c12.8 16.2 37.4 16.2 50.3 0l488.4-618.9c4.1-5.1.4-12.8-6.3-12.8z"},null,-1),xa=[ba];function Ca(u,o){return d(),g("svg",ya,xa)}const ka=B(_a,[["render",Ca]]),Ma={style:{display:"flex",alignItems:"center",flexWrap:"wrap",cursor:"pointer"}},wa=["onClick"],Ta={style:{position:"relative"}},Ha={key:0,style:{fontSize:"20px",position:"absolute",right:0,bottom:"-4%",color:"#1677ff",zIndex:1,cursor:"pointer"}},La=H({__name:"check-button-group",props:{defaultValue:{},options:{}},emits:["change"],setup(u,{emit:o}){const a=o,i=N(u.defaultValue),n=l=>{i.value=l,a("change",l)};return(l,p)=>{const t=_("el-tooltip");return d(),g("div",Ma,[(d(!0),g(G,null,ae(l.options,(r,c)=>(d(),g("div",{key:c,style:{marginRight:"30px",fontSize:"30px"},onClick:v=>n(r.value)},[s(t,{effect:"dark",content:r.title,style:{position:"relative"}},{default:m(()=>[f("div",Ta,[r.value==i.value?(d(),g("div",Ha,[s(e(ka))])):M("v-if",!0),(d(),b(He(r.icon)))])]),_:2},1032,["content"])],8,wa))),128))])}}}),X=u=>(ve("data-v-bf391da4"),u=u(),ge(),u),Sa={class:"setting-body"},Ea=X(()=>f("div",{class:"setting-title"},"系统布局配置",-1)),Pa={class:"setting-item"},Ia=X(()=>f("div",{class:"setting-item__label"},"主题色",-1)),za={class:"setting-item__content"},$a={class:"setting-item is-vertical"},Da=X(()=>f("div",{class:"setting-item__label"},"导航模式",-1)),Aa={class:"setting-item__content"},Va={class:"setting-item"},Ba=X(()=>f("div",{class:"setting-item__label"},"折叠菜单",-1)),Wa={class:"setting-item__content"},Oa={class:"setting-item"},Ra=X(()=>f("div",{class:"setting-item__label"},"是否分割菜单",-1)),Ua={class:"setting-item__content"},Fa={class:"setting-item"},Na=X(()=>f("div",{class:"setting-item__label"},"菜单展开宽度",-1)),Za={class:"setting-item__content"},Ya={class:"setting-item"},qa=X(()=>f("div",{class:"setting-item__label"},"头部高度",-1)),Ga={class:"setting-item__content"},ja={class:"setting-item"},Ka=X(()=>f("div",{class:"setting-item__label"},"tab bar高度",-1)),Ja={class:"setting-item__content"},Qa=H({__name:"setting-draver",setup(u){const o=J(),{layoutConfig:a,setLayoutConfig:i}=Ve(),{isOpenSettig:n}=Q(o),l=[{title:"侧边栏布局",value:y.Side,icon:ga},{title:"顶部菜单布局",value:y.Top,icon:da},{title:"顶部混合菜单",value:y.TopMix,icon:fa},{title:"左侧菜单混合",value:y.SideMix,icon:oa}];return(p,t)=>{const r=_("el-color-picker"),c=_("el-switch"),v=_("el-input-number"),x=_("el-drawer");return d(),b(x,{modelValue:e(n),"onUpdate:modelValue":t[13]||(t[13]=h=>Ue(n)?n.value=h:null),"with-header":!1,direction:"rtl",size:"370px"},{default:m(()=>[M(" {{ layoutConfig }} "),f("div",Sa,[Ea,f("div",Pa,[Ia,f("div",za,[s(r,{modelValue:e(a).themeColor,"onUpdate:modelValue":t[0]||(t[0]=h=>e(a).themeColor=h),onChange:t[1]||(t[1]=h=>e(i)(e($).THEME_COLOR,h))},null,8,["modelValue"])])]),f("div",$a,[Da,f("div",Aa,[s(La,{"default-value":e(a).layoutMode,options:l,onChange:t[2]||(t[2]=h=>e(i)(e($).LAYOUT_MODE,h))},null,8,["default-value"])])]),f("div",Va,[Ba,f("div",Wa,[s(c,{modelValue:e(a).collapsed,"onUpdate:modelValue":t[3]||(t[3]=h=>e(a).collapsed=h),onChange:t[4]||(t[4]=h=>e(i)(e($).COLLAPSED,h))},null,8,["modelValue"])])]),f("div",Oa,[Ra,f("div",Ua,[s(c,{modelValue:e(a).splitMenu,"onUpdate:modelValue":t[5]||(t[5]=h=>e(a).splitMenu=h),disabled:e(y).TopMix!==e(a).layoutMode,onChange:t[6]||(t[6]=h=>e(i)(e($).SPLIT_MENU,h))},null,8,["modelValue","disabled"])])]),f("div",Fa,[Na,f("div",Za,[s(v,{modelValue:e(a).asideWidth,"onUpdate:modelValue":t[7]||(t[7]=h=>e(a).asideWidth=h),onChange:t[8]||(t[8]=h=>e(i)(e($).MENU_WIDTH,h))},null,8,["modelValue"])])]),f("div",Ya,[qa,f("div",Ga,[s(v,{modelValue:e(a).headerHeight,"onUpdate:modelValue":t[9]||(t[9]=h=>e(a).headerHeight=h),onChange:t[10]||(t[10]=h=>e(i)(e($).HEADER_HEIGHT,h))},null,8,["modelValue"])])]),f("div",ja,[Ka,f("div",Ja,[s(v,{modelValue:e(a).tabBarHeight,"onUpdate:modelValue":t[11]||(t[11]=h=>e(a).tabBarHeight=h),onChange:t[12]||(t[12]=h=>e(i)(e($).TAB_BAR_HEIGHT,h))},null,8,["modelValue"])])])])]),_:1},8,["modelValue"])}}}),Xa=B(Qa,[["__scopeId","data-v-bf391da4"]]),en={class:"basic-layout-footer__wrapper"},tn={class:"basic-layout-footer__content"},an=H({__name:"footer",setup(u){return(o,a)=>(d(),g("div",en,[f("div",tn,[D(o.$slots,"default",{},()=>[K(" Copyright 2021 - "+Y(new Date().getFullYear())+" by 青衫依旧 ",1)])])]))}}),nn={class:"basic-layout-tabs__wrapper"},ln={class:"tabs-bar-container"},on={class:"tab-scroll"},sn=["onContextmenu"],un={key:0,class:"icon"},dn={class:"tabs-bar__operate"},rn={class:"operate-btn"},cn=H({__name:"tab-page",props:{fontSize:{default:14}},setup(u){const o=N(),a=Pe(),{reload:i}=_t(),{getTabPages:n,getCurrentActivityTabPage:l}=Q(a),{isAffixTab:p,addTabPage:t,goTabPage:r,removeTabPage:c,removeAllTabPage:v,removeOhterTabPages:x,removeLeftAllTabPages:h,removeRightAllTabPages:E}=a,I=Ie(),T=N(""),V=N([]),P=k=>{var S,Z;const me=k==="operate"?(S=l.value)==null?void 0:S.fullPath:T.value,oe=n.value.findIndex(O=>O.fullPath===me),R=k==="operate"?!0:((Z=l.value)==null?void 0:Z.fullPath)===T.value,ie=n.value.filter(O=>p(O)).length,se=ie===n.value.length;return[{title:"重新加载",command:"reload",onClick:i,disabled:!R,icon:"ep.refresh"},{title:"关闭其他",command:"closeOtherstabs",icon:"ep.close",onClick:()=>{x()},disabled:se||!R},{title:"关闭左侧",command:"closeLefttabs",onClick:()=>{h()},disabled:!R||oe<=ie,icon:()=>U(ee,{size:12,style:{transform:"rotate(-90deg)"}},()=>U(de))},{title:"关闭右侧",command:"closeRighttabs",onClick:E,disabled:!R||oe===n.value.length-1,icon:()=>U(ee,{size:12,style:{transform:"rotate(90deg)"}},()=>U(de))},{title:"关闭全部",command:"closeAlltabs",onClick:v,disabled:se,icon:"ep.circle-close"}]};Le(()=>{C(),pe(()=>I,k=>{if(k.name===ce)return;const S=k.matched.find(Z=>Z.name===k.name);t({name:k.name,fullPath:k.fullPath,query:k.query,params:k.params,meta:(S==null?void 0:S.meta)||{}})},{deep:!0,immediate:!0})});function z(k,S){k.preventDefault(),T.value=S,o.value.show(k)}function C(){function k(){return Je.getRoutes().filter(S=>S.meta.affixTab)}V.value=[],k().forEach(S=>{t({name:S.name,fullPath:S.path,query:{},params:{},meta:S.meta}),V.value.push(S.path)})}const w=k=>{if(!k.index)return;const S=n.value[Number(k.index)];r(S)},W=k=>{const S=n.value.findIndex(Z=>Z.fullPath===k);c(S)};return(k,S)=>{var Z;const me=_("el-tab-pane"),oe=_("el-tabs"),R=_("el-dropdown-item"),ie=_("el-dropdown-menu"),se=_("el-dropdown");return d(),g("div",nn,[f("div",ln,[f("div",on,[s(oe,{"model-value":(Z=e(l))==null?void 0:Z.fullPath,type:"card",class:"tabs-content",onTabClick:w,onTabRemove:W},{default:m(()=>[(d(!0),g(G,null,ae(e(n),O=>(d(),b(me,{key:O.fullPath,name:O.fullPath,closable:!V.value.includes(O.fullPath)},{label:m(()=>[f("div",{class:"tab-item",onContextmenu:We=>z(We,O.fullPath)},[O.meta.icon?(d(),g("span",un,[s(e(q),{icon:O.meta.icon,size:k.fontSize},null,8,["icon","size"])])):M("v-if",!0),f("span",{style:A({fontSize:`${k.fontSize}px`})},Y(O.meta.title),5)],40,sn)]),_:2},1032,["name","closable"]))),128))]),_:1},8,["model-value"])]),s(e(it),{ref_key:"contextRef",ref:o,menus:P("contextmenu"),"item-height":25,"font-size":12,style:{width:"80px","font-size":"12px"}},null,8,["menus"]),f("div",dn,[s(se,{style:{height:"100%"}},{dropdown:m(()=>[s(ie,{class:"tabs-more"},{default:m(()=>[s(R,{command:"reload",onClick:e(i)},{default:m(()=>[s(e(ee),null,{default:m(()=>[s(e(tt))]),_:1}),K(" 重新加载 ")]),_:1},8,["onClick"]),s(R,{command:"closeOtherstabs",onClick:e(x)},{default:m(()=>[s(e(ee),null,{default:m(()=>[s(e(at))]),_:1}),K(" 关闭其他 ")]),_:1},8,["onClick"]),s(R,{command:"closeLefttabs",onClick:e(h)},{default:m(()=>[s(e(ee),{style:A({transform:"rotate(-90deg)"})},{default:m(()=>[s(e(de))]),_:1},8,["style"]),K(" 关闭左侧 ")]),_:1},8,["onClick"]),s(R,{command:"closeRighttabs",onClick:e(E)},{default:m(()=>[s(e(ee),{style:A({transform:"rotate(90deg)"})},{default:m(()=>[s(e(de))]),_:1},8,["style"]),K(" 关闭右侧 ")]),_:1},8,["onClick"]),s(R,{command:"closeAlltabs",onClick:e(v)},{default:m(()=>[s(e(ee),null,{default:m(()=>[s(e(nt))]),_:1}),K(" 关闭全部 ")]),_:1},8,["onClick"])]),_:1})]),default:m(()=>[f("span",rn,[M(" <el-icon><ArrowDown /></el-icon> "),s(e(q),{icon:"ep.arrow-down",size:16})])]),_:1})])])])}}}),mn=B(cn,[["__scopeId","data-v-3d62d94e"]]),fn=u=>(ve("data-v-a8495fcd"),u=u(),ge(),u),hn={class:"basic-layout-aside__wrapper"},pn={class:"basic-layout-aside__menus"},vn={class:"trigger"},gn=fn(()=>f("div",null,null,-1)),_n=H({__name:"sidebar",props:{collapsed:{type:Boolean,default:!1}},setup(u){const o=u,{currentRoute:a}=le(),{getMenus:i}=_e(),n=J(),{layoutConfig:l}=Q(n),p=L(()=>({height:`calc(100% - ${l.value.headerHeight}px  - 40px)`})),t=L(()=>{var r;const c=i();if(l.value.splitMenu&&l.value.layoutMode===y.TopMix){const v=a.value.matched;return((r=c.find(x=>x.name===v[0].name))==null?void 0:r.children)||[]}return c});return(r,c)=>{const v=_("el-scrollbar"),x=_("el-icon"),h=_("el-button");return d(),g("div",hn,[D(r.$slots,"logo",{},void 0,!0),f("div",{style:A(p.value)},[s(v,null,{default:m(()=>[f("div",pn,[s(e(ye),{collapsed:o.collapsed,menus:t.value},null,8,["collapsed","menus"])])]),_:1})],4),D(r.$slots,"trigger",{},()=>[f("div",vn,[s(h,{text:"",bg:"",onClick:c[0]||(c[0]=E=>e(n).setLayoutConfig({collapsed:!e(l).collapsed}))},{default:m(()=>[s(x,{size:14},{default:m(()=>[e(l).collapsed?(d(),b(e(lt),{key:1})):(d(),b(e(ot),{key:0}))]),_:1})]),_:1})])],!0),gn])}}}),we=B(_n,[["__scopeId","data-v-a8495fcd"]]),yn={},bn={xmlns:"http://www.w3.org/2000/svg",xmlnsXlink:"http://www.w3.org/1999/xlink","aria-hidden":"true",role:"img",className:"iconify iconify--ri",width:"1em",height:"1em",preserveAspectRatio:"xMidYMid meet",viewBox:"0 0 24 24"},xn=f("path",{fill:"currentColor",d:"M18 3v2h-1v6l2 3v2h-6v7h-2v-7H5v-2l2-3V5H6V3z"},null,-1),Cn=[xn];function kn(u,o){return d(),g("svg",bn,Cn)}const Mn=B(yn,[["render",kn]]),wn={class:"basic-layout-mix-menu-module",style:{width:"90px"}},Tn=["onClick"],Hn={class:"basic-layout-mix-menu-module__line"},Ln={class:"basic-layout-mix-menu-children__content"},Sn=H({__name:"menu",props:{menuWidth:{},headerHeight:{}},setup(u){const o=J(),{setMixMenuFixed:a,setMixMenuLayoutConfig:i}=o,{mixMenuLayoutConfig:n}=Q(o),{getMenus:l}=_e(),p=Ie(),t=le(),r=N(p.name),c=N(!1),v=N([]),x=L(()=>l()),h=ze((P,z,C)=>{const w=C[0];r.value=w.name,v.value=I(),v.value.length===0&&(c.value=!1)});Se(()=>{h()}),pe([c],()=>{i({showChildren:c.value})});const E=P=>{if(P.name){if(c.value=!1,r.value=P.name,v.value=I(),v.value.length===0){c.value=!1,t.push({name:P.name,query:{}});return}c.value=!0}};function I(){const P=x.value.find(w=>w.name===r.value);if(!P)return[];const{children:z=[],meta:C}=P;return C!=null&&C.hideChildrenInMenu&&z!=null&&z.length&&(z==null?void 0:z.length)<=1?[]:z}const T=()=>{const{fixedMenu:P}=e(n);P&&c.value||(c.value=!1)},V=()=>{a(!e(n).fixedMenu)};return(P,z)=>(d(),g("div",{class:"basic-layout-mix-menu",tabindex:-1,onBlur:T},[M(""),f("div",wn,[(d(!0),g(G,null,ae(x.value,(C,w)=>{var W,k;return d(),g("div",{key:w,class:ue(["basic-layout-mix-menu-module__item",C.name===r.value?"is-active":""]),onClick:S=>E(C)},[f("div",{class:ue([C.name===r.value?"is-active":"","basic-layout-mix-menu-module__icon"])},[s(e(q),{icon:(W=C.meta)==null?void 0:W.icon,size:20},null,8,["icon"])],2),f("div",{class:ue([C.name===r.value?"is-active":"","basic-layout-mix-menu-module__label"])},Y((k=C.meta)==null?void 0:k.title),3),Te(f("div",Hn,null,512),[[Fe,C.name===r.value]])],10,Tn)}),128))]),f("div",{class:ue(["basic-layout-mix-menu-children",c.value?"is-show":""]),style:A({width:c.value?`${P.menuWidth}px`:"0px"})},[f("div",Ln,[f("div",{class:"basic-layout-mix-menu-children-header",style:A({height:P.headerHeight+"px"})},[f("div",{class:"basic-layout-mix-menu-children-header-icon",style:A({color:"rgba(0, 0, 0, 0.35)"}),onClick:V},[s(Mn)],4)],4),s(e(ye),{menus:v.value},null,8,["menus"])])],6)],32))}}),En=B(Sn,[["__scopeId","data-v-e887b90d"]]),Pn={class:"mix-sidebar basic-layout-aside__wrapper"},In=H({__name:"mix-sidebar",setup(u){const{layoutConfig:o}=Q(J());return(a,i)=>(d(),g("div",Pn,[s(ne,{"show-title":!1,"logo-width":90,height:e(o).headerHeight},null,8,["height"]),s(En,{"header-height":e(o).headerHeight,"menu-width":e(o).asideWidth},null,8,["header-height","menu-width"])]))}}),zn={class:"page-container"},$n={key:0,class:"mobile-menu"},Dn={class:"basic-layout-main__wrapper"},An=H({__name:"basic-layout",setup(u){const o=Lt("BasicLayout"),{layoutConfig:a,mixMenuLayoutConfig:i}=Q(J()),{isMobile:n}=Be(),l=N(!1);pe(n,()=>{a.value.layoutMode&&![y.Top].includes(a.value.layoutMode)&&(l.value=n.value)},{immediate:!0});const p=()=>{l.value=!l.value},t=L(()=>({fontSize:12})),r=L(()=>{const{layoutMode:v,asideWidth:x=220,collapsed:h,headerHeight:E,tabBarHeight:I,footerHeight:T}=e(a),V=78,P=90,{fixedMenu:z,showChildren:C}=e(i),{showTagPage:w}=F.defaultLayoutSetting;return{[y.Side]:()=>{const W=n.value?0:h?V:x;return{footerHeight:T,headerHeight:E,tabHeight:w?I:0,asideWidth:W,headerPaddingLeft:W,headerZIndex:1001}},[y.TopMix]:()=>{const W=n.value?0:h?V:x;return{footerHeight:T,headerHeight:E,tabHeight:w?I:0,asideWidth:W,asidePaddingTop:E,headerZIndex:1003,headerPaddingLeft:0}},[y.Top]:()=>({footerHeight:T,tabHeight:w?I:0,asideWidth:0,headerPaddingLeft:0}),[y.SideMix]:()=>{const W=n.value?0:z&&C?P+x:P;return{footerHeight:T,headerHeight:E,tabHeight:w?I:0,asideWidth:W,headerPaddingLeft:W}}}[v||y.Side]()}),c=L(()=>{const{layoutMode:v,asideWidth:x,collapsed:h,headerHeight:E}=e(a);return{[y.Side]:()=>({height:E,width:x,showTitle:!h}),[y.SideMix]:()=>({}),[y.TopMix]:()=>({}),[y.Top]:()=>({})}[v||y.Side]()});return(v,x)=>{const h=_("el-drawer"),E=_("el-backtop"),I=Oe("watermark");return d(),g(G,null,[f("div",zn,[s(e(Ht),te(r.value,{config:{footer:e(F).defaultLayoutSetting.showFooter,header:e(F).defaultLayoutSetting.showHeader,tab:e(F).defaultLayoutSetting.showTagPage,aside:!!r.value.asideWidth,main:!0}}),{aside:m(()=>[e(n)?(d(),g("div",$n,[s(h,{modelValue:l.value,"onUpdate:modelValue":x[0]||(x[0]=T=>l.value=T),direction:"ltr","with-header":!1,size:e(a).asideWidth||250},{default:m(()=>[s(e(we),{collapsed:e(a).collapsed},fe({_:2},[e(y).Side===e(a).layoutMode?{name:"logo",fn:m(()=>[s(e(ne),j(he(c.value)),null,16)]),key:"0"}:void 0]),1032,["collapsed"])]),_:1},8,["modelValue","size"])])):(d(),g(G,{key:1},[e(a).layoutMode&&![e(y).Top,e(y).SideMix].includes(e(a).layoutMode)?(d(),b(e(we),{key:0,collapsed:e(a).collapsed},fe({_:2},[e(y).Side===e(a).layoutMode?{name:"logo",fn:m(()=>[s(e(ne),j(he(c.value)),null,16)]),key:"0"}:void 0]),1032,["collapsed"])):M("v-if",!0),e(a).layoutMode&&[e(y).SideMix].includes(e(a).layoutMode)?(d(),b(e(In),{key:1})):M("v-if",!0)],64))]),header:m(()=>[s(e(Qt),{onMobileDrawer:p},fe({_:2},[e(y).TopMix===e(a).layoutMode?{name:"logo",fn:m(()=>[s(e(ne),{width:e(a).asideWidth},null,8,["width"])]),key:"0"}:void 0]),1024)]),tabs:m(()=>[s(e(mn),j(he(t.value)),null,16)]),footer:m(()=>[s(e(an))]),default:m(()=>[Te((d(),g("div",Dn,[(d(),b(He(e(o))))])),[[I,{content:e(Ee).projectTitle}]])]),_:1},16,["config"])]),M(" 回到顶部 "),e(F).defaultLayoutSetting.showBackTop?(d(),b(E,{key:0})):M("v-if",!0),M(" 设置 "),e(F).defaultLayoutSetting.showSettingButton?(d(),b(e(Xa),{key:1})):M("v-if",!0)],64)}}}),Un=B(An,[["__scopeId","data-v-daa4cc69"]]);export{Un as default};
