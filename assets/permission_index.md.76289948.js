import{_ as s,o as a,c as n,Q as o}from"./chunks/framework.51926b02.js";const u=JSON.parse('{"title":"权限","description":"","frontmatter":{},"headers":[],"relativePath":"permission/index.md","filePath":"permission/index.md"}'),l={name:"permission/index.md"},p=o(`<h1 id="权限" tabindex="-1">权限 <a class="header-anchor" href="#权限" aria-label="Permalink to &quot;权限&quot;">​</a></h1><p>目前前端权限大致实现几种方式</p><ul><li>前端角色权限 （xxx角色可用）</li><li>前端路由权限 （权限字符串,或者权限code 等）</li><li>后端返回动态路由表</li></ul><p>这里只实现了 权限字符串 来判断权限。如果需要上述的没有的其他两种自行根据业务调整 <code>src/store/permissions</code> <code>buildPermissionRoutes</code> 自行实现 需要过滤菜单的 filter</p><h2 id="忽略权限" tabindex="-1">忽略权限 <a class="header-anchor" href="#忽略权限" aria-label="Permalink to &quot;忽略权限&quot;">​</a></h2><p>路由 meta 中 <code>ignoreAuth: true</code> 忽略菜单权限</p><h2 id="细粒度权限" tabindex="-1">细粒度权限 <a class="header-anchor" href="#细粒度权限" aria-label="Permalink to &quot;细粒度权限&quot;">​</a></h2><h3 id="函数式" tabindex="-1">函数式 <a class="header-anchor" href="#函数式" aria-label="Permalink to &quot;函数式&quot;">​</a></h3><div class="language-ts vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">ts</span><pre class="shiki github-dark vp-code-dark"><code><span class="line"><span style="color:#F97583;">import</span><span style="color:#E1E4E8;"> { usePermissionStore } </span><span style="color:#F97583;">from</span><span style="color:#E1E4E8;"> </span><span style="color:#9ECBFF;">&#39;@/store&#39;</span></span>
<span class="line"><span style="color:#F97583;">const</span><span style="color:#E1E4E8;"> { </span><span style="color:#79B8FF;">hasPermission</span><span style="color:#E1E4E8;"> } </span><span style="color:#F97583;">=</span><span style="color:#E1E4E8;"> </span><span style="color:#B392F0;">usePermissionStore</span><span style="color:#E1E4E8;">()</span></span>
<span class="line"><span style="color:#B392F0;">hasPermission</span><span style="color:#E1E4E8;">([])</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#D73A49;">import</span><span style="color:#24292E;"> { usePermissionStore } </span><span style="color:#D73A49;">from</span><span style="color:#24292E;"> </span><span style="color:#032F62;">&#39;@/store&#39;</span></span>
<span class="line"><span style="color:#D73A49;">const</span><span style="color:#24292E;"> { </span><span style="color:#005CC5;">hasPermission</span><span style="color:#24292E;"> } </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">usePermissionStore</span><span style="color:#24292E;">()</span></span>
<span class="line"><span style="color:#6F42C1;">hasPermission</span><span style="color:#24292E;">([])</span></span></code></pre></div><h3 id="组件式" tabindex="-1">组件式 <a class="header-anchor" href="#组件式" aria-label="Permalink to &quot;组件式&quot;">​</a></h3><div class="language-ts vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">ts</span><pre class="shiki github-dark vp-code-dark"><code><span class="line"><span style="color:#F97583;">import</span><span style="color:#E1E4E8;"> { Authority } </span><span style="color:#F97583;">from</span><span style="color:#E1E4E8;"> </span><span style="color:#9ECBFF;">&#39;@/components/authority&#39;</span></span>
<span class="line"><span style="color:#F97583;">const</span><span style="color:#E1E4E8;"> { </span><span style="color:#79B8FF;">hasPermission</span><span style="color:#E1E4E8;"> } </span><span style="color:#F97583;">=</span><span style="color:#E1E4E8;"> </span><span style="color:#B392F0;">usePermissionStore</span><span style="color:#E1E4E8;">()</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583;">&lt;</span><span style="color:#E1E4E8;">Authority value</span><span style="color:#F97583;">=</span><span style="color:#9ECBFF;">&quot;&quot;</span><span style="color:#F97583;">&gt;</span><span style="color:#E1E4E8;">内容</span><span style="color:#F97583;">&lt;/</span><span style="color:#E1E4E8;">Authority</span><span style="color:#F97583;">&gt;</span></span>
<span class="line"><span style="color:#F97583;">&lt;</span><span style="color:#B392F0;">Authority</span><span style="color:#E1E4E8;"> :value</span><span style="color:#F97583;">=</span><span style="color:#9ECBFF;">&quot;[]&quot;</span><span style="color:#F97583;">&gt;</span><span style="color:#E1E4E8;">内容</span><span style="color:#F97583;">&lt;/</span><span style="color:#E1E4E8;">Authority</span><span style="color:#F97583;">&gt;</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#D73A49;">import</span><span style="color:#24292E;"> { Authority } </span><span style="color:#D73A49;">from</span><span style="color:#24292E;"> </span><span style="color:#032F62;">&#39;@/components/authority&#39;</span></span>
<span class="line"><span style="color:#D73A49;">const</span><span style="color:#24292E;"> { </span><span style="color:#005CC5;">hasPermission</span><span style="color:#24292E;"> } </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">usePermissionStore</span><span style="color:#24292E;">()</span></span>
<span class="line"></span>
<span class="line"><span style="color:#D73A49;">&lt;</span><span style="color:#24292E;">Authority value</span><span style="color:#D73A49;">=</span><span style="color:#032F62;">&quot;&quot;</span><span style="color:#D73A49;">&gt;</span><span style="color:#24292E;">内容</span><span style="color:#D73A49;">&lt;/</span><span style="color:#24292E;">Authority</span><span style="color:#D73A49;">&gt;</span></span>
<span class="line"><span style="color:#D73A49;">&lt;</span><span style="color:#6F42C1;">Authority</span><span style="color:#24292E;"> :value</span><span style="color:#D73A49;">=</span><span style="color:#032F62;">&quot;[]&quot;</span><span style="color:#D73A49;">&gt;</span><span style="color:#24292E;">内容</span><span style="color:#D73A49;">&lt;/</span><span style="color:#24292E;">Authority</span><span style="color:#D73A49;">&gt;</span></span></code></pre></div><h3 id="指令" tabindex="-1">指令 <a class="header-anchor" href="#指令" aria-label="Permalink to &quot;指令&quot;">​</a></h3><p>执行虽实现但不推荐使用指令权限。指令权限本质是在dom 加载完成后 插入移除 dom 元素，这会出现元素 闪现突然消失的情况。对于性能也并不是一个好的选择，指令加载也表示dom 元素已经加载完了。 推荐组件式 和 函数式 <code>v-if</code> 来处理权限，理由是 <code>v-if</code> 和 组件式 最接近于底层， 并不会做无意义的渲染。</p><div class="language-ts vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">ts</span><pre class="shiki github-dark vp-code-dark"><code><span class="line"><span style="color:#6A737D;">// v-if 底层做到的执行逻辑</span></span>
<span class="line"><span style="color:#E1E4E8;">是否含有权限 </span><span style="color:#F97583;">?</span><span style="color:#E1E4E8;"> </span><span style="color:#B392F0;">h</span><span style="color:#E1E4E8;">(</span><span style="color:#9ECBFF;">&#39;内容&#39;</span><span style="color:#E1E4E8;">) </span><span style="color:#F97583;">:</span><span style="color:#E1E4E8;"> </span><span style="color:#79B8FF;">null</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#6A737D;">// v-if 底层做到的执行逻辑</span></span>
<span class="line"><span style="color:#24292E;">是否含有权限 </span><span style="color:#D73A49;">?</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">h</span><span style="color:#24292E;">(</span><span style="color:#032F62;">&#39;内容&#39;</span><span style="color:#24292E;">) </span><span style="color:#D73A49;">:</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">null</span></span></code></pre></div>`,14),e=[p];function t(r,c,i,y,E,d){return a(),n("div",null,e)}const F=s(l,[["render",t]]);export{u as __pageData,F as default};
