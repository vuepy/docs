<template>
  <div id="api-index">
<!--    <div class="header">-->
    <div>
      <h1>
        <img class="logo" src="/images/vpanel-logo.svg" alt="vleaflet-logo" style='margin-bottom: 10px'>
        Panel-vuepy 组件总览
      </h1>
      <p style='margin: 2.5em 0 1em 0;'>
        Panel-vuepy 是基于 Vue.py 和 <a href='https://panel.holoviz.org/index.html' target='_blank'>Panel</a> 开发的现代化 Python 组件库。它结合了 Vuepy 的响应式开发能力与 Panel 强大的数据探索功能，为开发者提供了一套完整的解决方案：
      </p>
      <ul class="vt-doc" style='margin: 1em 0 1em 0;'>
        <li>* 丰富的交互式 UI 组件 - 开箱即用的现代化组件，轻松构建专业级界面</li>
        <li>* 深度 PyData 生态集成 - 无缝对接 Python 数据科学生态，实现流畅的数据可视化与分析</li>
        <li>* 高效的应用开发框架 - 结合 Vue.py 的响应式特性和 Panel 的灵活后端，快速开发交互式 Web 应用。</li>
      </ul>
      <p>
      无论是构建数据仪表盘、开发分析工具，还是创建复杂的业务应用，Panel Vuepy 都能让开发者以前端框架的体验享受 Python 的高效开发流程。
      </p>

      <slot></slot>
      <p style='margin: 1em 0 1em 0;'>以下是所有组件</p>
      <div class="api-filter">
        <input
          ref="search"
          type="search"
          placeholder="Search Components"
          id="api-filter"
          style='width: 100%'
          v-model="query"
        />
      </div>
    </div>

    <div
      v-for="section of filtered"
      :key="section.text"
      class="api-section"
    >
      <h2 :id="section.anchor" style='border-top: none'>
        {{ section.text }} <sup class="vt-badge" :data-text="section.items.length" />
      </h2>
      <div class="api-groups">
        <div
          v-for="item of section.items"
          :key="item.text"
          class="api-group"
        >
          <h3>
            <a :href="withBase(item.link) + '.html'">{{ item.text }}</a>
          </h3>
          <div class='thumbnail-box'>
            <img :src="`/images/panel_vuepy/${item.link.split('/').pop()}.png`"/>
          </div>
        </div>
      </div>
    </div>

    <div v-if="!filtered.length" class="no-match">
      没有匹配到 API "{{ query }}"
    </div>
    <div>
      Ref: <a href='https://panel.holoviz.org/reference/index.html' target='_blank'>Panel Component Gallery</a>
    </div>
  </div>
</template>
<script setup lang="ts">
// in .vue components or .md pages:
// named import "data" is the resolved static data
// can also import types for type consistency
import { data as apiIndex, APIGroup } from './ui.data'
import { ref, computed, onMounted } from 'vue'
import { withBase } from 'vitepress'

const search = ref()
const query = ref('')
const normalize = (s: string) => s.toLowerCase().replace(/-/g, ' ')

onMounted(() => {
  search.value?.focus()
})

const filtered = computed(() => {
  const q = normalize(query.value)
  const matches = (text: string) => normalize(text).includes(q)

  return apiIndex
    .map((section) => {
      // section title match
      if (matches(section.text)) {
        return section
      }

      // filter groups
      const matchedGroups = section.items
        .map((item) => {
          // group title match
          if (matches(item.text)) {
            return item
          }
          // ssr special case
          if (q.includes('ssr') && item.text.startsWith('Server')) {
            return item
          }
          // filter headers
          const matchedHeaders = item.headers.filter(
            ({ text, anchor }) => matches(text) || matches(anchor)
          )
          return matchedHeaders.length
            ? { text: item.text, link: item.link, headers: matchedHeaders }
            : null
        })
        .filter((i) => i)

      return matchedGroups.length
        ? { text: section.text, items: matchedGroups }
        : null
    })
    .filter((i) => i) as APIGroup[]
})
</script>

<style scoped>
#api-index {
  max-width: 1024px;
  margin: 0px auto;
  padding: 64px 32px;
}

h1,
h2,
h3 {
  font-weight: 600;
  line-height: 1;
}

h1,
h2 {
  letter-spacing: -0.02em;
}

h1 {
  font-size: 38px;
}

h2 {
  font-size: 24px;
  color: var(--vt-c-text-1);
  margin: 36px 0;
  transition: color 0.5s;
  padding-top: 36px;
  border-top: 1px solid var(--vt-c-divider-light);
}

h3 {
  letter-spacing: -0.01em;
  color: var(--vt-c-green);
  font-size: 18px;
  margin-bottom: 1em;
  transition: color 0.5s;
}

.api-section {
  margin-bottom: 64px;
}

.api-groups a {
  font-size: 15px;
  font-weight: 500;
  line-height: 2;
  color: var(--vt-c-text-code);
  transition: color 0.5s;
}

.dark api-groups a {
  font-weight: 400;
}

.api-groups a:hover {
  color: var(--vt-c-green);
  transition: none;
}

.api-group {
  break-inside: avoid;
  overflow: auto;
  margin-bottom: 20px;
  background-color: var(--vt-c-bg-soft);
  border-radius: 8px;
  padding: 24px 28px;
  transition: background-color 0.5s;
}

.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.thumbnail-box {
  /* width: 100%; */
  /* height: 240px; */
}

.api-filter {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 1rem;
}

#api-filter {
  border: 1px solid var(--vt-c-divider);
  border-radius: 8px;
  padding: 6px 12px;
  transition: box-shadow 0.25s ease;
}

#api-filter:focus {
  /*box-shadow: 0 0 4pt #00d47499;*/
  box-shadow: 0 0 4pt #16B8F399;
}

.api-filter:focus {
  border-color: var(--vt-c-green-light);
}

.no-match {
  font-size: 1.2em;
  color: var(--vt-c-text-3);
  text-align: center;
  margin-top: 36px;
  padding-top: 36px;
  border-top: 1px solid var(--vt-c-divider-light);
}

.logo {
  display: inline;
  max-width: 40px;
}

@media (max-width: 768px) {
  #api-index {
    padding: 42px 24px;
  }
  h1 {
    font-size: 32px;
    margin-bottom: 24px;
  }
  h2 {
    font-size: 22px;
    margin: 42px 0 32px;
    padding-top: 32px;
  }
  .api-groups a {
    font-size: 14px;
  }
  .header {
    display: block;
  }
}

@media (min-width: 768px) {
  .api-groups {
    columns: 2;
  }
}

@media (min-width: 1024px) {
  /* .api-groups {
    columns: 4;
  } */
  .api-groups {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 15px; 
  } 
  .api-group {
    margin-bottom: 0px;
  }
}
</style>
