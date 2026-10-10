<script setup lang="ts">
useHead({
  htmlAttrs: { lang: 'zh-CN' },
  meta: [{ name: 'theme-color', content: '#f6f4ee' }],
})

useSeoMeta({
  title: '拾光 Maison · 法式中古居所 — M4N9O',
  description: '根据 C2 四室两厅两卫户型制作的 Three.js 法式中古装修方案，可查看全屋鸟瞰、平面布局和室内漫游。',
  ogTitle: '拾光 Maison · 法式中古居所 — M4N9O',
  ogDescription: '奶油白、胡桃木、橄榄绿与黄铜构成的交互三维住宅设计。',
})
</script>

<template>
  <main class="home-lab">
    <header class="home-lab__bar">
      <NuxtLink to="/lab">← Lab</NuxtLink>
      <span>./lab/home</span>
    </header>
    <iframe
      class="home-lab__viewer"
      src="/lab/home-viewer/index.html"
      title="拾光 Maison：C2 法式中古装修三维查看器"
      allow="fullscreen"
      allowfullscreen
    />
  </main>
</template>

<style scoped>
.home-lab {
  display: flex;
  flex-direction: column;
  height: 100dvh;
  min-height: 320px;
  background: #f6f4ee;
  color: #343b31;
}

.home-lab__bar {
  display: flex;
  flex: 0 0 34px;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 0 1rem;
  border-bottom: 1px solid #deded3;
  font-size: 0.75rem;
}

.home-lab__bar a {
  color: #46543d;
  text-decoration: none;
}

.home-lab__bar a:hover {
  text-decoration: underline;
}

.home-lab__bar a:focus-visible {
  outline: 2px solid #46543d;
  outline-offset: 3px;
}

.home-lab__bar span {
  color: #7e8074;
}

.home-lab__viewer {
  display: block;
  flex: 1;
  width: 100%;
  min-height: 0;
  border: 0;
}
</style>
