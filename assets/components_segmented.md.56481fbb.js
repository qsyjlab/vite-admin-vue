import{_ as s,o as n,c as a,Q as l}from"./chunks/framework.36267fc7.js";const m=JSON.parse('{"title":"Segmented 分段器","description":"","frontmatter":{},"headers":[],"relativePath":"components/segmented.md","filePath":"components/segmented.md"}'),p={name:"components/segmented.md"},o=l(`<h1 id="segmented-分段器" tabindex="-1">Segmented 分段器 <a class="header-anchor" href="#segmented-分段器" aria-label="Permalink to &quot;Segmented 分段器&quot;">​</a></h1><div class="language-ts vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">ts</span><pre class="shiki github-dark vp-code-dark"><code><span class="line"><span style="color:#F97583;">interface</span><span style="color:#E1E4E8;"> </span><span style="color:#B392F0;">SegmentedItem</span><span style="color:#E1E4E8;"> {</span></span>
<span class="line"><span style="color:#E1E4E8;">  </span><span style="color:#FFAB70;">label</span><span style="color:#F97583;">:</span><span style="color:#E1E4E8;"> </span><span style="color:#79B8FF;">string</span></span>
<span class="line"><span style="color:#E1E4E8;">  </span><span style="color:#FFAB70;">value</span><span style="color:#F97583;">:</span><span style="color:#E1E4E8;"> </span><span style="color:#79B8FF;">string</span><span style="color:#E1E4E8;"> </span><span style="color:#F97583;">|</span><span style="color:#E1E4E8;"> </span><span style="color:#79B8FF;">number</span></span>
<span class="line"><span style="color:#E1E4E8;">  </span><span style="color:#FFAB70;">disabled</span><span style="color:#F97583;">?:</span><span style="color:#E1E4E8;"> </span><span style="color:#79B8FF;">boolean</span></span>
<span class="line"><span style="color:#E1E4E8;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583;">const</span><span style="color:#E1E4E8;"> </span><span style="color:#79B8FF;">emits</span><span style="color:#E1E4E8;"> </span><span style="color:#F97583;">=</span><span style="color:#E1E4E8;"> </span><span style="color:#B392F0;">defineEmits</span><span style="color:#E1E4E8;">&lt;{</span></span>
<span class="line"><span style="color:#E1E4E8;">  </span><span style="color:#9ECBFF;">&#39;update:model-value&#39;</span><span style="color:#F97583;">:</span><span style="color:#E1E4E8;"> [</span><span style="color:#B392F0;">value</span><span style="color:#E1E4E8;">: </span><span style="color:#B392F0;">SegmentedItem</span><span style="color:#E1E4E8;">[</span><span style="color:#9ECBFF;">&#39;value&#39;</span><span style="color:#E1E4E8;">] </span><span style="color:#F97583;">|</span><span style="color:#E1E4E8;"> </span><span style="color:#79B8FF;">undefined</span><span style="color:#E1E4E8;">]</span></span>
<span class="line"><span style="color:#E1E4E8;">  </span><span style="color:#FFAB70;">change</span><span style="color:#F97583;">:</span><span style="color:#E1E4E8;"> [</span><span style="color:#B392F0;">value</span><span style="color:#E1E4E8;">: </span><span style="color:#B392F0;">SegmentedItem</span><span style="color:#E1E4E8;">[</span><span style="color:#9ECBFF;">&#39;value&#39;</span><span style="color:#E1E4E8;">] </span><span style="color:#F97583;">|</span><span style="color:#E1E4E8;"> </span><span style="color:#79B8FF;">undefined</span><span style="color:#E1E4E8;">]</span></span>
<span class="line"><span style="color:#E1E4E8;">}&gt;()</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583;">const</span><span style="color:#E1E4E8;"> </span><span style="color:#79B8FF;">props</span><span style="color:#E1E4E8;"> </span><span style="color:#F97583;">=</span><span style="color:#E1E4E8;"> </span><span style="color:#B392F0;">withDefaults</span><span style="color:#E1E4E8;">(</span></span>
<span class="line"><span style="color:#E1E4E8;">  </span><span style="color:#B392F0;">defineProps</span><span style="color:#E1E4E8;">&lt;{</span></span>
<span class="line"><span style="color:#E1E4E8;">    </span><span style="color:#FFAB70;">modelValue</span><span style="color:#F97583;">?:</span><span style="color:#E1E4E8;"> </span><span style="color:#B392F0;">SegmentedItem</span><span style="color:#E1E4E8;">[</span><span style="color:#9ECBFF;">&#39;value&#39;</span><span style="color:#E1E4E8;">]</span></span>
<span class="line"><span style="color:#E1E4E8;">    </span><span style="color:#FFAB70;">options</span><span style="color:#F97583;">:</span><span style="color:#E1E4E8;"> </span><span style="color:#B392F0;">SegmentedItem</span><span style="color:#E1E4E8;">[]</span></span>
<span class="line"><span style="color:#E1E4E8;">    </span><span style="color:#FFAB70;">block</span><span style="color:#F97583;">?:</span><span style="color:#E1E4E8;"> </span><span style="color:#79B8FF;">boolean</span></span>
<span class="line"><span style="color:#E1E4E8;">    </span><span style="color:#FFAB70;">size</span><span style="color:#F97583;">?:</span><span style="color:#E1E4E8;"> </span><span style="color:#9ECBFF;">&#39;large&#39;</span><span style="color:#E1E4E8;"> </span><span style="color:#F97583;">|</span><span style="color:#E1E4E8;"> </span><span style="color:#9ECBFF;">&#39;default&#39;</span><span style="color:#E1E4E8;"> </span><span style="color:#F97583;">|</span><span style="color:#E1E4E8;"> </span><span style="color:#9ECBFF;">&#39;small&#39;</span></span>
<span class="line"><span style="color:#E1E4E8;">    </span><span style="color:#FFAB70;">disabled</span><span style="color:#F97583;">?:</span><span style="color:#E1E4E8;"> </span><span style="color:#79B8FF;">boolean</span></span>
<span class="line"><span style="color:#E1E4E8;">    </span><span style="color:#FFAB70;">autoSize</span><span style="color:#F97583;">?:</span><span style="color:#E1E4E8;"> </span><span style="color:#79B8FF;">boolean</span></span>
<span class="line"><span style="color:#E1E4E8;">  }&gt;(),</span></span>
<span class="line"><span style="color:#E1E4E8;">  {</span></span>
<span class="line"><span style="color:#E1E4E8;">    autoSize: </span><span style="color:#79B8FF;">true</span></span>
<span class="line"><span style="color:#E1E4E8;">  }</span></span>
<span class="line"><span style="color:#E1E4E8;">)</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#D73A49;">interface</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">SegmentedItem</span><span style="color:#24292E;"> {</span></span>
<span class="line"><span style="color:#24292E;">  </span><span style="color:#E36209;">label</span><span style="color:#D73A49;">:</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">string</span></span>
<span class="line"><span style="color:#24292E;">  </span><span style="color:#E36209;">value</span><span style="color:#D73A49;">:</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">string</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">|</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">number</span></span>
<span class="line"><span style="color:#24292E;">  </span><span style="color:#E36209;">disabled</span><span style="color:#D73A49;">?:</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">boolean</span></span>
<span class="line"><span style="color:#24292E;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#D73A49;">const</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">emits</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">defineEmits</span><span style="color:#24292E;">&lt;{</span></span>
<span class="line"><span style="color:#24292E;">  </span><span style="color:#032F62;">&#39;update:model-value&#39;</span><span style="color:#D73A49;">:</span><span style="color:#24292E;"> [</span><span style="color:#6F42C1;">value</span><span style="color:#24292E;">: </span><span style="color:#6F42C1;">SegmentedItem</span><span style="color:#24292E;">[</span><span style="color:#032F62;">&#39;value&#39;</span><span style="color:#24292E;">] </span><span style="color:#D73A49;">|</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">undefined</span><span style="color:#24292E;">]</span></span>
<span class="line"><span style="color:#24292E;">  </span><span style="color:#E36209;">change</span><span style="color:#D73A49;">:</span><span style="color:#24292E;"> [</span><span style="color:#6F42C1;">value</span><span style="color:#24292E;">: </span><span style="color:#6F42C1;">SegmentedItem</span><span style="color:#24292E;">[</span><span style="color:#032F62;">&#39;value&#39;</span><span style="color:#24292E;">] </span><span style="color:#D73A49;">|</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">undefined</span><span style="color:#24292E;">]</span></span>
<span class="line"><span style="color:#24292E;">}&gt;()</span></span>
<span class="line"></span>
<span class="line"><span style="color:#D73A49;">const</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">props</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">withDefaults</span><span style="color:#24292E;">(</span></span>
<span class="line"><span style="color:#24292E;">  </span><span style="color:#6F42C1;">defineProps</span><span style="color:#24292E;">&lt;{</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#E36209;">modelValue</span><span style="color:#D73A49;">?:</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">SegmentedItem</span><span style="color:#24292E;">[</span><span style="color:#032F62;">&#39;value&#39;</span><span style="color:#24292E;">]</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#E36209;">options</span><span style="color:#D73A49;">:</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">SegmentedItem</span><span style="color:#24292E;">[]</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#E36209;">block</span><span style="color:#D73A49;">?:</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">boolean</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#E36209;">size</span><span style="color:#D73A49;">?:</span><span style="color:#24292E;"> </span><span style="color:#032F62;">&#39;large&#39;</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">|</span><span style="color:#24292E;"> </span><span style="color:#032F62;">&#39;default&#39;</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">|</span><span style="color:#24292E;"> </span><span style="color:#032F62;">&#39;small&#39;</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#E36209;">disabled</span><span style="color:#D73A49;">?:</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">boolean</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#E36209;">autoSize</span><span style="color:#D73A49;">?:</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">boolean</span></span>
<span class="line"><span style="color:#24292E;">  }&gt;(),</span></span>
<span class="line"><span style="color:#24292E;">  {</span></span>
<span class="line"><span style="color:#24292E;">    autoSize: </span><span style="color:#005CC5;">true</span></span>
<span class="line"><span style="color:#24292E;">  }</span></span>
<span class="line"><span style="color:#24292E;">)</span></span></code></pre></div>`,2),e=[o];function t(c,r,E,y,i,F){return n(),a("div",null,e)}const u=s(p,[["render",t]]);export{m as __pageData,u as default};