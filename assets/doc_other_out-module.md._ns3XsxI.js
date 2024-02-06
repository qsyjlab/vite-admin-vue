import{_ as s,c as n,o as a,R as p}from"./chunks/framework.e2dboEyh.js";const F=JSON.parse('{"title":"外部模块引入","description":"","frontmatter":{},"headers":[],"relativePath":"doc/other/out-module.md","filePath":"doc/other/out-module.md"}'),l={name:"doc/other/out-module.md"},o=p(`<h1 id="外部模块引入" tabindex="-1">外部模块引入 <a class="header-anchor" href="#外部模块引入" aria-label="Permalink to &quot;外部模块引入&quot;">​</a></h1><p>以安装 element-plus 为例</p><div class="language-shell vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">shell</span><pre class="shiki github-dark vp-code-dark"><code><span class="line"><span style="color:#B392F0;">pnpm</span><span style="color:#E1E4E8;"> </span><span style="color:#9ECBFF;">i</span><span style="color:#E1E4E8;"> </span><span style="color:#9ECBFF;">element-plus</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#6F42C1;">pnpm</span><span style="color:#24292E;"> </span><span style="color:#032F62;">i</span><span style="color:#24292E;"> </span><span style="color:#032F62;">element-plus</span></span></code></pre></div><div class="language-ts vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">ts</span><pre class="shiki github-dark vp-code-dark"><code><span class="line"><span style="color:#6A737D;">// src/plugins/elementPlus/index.ts</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D;">// 需要单独引入的css 样式路径</span></span>
<span class="line"><span style="color:#F97583;">import</span><span style="color:#E1E4E8;"> </span><span style="color:#9ECBFF;">&#39;./css&#39;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D;">// 因使用 unplugin 自动注册 需要使用动态组件时需要实际注册</span></span>
<span class="line"><span style="color:#F97583;">import</span><span style="color:#E1E4E8;"> </span><span style="color:#79B8FF;">*</span><span style="color:#E1E4E8;"> </span><span style="color:#F97583;">as</span><span style="color:#E1E4E8;"> components </span><span style="color:#F97583;">from</span><span style="color:#E1E4E8;"> </span><span style="color:#9ECBFF;">&#39;./el&#39;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583;">import</span><span style="color:#E1E4E8;"> { defineAppPlugin } </span><span style="color:#F97583;">from</span><span style="color:#E1E4E8;"> </span><span style="color:#9ECBFF;">&#39;@/utils&#39;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583;">export</span><span style="color:#E1E4E8;"> </span><span style="color:#F97583;">default</span><span style="color:#E1E4E8;"> </span><span style="color:#B392F0;">defineAppPlugin</span><span style="color:#E1E4E8;">(</span><span style="color:#FFAB70;">app</span><span style="color:#E1E4E8;"> </span><span style="color:#F97583;">=&gt;</span><span style="color:#E1E4E8;"> {</span></span>
<span class="line"><span style="color:#E1E4E8;">  Object.</span><span style="color:#B392F0;">keys</span><span style="color:#E1E4E8;">(components).</span><span style="color:#B392F0;">forEach</span><span style="color:#E1E4E8;">(</span><span style="color:#FFAB70;">item</span><span style="color:#E1E4E8;"> </span><span style="color:#F97583;">=&gt;</span><span style="color:#E1E4E8;"> {</span></span>
<span class="line"><span style="color:#E1E4E8;">    app.</span><span style="color:#B392F0;">use</span><span style="color:#E1E4E8;">(components[item </span><span style="color:#F97583;">as</span><span style="color:#E1E4E8;"> </span><span style="color:#79B8FF;">unknown</span><span style="color:#E1E4E8;"> </span><span style="color:#F97583;">as</span><span style="color:#E1E4E8;"> </span><span style="color:#F97583;">keyof</span><span style="color:#E1E4E8;"> </span><span style="color:#F97583;">typeof</span><span style="color:#E1E4E8;"> components])</span></span>
<span class="line"><span style="color:#E1E4E8;">  })</span></span>
<span class="line"><span style="color:#E1E4E8;">})</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#6A737D;">// src/plugins/elementPlus/index.ts</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D;">// 需要单独引入的css 样式路径</span></span>
<span class="line"><span style="color:#D73A49;">import</span><span style="color:#24292E;"> </span><span style="color:#032F62;">&#39;./css&#39;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D;">// 因使用 unplugin 自动注册 需要使用动态组件时需要实际注册</span></span>
<span class="line"><span style="color:#D73A49;">import</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">*</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">as</span><span style="color:#24292E;"> components </span><span style="color:#D73A49;">from</span><span style="color:#24292E;"> </span><span style="color:#032F62;">&#39;./el&#39;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#D73A49;">import</span><span style="color:#24292E;"> { defineAppPlugin } </span><span style="color:#D73A49;">from</span><span style="color:#24292E;"> </span><span style="color:#032F62;">&#39;@/utils&#39;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#D73A49;">export</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">default</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">defineAppPlugin</span><span style="color:#24292E;">(</span><span style="color:#E36209;">app</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">=&gt;</span><span style="color:#24292E;"> {</span></span>
<span class="line"><span style="color:#24292E;">  Object.</span><span style="color:#6F42C1;">keys</span><span style="color:#24292E;">(components).</span><span style="color:#6F42C1;">forEach</span><span style="color:#24292E;">(</span><span style="color:#E36209;">item</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">=&gt;</span><span style="color:#24292E;"> {</span></span>
<span class="line"><span style="color:#24292E;">    app.</span><span style="color:#6F42C1;">use</span><span style="color:#24292E;">(components[item </span><span style="color:#D73A49;">as</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">unknown</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">as</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">keyof</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">typeof</span><span style="color:#24292E;"> components])</span></span>
<span class="line"><span style="color:#24292E;">  })</span></span>
<span class="line"><span style="color:#24292E;">})</span></span></code></pre></div><p>插件引入入口</p><div class="language-ts vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">ts</span><pre class="shiki github-dark vp-code-dark"><code><span class="line"><span style="color:#6A737D;">//  src/plugins/index.ts</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583;">export</span><span style="color:#E1E4E8;"> </span><span style="color:#F97583;">default</span><span style="color:#E1E4E8;"> </span><span style="color:#B392F0;">defineAppPlugin</span><span style="color:#E1E4E8;">(</span><span style="color:#FFAB70;">app</span><span style="color:#E1E4E8;"> </span><span style="color:#F97583;">=&gt;</span><span style="color:#E1E4E8;"> {</span></span>
<span class="line"><span style="color:#E1E4E8;">  </span><span style="color:#6A737D;">// 进度条</span></span>
<span class="line"><span style="color:#E1E4E8;">  </span><span style="color:#B392F0;">setupProgress</span><span style="color:#E1E4E8;">(app)</span></span>
<span class="line"><span style="color:#E1E4E8;">  </span><span style="color:#6A737D;">// pinia</span></span>
<span class="line"><span style="color:#E1E4E8;">  </span><span style="color:#B392F0;">setupPinia</span><span style="color:#E1E4E8;">(app)</span></span>
<span class="line"><span style="color:#E1E4E8;">  </span><span style="color:#6A737D;">// dayjs</span></span>
<span class="line"><span style="color:#E1E4E8;">  </span><span style="color:#B392F0;">setUpDayJs</span><span style="color:#E1E4E8;">(app)</span></span>
<span class="line"><span style="color:#E1E4E8;">  </span><span style="color:#6A737D;">// elementPlus</span></span>
<span class="line"><span style="color:#E1E4E8;">  </span><span style="color:#B392F0;">setupElementPlus</span><span style="color:#E1E4E8;">(app)</span></span>
<span class="line"><span style="color:#E1E4E8;">  </span><span style="color:#6A737D;">// custom global components</span></span>
<span class="line"><span style="color:#E1E4E8;">  </span><span style="color:#B392F0;">registerGlobalComponents</span><span style="color:#E1E4E8;">(app)</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E1E4E8;">  </span><span style="color:#6A737D;">// windicss</span></span>
<span class="line"><span style="color:#E1E4E8;">  </span><span style="color:#B392F0;">setupWindicss</span><span style="color:#E1E4E8;">(app)</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E1E4E8;">  </span><span style="color:#6A737D;">/**</span></span>
<span class="line"><span style="color:#6A737D;">   * vite-plugin-svg-icons 虚拟路径</span></span>
<span class="line"><span style="color:#6A737D;">   */</span></span>
<span class="line"><span style="color:#E1E4E8;">  </span><span style="color:#F97583;">import</span><span style="color:#E1E4E8;">(</span><span style="color:#9ECBFF;">&#39;./vite-plugin-svg-icons&#39;</span><span style="color:#E1E4E8;">)</span></span>
<span class="line"><span style="color:#E1E4E8;">})</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#6A737D;">//  src/plugins/index.ts</span></span>
<span class="line"></span>
<span class="line"><span style="color:#D73A49;">export</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">default</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">defineAppPlugin</span><span style="color:#24292E;">(</span><span style="color:#E36209;">app</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">=&gt;</span><span style="color:#24292E;"> {</span></span>
<span class="line"><span style="color:#24292E;">  </span><span style="color:#6A737D;">// 进度条</span></span>
<span class="line"><span style="color:#24292E;">  </span><span style="color:#6F42C1;">setupProgress</span><span style="color:#24292E;">(app)</span></span>
<span class="line"><span style="color:#24292E;">  </span><span style="color:#6A737D;">// pinia</span></span>
<span class="line"><span style="color:#24292E;">  </span><span style="color:#6F42C1;">setupPinia</span><span style="color:#24292E;">(app)</span></span>
<span class="line"><span style="color:#24292E;">  </span><span style="color:#6A737D;">// dayjs</span></span>
<span class="line"><span style="color:#24292E;">  </span><span style="color:#6F42C1;">setUpDayJs</span><span style="color:#24292E;">(app)</span></span>
<span class="line"><span style="color:#24292E;">  </span><span style="color:#6A737D;">// elementPlus</span></span>
<span class="line"><span style="color:#24292E;">  </span><span style="color:#6F42C1;">setupElementPlus</span><span style="color:#24292E;">(app)</span></span>
<span class="line"><span style="color:#24292E;">  </span><span style="color:#6A737D;">// custom global components</span></span>
<span class="line"><span style="color:#24292E;">  </span><span style="color:#6F42C1;">registerGlobalComponents</span><span style="color:#24292E;">(app)</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">  </span><span style="color:#6A737D;">// windicss</span></span>
<span class="line"><span style="color:#24292E;">  </span><span style="color:#6F42C1;">setupWindicss</span><span style="color:#24292E;">(app)</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">  </span><span style="color:#6A737D;">/**</span></span>
<span class="line"><span style="color:#6A737D;">   * vite-plugin-svg-icons 虚拟路径</span></span>
<span class="line"><span style="color:#6A737D;">   */</span></span>
<span class="line"><span style="color:#24292E;">  </span><span style="color:#D73A49;">import</span><span style="color:#24292E;">(</span><span style="color:#032F62;">&#39;./vite-plugin-svg-icons&#39;</span><span style="color:#24292E;">)</span></span>
<span class="line"><span style="color:#24292E;">})</span></span></code></pre></div><p>main.ts 最终会执行</p><div class="language-ts vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">ts</span><pre class="shiki github-dark vp-code-dark"><code><span class="line"><span style="color:#F97583;">async</span><span style="color:#E1E4E8;"> </span><span style="color:#F97583;">function</span><span style="color:#E1E4E8;"> </span><span style="color:#B392F0;">setupWebApp</span><span style="color:#E1E4E8;">() {</span></span>
<span class="line"><span style="color:#E1E4E8;">  </span><span style="color:#F97583;">const</span><span style="color:#E1E4E8;"> </span><span style="color:#79B8FF;">app</span><span style="color:#E1E4E8;"> </span><span style="color:#F97583;">=</span><span style="color:#E1E4E8;"> </span><span style="color:#B392F0;">createApp</span><span style="color:#E1E4E8;">(App)</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E1E4E8;">  app.</span><span style="color:#B392F0;">use</span><span style="color:#E1E4E8;">(setUpPlugins)</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E1E4E8;">  app.</span><span style="color:#B392F0;">use</span><span style="color:#E1E4E8;">(setUpDirective)</span></span>
<span class="line"><span style="color:#E1E4E8;">  app.</span><span style="color:#B392F0;">use</span><span style="color:#E1E4E8;">(setupRouter)</span></span>
<span class="line"><span style="color:#E1E4E8;">  app.</span><span style="color:#B392F0;">mount</span><span style="color:#E1E4E8;">(root)</span></span>
<span class="line"><span style="color:#E1E4E8;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#B392F0;">setupWebApp</span><span style="color:#E1E4E8;">()</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#D73A49;">async</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">function</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">setupWebApp</span><span style="color:#24292E;">() {</span></span>
<span class="line"><span style="color:#24292E;">  </span><span style="color:#D73A49;">const</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">app</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">createApp</span><span style="color:#24292E;">(App)</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">  app.</span><span style="color:#6F42C1;">use</span><span style="color:#24292E;">(setUpPlugins)</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">  app.</span><span style="color:#6F42C1;">use</span><span style="color:#24292E;">(setUpDirective)</span></span>
<span class="line"><span style="color:#24292E;">  app.</span><span style="color:#6F42C1;">use</span><span style="color:#24292E;">(setupRouter)</span></span>
<span class="line"><span style="color:#24292E;">  app.</span><span style="color:#6F42C1;">mount</span><span style="color:#24292E;">(root)</span></span>
<span class="line"><span style="color:#24292E;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6F42C1;">setupWebApp</span><span style="color:#24292E;">()</span></span></code></pre></div><p>注意： 默认情况下插件的导入统一入口都是从 <code>plugin</code> 作为实际的引入入口方便后面的统一替换。关于 是否使用 vue 的注册则是根据实际需要来使用。<code>plugin</code> 文件夹更多是为了需要进行应用启动时的插件初始化。</p><p>一些特例则可以不需要从 <code>plugin</code> 统一引入。 例如： <code>lodash-es</code> ,或者是 <code>xlsx</code> 这种工具库 可以进行统一封装到 <code>utils</code> 文件中。</p>`,10),e=[o];function c(t,r,E,y,i,u){return a(),n("div",null,e)}const A=s(l,[["render",c]]);export{F as __pageData,A as default};
