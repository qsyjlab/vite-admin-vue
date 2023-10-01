import{_ as s,o as a,c as n,Q as o}from"./chunks/framework.51926b02.js";const q=JSON.parse('{"title":"使用","description":"","frontmatter":{},"headers":[],"relativePath":"guide/use.md","filePath":"guide/use.md"}'),l={name:"guide/use.md"},p=o(`<h1 id="使用" tabindex="-1">使用 <a class="header-anchor" href="#使用" aria-label="Permalink to &quot;使用&quot;">​</a></h1><h2 id="环境准备" tabindex="-1">环境准备 <a class="header-anchor" href="#环境准备" aria-label="Permalink to &quot;环境准备&quot;">​</a></h2><p>项目基于 Nodejs, 以及包管理器 pnpm</p><div class="warning custom-block"><p class="custom-block-title">注意</p><ul><li>关于node环境推荐 nvm 来管理</li><li>node.js 最低为12.x 以上, pnpm 最低支持 5x node.js 12版本，项目内推荐 pnpm 8 ,node.js 16x。<a href="https://pnpm.io/installation" target="_blank" rel="noreferrer">详见</a></li></ul></div><h2 id="安装" tabindex="-1">安装 <a class="header-anchor" href="#安装" aria-label="Permalink to &quot;安装&quot;">​</a></h2><h3 id="node-js" tabindex="-1">Node.js <a class="header-anchor" href="#node-js" aria-label="Permalink to &quot;Node.js&quot;">​</a></h3><p><a href="https://qsyjlab.club/article/317" target="_blank" rel="noreferrer">整合nvm和node</a></p><h3 id="安装-pnpm" tabindex="-1">安装 pnpm <a class="header-anchor" href="#安装-pnpm" aria-label="Permalink to &quot;安装 pnpm&quot;">​</a></h3><div class="language-sh vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">sh</span><pre class="shiki github-dark vp-code-dark"><code><span class="line"><span style="color:#B392F0;">npm</span><span style="color:#E1E4E8;"> </span><span style="color:#9ECBFF;">install</span><span style="color:#E1E4E8;"> </span><span style="color:#79B8FF;">-g</span><span style="color:#E1E4E8;"> </span><span style="color:#9ECBFF;">pnpm</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#6F42C1;">npm</span><span style="color:#24292E;"> </span><span style="color:#032F62;">install</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">-g</span><span style="color:#24292E;"> </span><span style="color:#032F62;">pnpm</span></span></code></pre></div><p>pnpm 使用方法具体详见官网</p><h2 id="scripts" tabindex="-1">scripts <a class="header-anchor" href="#scripts" aria-label="Permalink to &quot;scripts&quot;">​</a></h2><div class="language-json vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">json</span><pre class="shiki github-dark vp-code-dark"><code><span class="line"><span style="color:#9ECBFF;">&quot;scripts&quot;</span><span style="color:#E1E4E8;">: {</span></span>
<span class="line"><span style="color:#E1E4E8;">    </span><span style="color:#6A737D;">// 启动</span></span>
<span class="line"><span style="color:#E1E4E8;">    </span><span style="color:#79B8FF;">&quot;dev&quot;</span><span style="color:#E1E4E8;">: </span><span style="color:#9ECBFF;">&quot;vite&quot;</span><span style="color:#E1E4E8;">,</span></span>
<span class="line"><span style="color:#E1E4E8;">    </span><span style="color:#6A737D;">// ip host 启动</span></span>
<span class="line"><span style="color:#E1E4E8;">    </span><span style="color:#79B8FF;">&quot;app:host&quot;</span><span style="color:#E1E4E8;">: </span><span style="color:#9ECBFF;">&quot;vite --host&quot;</span><span style="color:#E1E4E8;">,</span></span>
<span class="line"><span style="color:#E1E4E8;">    </span><span style="color:#6A737D;">// 不同mode 启动</span></span>
<span class="line"><span style="color:#E1E4E8;">    </span><span style="color:#79B8FF;">&quot;app:prod&quot;</span><span style="color:#E1E4E8;">: </span><span style="color:#9ECBFF;">&quot;pnpm run app:host --mode prod&quot;</span><span style="color:#E1E4E8;">,</span></span>
<span class="line"><span style="color:#E1E4E8;">    </span><span style="color:#79B8FF;">&quot;build&quot;</span><span style="color:#E1E4E8;">: </span><span style="color:#9ECBFF;">&quot;vue-tsc --noEmit --skipLibCheck &amp;&amp; vite build&quot;</span><span style="color:#E1E4E8;">,</span></span>
<span class="line"><span style="color:#E1E4E8;">    </span><span style="color:#79B8FF;">&quot;build:prod&quot;</span><span style="color:#E1E4E8;">: </span><span style="color:#9ECBFF;">&quot;vite build --mode prod&quot;</span><span style="color:#E1E4E8;">,</span></span>
<span class="line"><span style="color:#E1E4E8;">    </span><span style="color:#6A737D;">// tsc 检查</span></span>
<span class="line"><span style="color:#E1E4E8;">    </span><span style="color:#79B8FF;">&quot;check&quot;</span><span style="color:#E1E4E8;">: </span><span style="color:#9ECBFF;">&quot;vue-tsc --noEmit --skipLibCheck&quot;</span><span style="color:#E1E4E8;">,</span></span>
<span class="line"><span style="color:#E1E4E8;">    </span><span style="color:#6A737D;">// 打包产出本地服务预览</span></span>
<span class="line"><span style="color:#E1E4E8;">    </span><span style="color:#79B8FF;">&quot;preview&quot;</span><span style="color:#E1E4E8;">: </span><span style="color:#9ECBFF;">&quot;vite preview&quot;</span><span style="color:#E1E4E8;">,</span></span>
<span class="line"><span style="color:#E1E4E8;">    </span><span style="color:#6A737D;">// prettier</span></span>
<span class="line"><span style="color:#E1E4E8;">    </span><span style="color:#79B8FF;">&quot;prettier&quot;</span><span style="color:#E1E4E8;">: </span><span style="color:#9ECBFF;">&quot;prettier --write .&quot;</span><span style="color:#E1E4E8;">,</span></span>
<span class="line"><span style="color:#E1E4E8;">    </span><span style="color:#6A737D;">// 检查项目循环引用</span></span>
<span class="line"><span style="color:#E1E4E8;">    </span><span style="color:#79B8FF;">&quot;lint:code-recyle&quot;</span><span style="color:#E1E4E8;">: </span><span style="color:#9ECBFF;">&quot;dpdm ./src/main.ts --no-warning&quot;</span><span style="color:#E1E4E8;">,</span></span>
<span class="line"><span style="color:#E1E4E8;">    </span><span style="color:#6A737D;">// 代码检查</span></span>
<span class="line"><span style="color:#E1E4E8;">    </span><span style="color:#79B8FF;">&quot;lint&quot;</span><span style="color:#E1E4E8;">: </span><span style="color:#9ECBFF;">&quot;eslint . --ext .vue,.js,.ts,.jsx,.tsx --fix&quot;</span><span style="color:#E1E4E8;">,</span></span>
<span class="line"><span style="color:#E1E4E8;">    </span><span style="color:#79B8FF;">&quot;lint:stylelint&quot;</span><span style="color:#E1E4E8;">: </span><span style="color:#9ECBFF;">&quot;stylelint --cache --fix </span><span style="color:#79B8FF;">\\&quot;</span><span style="color:#9ECBFF;">**/*.{css,less,vue,html}</span><span style="color:#79B8FF;">\\&quot;</span><span style="color:#9ECBFF;"> --cache --cache-location node_modules/.cache/stylelint/&quot;</span><span style="color:#E1E4E8;">,</span></span>
<span class="line"><span style="color:#E1E4E8;">    </span><span style="color:#79B8FF;">&quot;prepare&quot;</span><span style="color:#E1E4E8;">: </span><span style="color:#9ECBFF;">&quot;husky install&quot;</span><span style="color:#E1E4E8;">,</span></span>
<span class="line"><span style="color:#E1E4E8;">    </span><span style="color:#6A737D;">// 命令行删除  依赖 rimraf 包</span></span>
<span class="line"><span style="color:#E1E4E8;">    </span><span style="color:#79B8FF;">&quot;clean:lib&quot;</span><span style="color:#E1E4E8;">: </span><span style="color:#9ECBFF;">&quot;rimraf node_modules&quot;</span></span>
<span class="line"><span style="color:#E1E4E8;">  }</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#032F62;">&quot;scripts&quot;</span><span style="color:#24292E;">: {</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#6A737D;">// 启动</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#005CC5;">&quot;dev&quot;</span><span style="color:#24292E;">: </span><span style="color:#032F62;">&quot;vite&quot;</span><span style="color:#24292E;">,</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#6A737D;">// ip host 启动</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#005CC5;">&quot;app:host&quot;</span><span style="color:#24292E;">: </span><span style="color:#032F62;">&quot;vite --host&quot;</span><span style="color:#24292E;">,</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#6A737D;">// 不同mode 启动</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#005CC5;">&quot;app:prod&quot;</span><span style="color:#24292E;">: </span><span style="color:#032F62;">&quot;pnpm run app:host --mode prod&quot;</span><span style="color:#24292E;">,</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#005CC5;">&quot;build&quot;</span><span style="color:#24292E;">: </span><span style="color:#032F62;">&quot;vue-tsc --noEmit --skipLibCheck &amp;&amp; vite build&quot;</span><span style="color:#24292E;">,</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#005CC5;">&quot;build:prod&quot;</span><span style="color:#24292E;">: </span><span style="color:#032F62;">&quot;vite build --mode prod&quot;</span><span style="color:#24292E;">,</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#6A737D;">// tsc 检查</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#005CC5;">&quot;check&quot;</span><span style="color:#24292E;">: </span><span style="color:#032F62;">&quot;vue-tsc --noEmit --skipLibCheck&quot;</span><span style="color:#24292E;">,</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#6A737D;">// 打包产出本地服务预览</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#005CC5;">&quot;preview&quot;</span><span style="color:#24292E;">: </span><span style="color:#032F62;">&quot;vite preview&quot;</span><span style="color:#24292E;">,</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#6A737D;">// prettier</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#005CC5;">&quot;prettier&quot;</span><span style="color:#24292E;">: </span><span style="color:#032F62;">&quot;prettier --write .&quot;</span><span style="color:#24292E;">,</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#6A737D;">// 检查项目循环引用</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#005CC5;">&quot;lint:code-recyle&quot;</span><span style="color:#24292E;">: </span><span style="color:#032F62;">&quot;dpdm ./src/main.ts --no-warning&quot;</span><span style="color:#24292E;">,</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#6A737D;">// 代码检查</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#005CC5;">&quot;lint&quot;</span><span style="color:#24292E;">: </span><span style="color:#032F62;">&quot;eslint . --ext .vue,.js,.ts,.jsx,.tsx --fix&quot;</span><span style="color:#24292E;">,</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#005CC5;">&quot;lint:stylelint&quot;</span><span style="color:#24292E;">: </span><span style="color:#032F62;">&quot;stylelint --cache --fix </span><span style="color:#005CC5;">\\&quot;</span><span style="color:#032F62;">**/*.{css,less,vue,html}</span><span style="color:#005CC5;">\\&quot;</span><span style="color:#032F62;"> --cache --cache-location node_modules/.cache/stylelint/&quot;</span><span style="color:#24292E;">,</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#005CC5;">&quot;prepare&quot;</span><span style="color:#24292E;">: </span><span style="color:#032F62;">&quot;husky install&quot;</span><span style="color:#24292E;">,</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#6A737D;">// 命令行删除  依赖 rimraf 包</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#005CC5;">&quot;clean:lib&quot;</span><span style="color:#24292E;">: </span><span style="color:#032F62;">&quot;rimraf node_modules&quot;</span></span>
<span class="line"><span style="color:#24292E;">  }</span></span></code></pre></div><h2 id="工具配置" tabindex="-1">工具配置 <a class="header-anchor" href="#工具配置" aria-label="Permalink to &quot;工具配置&quot;">​</a></h2><p>推荐 IDE vscode</p><ul><li>volar 提供vue, 及 ts 提示, 升级版的 vetur</li><li>Eslint 代码检查</li><li>prettier 代码风格格式化</li><li>DotENV 提供 env的 高亮</li></ul><h2 id="代码获取" tabindex="-1">代码获取 <a class="header-anchor" href="#代码获取" aria-label="Permalink to &quot;代码获取&quot;">​</a></h2><h3 id="github" tabindex="-1">Github <a class="header-anchor" href="#github" aria-label="Permalink to &quot;Github&quot;">​</a></h3><h3 id="gitee" tabindex="-1">Gitee <a class="header-anchor" href="#gitee" aria-label="Permalink to &quot;Gitee&quot;">​</a></h3><div class="language-shell vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">shell</span><pre class="shiki github-dark vp-code-dark"><code><span class="line"><span style="color:#B392F0;">git</span><span style="color:#E1E4E8;"> </span><span style="color:#9ECBFF;">clone</span><span style="color:#E1E4E8;"> </span><span style="color:#9ECBFF;">https://gitee.com/qsyj0522/vite-admin-vue.git</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#6F42C1;">git</span><span style="color:#24292E;"> </span><span style="color:#032F62;">clone</span><span style="color:#24292E;"> </span><span style="color:#032F62;">https://gitee.com/qsyj0522/vite-admin-vue.git</span></span></code></pre></div>`,19),t=[p];function e(c,r,i,E,y,u){return a(),n("div",null,t)}const h=s(l,[["render",e]]);export{q as __pageData,h as default};
