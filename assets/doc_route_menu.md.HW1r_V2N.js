import{_ as s,c as n,o as a,R as l}from"./chunks/framework.SCZo_iHs.js";const h=JSON.parse('{"title":"菜单","description":"","frontmatter":{},"headers":[],"relativePath":"doc/route/menu.md","filePath":"doc/route/menu.md"}'),p={name:"doc/route/menu.md"},o=l(`<h1 id="菜单" tabindex="-1">菜单 <a class="header-anchor" href="#菜单" aria-label="Permalink to &quot;菜单&quot;">​</a></h1><h2 id="菜单配置" tabindex="-1">菜单配置 <a class="header-anchor" href="#菜单配置" aria-label="Permalink to &quot;菜单配置&quot;">​</a></h2><div class="language-ts vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">ts</span><pre class="shiki github-dark vp-code-dark"><code><span class="line"><span style="color:#E1E4E8;">  </span><span style="color:#6A737D;">// 排序</span></span>
<span class="line"><span style="color:#E1E4E8;">  order</span><span style="color:#F97583;">?:</span><span style="color:#E1E4E8;"> number</span></span>
<span class="line"><span style="color:#E1E4E8;">  </span><span style="color:#6A737D;">// 路由标题</span></span>
<span class="line"><span style="color:#E1E4E8;">  title</span><span style="color:#F97583;">?:</span><span style="color:#E1E4E8;"> string</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E1E4E8;">  </span><span style="color:#6A737D;">// 是否忽略权限</span></span>
<span class="line"><span style="color:#E1E4E8;">  ignoreAuth</span><span style="color:#F97583;">?:</span><span style="color:#E1E4E8;"> boolean</span></span>
<span class="line"><span style="color:#E1E4E8;">  </span><span style="color:#6A737D;">// 是否忽略 keepAlive 不传默认忽略</span></span>
<span class="line"><span style="color:#E1E4E8;">  ignoreKeepAlive</span><span style="color:#F97583;">?:</span><span style="color:#E1E4E8;"> boolean</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E1E4E8;">  </span><span style="color:#6A737D;">// 图标字符串</span></span>
<span class="line"><span style="color:#E1E4E8;">  icon</span><span style="color:#F97583;">?:</span><span style="color:#E1E4E8;"> string</span></span>
<span class="line"><span style="color:#E1E4E8;">  </span><span style="color:#6A737D;">// 外链</span></span>
<span class="line"><span style="color:#E1E4E8;">  href</span><span style="color:#F97583;">?:</span><span style="color:#E1E4E8;"> string</span></span>
<span class="line"><span style="color:#E1E4E8;">  </span><span style="color:#6A737D;">// 菜单栏隐藏</span></span>
<span class="line"><span style="color:#E1E4E8;">  hideInMenu</span><span style="color:#F97583;">?:</span><span style="color:#E1E4E8;"> boolean</span></span>
<span class="line"><span style="color:#E1E4E8;">  </span><span style="color:#6A737D;">// 面包屑 导航隐藏</span></span>
<span class="line"><span style="color:#E1E4E8;">  hideInBreadcrumb</span><span style="color:#F97583;">?:</span><span style="color:#E1E4E8;"> boolean</span></span>
<span class="line"><span style="color:#E1E4E8;">  </span><span style="color:#6A737D;">// tab 栏标签隐藏</span></span>
<span class="line"><span style="color:#E1E4E8;">  hideInTab</span><span style="color:#F97583;">?:</span><span style="color:#E1E4E8;"> boolean</span></span>
<span class="line"><span style="color:#E1E4E8;">  </span><span style="color:#6A737D;">// 固定在标签栏的路由</span></span>
<span class="line"><span style="color:#E1E4E8;">  affixTab</span><span style="color:#F97583;">?:</span><span style="color:#E1E4E8;"> boolean</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E1E4E8;">  </span><span style="color:#6A737D;">// 当前激活的菜单的 name （如果是详情页面不存在 menu 中可以指定 激活的菜单）</span></span>
<span class="line"><span style="color:#E1E4E8;">  currentActiveMenu</span><span style="color:#F97583;">?:</span><span style="color:#E1E4E8;"> string</span></span>
<span class="line"><span style="color:#E1E4E8;">  </span><span style="color:#6A737D;">// 隐藏子菜单</span></span>
<span class="line"><span style="color:#E1E4E8;">  hideChildrenInMenu</span><span style="color:#F97583;">?:</span><span style="color:#E1E4E8;"> boolean</span></span>
<span class="line"><span style="color:#E1E4E8;">  </span><span style="color:#6A737D;">// 角色类型</span></span>
<span class="line"><span style="color:#E1E4E8;">  roles</span><span style="color:#F97583;">?:</span><span style="color:#E1E4E8;"> string[] </span><span style="color:#F97583;">|</span><span style="color:#E1E4E8;"> number[]</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#24292E;">  </span><span style="color:#6A737D;">// 排序</span></span>
<span class="line"><span style="color:#24292E;">  order</span><span style="color:#D73A49;">?:</span><span style="color:#24292E;"> number</span></span>
<span class="line"><span style="color:#24292E;">  </span><span style="color:#6A737D;">// 路由标题</span></span>
<span class="line"><span style="color:#24292E;">  title</span><span style="color:#D73A49;">?:</span><span style="color:#24292E;"> string</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">  </span><span style="color:#6A737D;">// 是否忽略权限</span></span>
<span class="line"><span style="color:#24292E;">  ignoreAuth</span><span style="color:#D73A49;">?:</span><span style="color:#24292E;"> boolean</span></span>
<span class="line"><span style="color:#24292E;">  </span><span style="color:#6A737D;">// 是否忽略 keepAlive 不传默认忽略</span></span>
<span class="line"><span style="color:#24292E;">  ignoreKeepAlive</span><span style="color:#D73A49;">?:</span><span style="color:#24292E;"> boolean</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">  </span><span style="color:#6A737D;">// 图标字符串</span></span>
<span class="line"><span style="color:#24292E;">  icon</span><span style="color:#D73A49;">?:</span><span style="color:#24292E;"> string</span></span>
<span class="line"><span style="color:#24292E;">  </span><span style="color:#6A737D;">// 外链</span></span>
<span class="line"><span style="color:#24292E;">  href</span><span style="color:#D73A49;">?:</span><span style="color:#24292E;"> string</span></span>
<span class="line"><span style="color:#24292E;">  </span><span style="color:#6A737D;">// 菜单栏隐藏</span></span>
<span class="line"><span style="color:#24292E;">  hideInMenu</span><span style="color:#D73A49;">?:</span><span style="color:#24292E;"> boolean</span></span>
<span class="line"><span style="color:#24292E;">  </span><span style="color:#6A737D;">// 面包屑 导航隐藏</span></span>
<span class="line"><span style="color:#24292E;">  hideInBreadcrumb</span><span style="color:#D73A49;">?:</span><span style="color:#24292E;"> boolean</span></span>
<span class="line"><span style="color:#24292E;">  </span><span style="color:#6A737D;">// tab 栏标签隐藏</span></span>
<span class="line"><span style="color:#24292E;">  hideInTab</span><span style="color:#D73A49;">?:</span><span style="color:#24292E;"> boolean</span></span>
<span class="line"><span style="color:#24292E;">  </span><span style="color:#6A737D;">// 固定在标签栏的路由</span></span>
<span class="line"><span style="color:#24292E;">  affixTab</span><span style="color:#D73A49;">?:</span><span style="color:#24292E;"> boolean</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">  </span><span style="color:#6A737D;">// 当前激活的菜单的 name （如果是详情页面不存在 menu 中可以指定 激活的菜单）</span></span>
<span class="line"><span style="color:#24292E;">  currentActiveMenu</span><span style="color:#D73A49;">?:</span><span style="color:#24292E;"> string</span></span>
<span class="line"><span style="color:#24292E;">  </span><span style="color:#6A737D;">// 隐藏子菜单</span></span>
<span class="line"><span style="color:#24292E;">  hideChildrenInMenu</span><span style="color:#D73A49;">?:</span><span style="color:#24292E;"> boolean</span></span>
<span class="line"><span style="color:#24292E;">  </span><span style="color:#6A737D;">// 角色类型</span></span>
<span class="line"><span style="color:#24292E;">  roles</span><span style="color:#D73A49;">?:</span><span style="color:#24292E;"> string[] </span><span style="color:#D73A49;">|</span><span style="color:#24292E;"> number[]</span></span></code></pre></div><h2 id="菜单模块" tabindex="-1">菜单模块 <a class="header-anchor" href="#菜单模块" aria-label="Permalink to &quot;菜单模块&quot;">​</a></h2><p>顶级路由 / 开头作为一级菜单</p><h2 id="如何新增菜单" tabindex="-1">如何新增菜单 <a class="header-anchor" href="#如何新增菜单" aria-label="Permalink to &quot;如何新增菜单&quot;">​</a></h2><p>按照菜单层级创建路由则会生成对应层级的菜单,因为路由扁平化的缘故则试图始终不会超过 2 层</p>`,7),e=[o];function c(t,r,E,y,i,d){return a(),n("div",null,e)}const u=s(p,[["render",c]]);export{h as __pageData,u as default};
