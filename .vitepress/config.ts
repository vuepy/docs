import fs from 'fs'
import path from 'path'
import * as cheerio from 'cheerio'
import he from 'he'
import { defineConfigWithTheme } from 'vitepress'
import type { Config as ThemeConfig } from '@vue/theme'
import baseConfig from '@vue/theme/config'
import { headerPlugin } from './headerMdPlugin'
import { mdPlugin } from './plugins/ipynb-markdown-transform'
import { textualVuepyDemoPlugin } from './plugins/textual-vuepy-demo'
import tableWrapper from './plugins/table-wrapper'
import tooltip from './plugins/tooltip'
import { generateLLMSTXTPlugin } from './plugins/generate-llms'
// import { textAdPlugin } from './textAdMdPlugin'

const { BASE: base = '/' } = process.env

export const REPO_URL = 'https://github.com/vuepy/docs/blob/main/'

const nav: ThemeConfig['nav'] = [
  {
    text: '文档',
    activeMatch: `^/(guide|style-guide|cookbook|examples)/`,
    items: [
      { text: '深度指南', link: '/guide/introduction' },
      // { text: '互动教程', link: '/tutorial/' },
      { text: '快速上手', link: '/guide/quick-start' },
      // { text: '示例', link: '/examples/' },  // todo 仅用于提供思路，添加python部分的实现
      // { text: '风格指南', link: '/style-guide/' },
      { text: '术语表', link: '/glossary/' },
      // { text: '错误码参照表', link: '/error-reference/' },
      // {
      //   text: 'Vue 2 文档',
      //   link: 'https://v2.cn.vuejs.org'
      // },
      // {
      //   text: '从 Vue 2 迁移',
      //   link: 'https://v3-migration.vuejs.org/'
      // }
    ]
  },
  {
    text: 'API',
    activeMatch: `^/api/`,
    link: '/api/'
  },
  {
    text: '组件库',
    activeMatch: `^/(ipywui|vleaflet|panel_vuepy|textual_vuepy)/`,
    items: [
      { text: 'IPywUI', link: '/ipywui/overview' },
      { text: 'Panel-vuepy', link: '/panel_vuepy/quick-start' },
      { text: 'Textual-vuepy', link: '/textual_vuepy/quick-start/quick-start' },
      { text: 'vleaflet', link: '/vleaflet/overview' },
    ]
  },
  // {
  //   text: '演练场',
  //   link: 'https://play.vuejs.org'
  // },
  {
    text: '生态系统',
    activeMatch: `^/ecosystem/`,
    items: [
      {
        text: '资源',
        items: [

          /*
          <!-- todo 暂不支持
          { text: '合作伙伴', link: '/partners/' },
           */
          { text: '主题', link: '/ecosystem/themes' },
          // { text: 'UI 组件', link: 'https://ui-libs.vercel.app/' },
          // {
          //   text: '证书',
          //   link: 'https://certification.vuejs.org/?ref=vuejs-nav'
          // },
          // { text: '找工作', link: 'https://vuejobs.com/?ref=vuejs' },
          // { text: 'T-Shirt 商店', link: 'https://vue.threadless.com/' }
        ]
      },
      {
        text: '官方库',
        items: [
          { text: 'IPywUI', link: '/ipywui/overview' },
          { text: 'Panel-vuepy', link: '/panel_vuepy/quick-start' },
          { text: 'Textual-vuepy', link: '/textual_vuepy/quick-start/quick-start' },
          { text: 'vleaflet', link: '/vleaflet/overview' },
          // { text: 'Vue Router', link: 'https://router.vuejs.org/zh/' },
          // { text: 'Pinia', link: 'https://pinia.vuejs.org/zh/' },
          // { text: '工具链指南', link: '/guide/scaling-up/tooling.html' }
        ]
      },
      // {
      //   text: '视频课程',
      //   items: [
      //     {
      //       text: 'Vue Mastery',
      //       link: 'https://www.vuemastery.com/courses/'
      //     },
      //     {
      //       text: 'Vue School',
      //       link: 'https://vueschool.io/?friend=vuejs&utm_source=Vuejs.org&utm_medium=Link&utm_content=Navbar%20Dropdown'
      //     }
      //   ]
      // },
      {
        text: '帮助',
        items: [
          // {
          //   text: 'Discord 聊天室',
          //   link: 'https://discord.com/invite/HBherRA'
          // },
          {
            text: 'GitHub 论坛',
            link: 'https://github.com/vuepy/vuepy/discussions'
          },
          // { text: 'DEV Community', link: 'https://dev.to/t/vue' }
        ]
      },
      {
        text: '动态',
        items: [
          { text: '博客', link: 'https://blog.vuepy.org/' },
          // { text: 'Twitter', link: 'https://twitter.com/vuejs' },
          // { text: '活动', link: 'https://events.vuejs.org/' },
          { text: '新闻简报', link: '/ecosystem/newsletters' }
        ]
      }
    ]
  },
  {
    text: '关于',
    activeMatch: `^/about/`,
    items: [
      { text: '常见问题', link: '/about/faq' },
      { text: '团队', link: '/about/team' },
      /*
      <!-- todo 暂不支持
      { text: '版本发布', link: '/about/releases' },
      {
        text: '社区指南',
        link: '/about/community-guide'
      },
      */
      { text: '行为规范', link: '/about/coc' },
      // {
      //   text: '纪录片',
      //   link: 'https://www.youtube.com/watch?v=OrxmtDw4pVI'
      // }
    ]
  },
  /*
  <!-- todo 暂不支持
  {
    text: '赞助',
    link: '/sponsor/'
  },
  */

  /*
  <!-- todo 暂不支持
  {
    text: '合作伙伴',
    link: '/partners/',
    activeMatch: `^/partners/`
  }
   */
]

export const sidebar: ThemeConfig['sidebar'] = {
  '/guide/': [
    {
      text: '开始',
      items: [
        { text: '简介', link: '/guide/introduction' },
        {
          text: '快速上手',
          link: '/guide/quick-start'
        },
        {
          text: '使用 LLMs 开发 Vuepy 应用',
          link: '/guide/build-vuepy-withs-llms'
        }
      ]
    },
    {
      text: '基础',
      items: [
        {
          text: '创建一个应用',
          link: '/guide/essentials/application'
        },
        {
          text: '模板语法',
          link: '/guide/essentials/template-syntax'
        },
        {
          text: '响应式基础',
          link: '/guide/essentials/reactivity-fundamentals'
        },
        {
          text: '计算属性',
          link: '/guide/essentials/computed'
        },
        {
          text: '类与样式绑定',
          link: '/guide/essentials/class-and-style'
        },
        {
          text: '条件渲染',
          link: '/guide/essentials/conditional'
        },
        { text: '列表渲染', link: '/guide/essentials/list' },
        {
          text: '事件处理',
          link: '/guide/essentials/event-handling'
        },
        { text: '表单输入绑定', link: '/guide/essentials/forms' },
        {
          text: '生命周期',
          link: '/guide/essentials/lifecycle',
          llms_ignore: true
        },
        { text: '侦听器', link: '/guide/essentials/watchers' },
        { text: '模板引用', link: '/guide/essentials/template-refs' },
        {
          text: '组件基础',
          link: '/guide/essentials/component-basics'
        }
      ]
    },
    {
      text: '深入组件',
      items: [
        {
          text: '注册',
          link: '/guide/components/registration'
        },
        { text: 'Props', link: '/guide/components/props' },
        { text: '事件', link: '/guide/components/events' },
        { text: '组件 v-model', link: '/guide/components/v-model' },
        {
          text: '透传 Attributes',
          link: '/guide/components/attrs',
          llms_ignore: true
        },
        { text: '插槽', link: '/guide/components/slots' },
        {
          text: '依赖注入',
          link: '/guide/components/provide-inject',
          llms_ignore: true
        },
        {
          text: '异步组件',
          link: '/guide/components/async',
          llms_ignore: true
        }
      ]
    },
    {
      text: '逻辑复用',
      items: [
        {
          text: '组合式函数',
          link: '/guide/reusability/composables'
        },
        {
          text: '自定义指令',
          link: '/guide/reusability/custom-directives',
          llms_ignore: true
        },
        { text: '插件', link: '/guide/reusability/plugins' }
      ]
    },
    {
      text: '组件库',
      items: [
        { text: 'ipywui 组件库', link: '/ipywui/overview' },
        { text: 'Panel-vuepy 组件库', link: '/panel_vuepy/quick-start' },
        { text: 'Textual-vuepy 终端 TUI 组件库', link: '/textual_vuepy/quick-start/quick-start' },
        { text: 'vleaflet 组件库', link: '/vleaflet/overview' },
        { text: '集成 anywidget', link: '/guide/Integration-with-anywidget' },
        // { text: 'Transition', link: '/guide/built-ins/transition' },
        // {
        //   text: 'TransitionGroup',
        //   link: '/guide/built-ins/transition-group'
        // },
        // { text: 'KeepAlive', link: '/guide/built-ins/keep-alive' },
        // { text: 'Teleport', link: '/guide/built-ins/teleport' },
        // { text: 'Suspense', link: '/guide/built-ins/suspense' }
      ]
    },
    {
      text: '应用规模化',
      items: [
        { text: '单文件组件', link: '/guide/scaling-up/sfc' },
        { text: '工具链', link: '/guide/scaling-up/tooling' },
        {
          text: '路由',
          link: '/guide/scaling-up/routing',
          llms_ignore: true
        },
        {
          text: '状态管理',
          link: '/guide/scaling-up/state-management',
          llms_ignore: true
        },
        {
          text: '测试',
          link: '/guide/scaling-up/testing',
          llms_ignore: true
        },
        // {
        //   text: '服务端渲染 (SSR)',
        //   link: '/guide/scaling-up/ssr'
        // }
      ]
    },
    {
      text: '最佳实践',
      items: [
        // {
        //   text: '生产部署',
        //   link: '/guide/best-practices/production-deployment'
        // },
        // {
        //   text: '性能优化',
        //   link: '/guide/best-practices/performance'
        // },
        // {
        //   text: '无障碍访问',
        //   link: '/guide/best-practices/accessibility'
        // },
        {
          text: '使用 LLMs 辅助开发 vleaflet',
          link: '/guide/best-practices/dev-vleaflet-with-llms'
        },
        {
          text: '安全',
          link: '/guide/best-practices/security'
        }
      ]
    },
    // {
    //   text: 'TypeScript',
    //   items: [
    //     { text: '总览', link: '/guide/typescript/overview' },
    //     {
    //       text: 'TS 与组合式 API',
    //       link: '/guide/typescript/composition-api'
    //     },
    //     {
    //       text: 'TS 与选项式 API',
    //       link: '/guide/typescript/options-api'
    //     }
    //   ]
    // },
    /*
    {
      text: '进阶主题',
      items: [
        {
          text: '使用 Vue 的多种方式',
          link: '/guide/extras/ways-of-using-vue'
        },
        {
          text: '组合式 API 常见问答',
          link: '/guide/extras/composition-api-faq'
        },
        {
          text: '深入响应式系统',
          link: '/guide/extras/reactivity-in-depth'
        },
        {
          text: '渲染机制',
          link: '/guide/extras/rendering-mechanism'
        },
        {
          text: '渲染函数 & JSX',
          link: '/guide/extras/render-function'
        },
        {
          text: 'Vue 与 Web Components',
          link: '/guide/extras/web-components'
        },
        {
          text: '动画技巧',
          link: '/guide/extras/animation'
        }
        // {
        //   text: '为 Vue 构建一个库',
        //   link: '/guide/extras/building-a-library'
        // },
        // {
        //   text: 'Vue for React 开发者',
        //   link: '/guide/extras/vue-for-react-devs'
        // }
      ]
    }
     */
  ],
  '/api/': [
    {
      text: '全局 API',
      items: [
        { text: '应用实例', link: '/api/application' },
        { text: '应用管理', link: '/api/appstore' },
        {
          text: '通用',
          link: '/api/general'
        },
        { text: '日志系统', link: '/api/log' },
        { text: 'IPython Magic', link: '/api/ipython-magic' },
      ]
    },
    {
      text: '组合式 API',
      items: [
        { text: 'setup()', link: '/api/composition-api-setup' },
        {
          text: '响应式: 核心',
          link: '/api/reactivity-core'
        },
        {
          text: '响应式: 工具',
          link: '/api/reactivity-utilities'
        },
        {
          text: '响应式: 进阶',
          link: '/api/reactivity-advanced'
        },
        {
          text: '生命周期钩子',
          link: '/api/composition-api-lifecycle'
        },
        {
          text: '依赖注入',
          link: '/api/composition-api-dependency-injection'
        }
      ]
    },
    // {
    //   text: '选项式 API',
    //   items: [
    //     { text: '状态选项', link: '/api/options-state' },
    //     { text: '渲染选项', link: '/api/options-rendering' },
    //     {
    //       text: '生命周期选项',
    //       link: '/api/options-lifecycle'
    //     },
    //     {
    //       text: '组合选项',
    //       link: '/api/options-composition'
    //     },
    //     { text: '其他杂项', link: '/api/options-misc' },
    //     {
    //       text: '组件实例',
    //       link: '/api/component-instance'
    //     }
    //   ]
    // },
    {
      text: '内置内容',
      items: [
        { text: '指令', link: '/api/built-in-directives' },
        { text: '组件', link: '/api/built-in-components' },
        {
          text: '特殊元素',
          link: '/api/built-in-special-elements'
        },
        {
          text: '特殊 Attributes',
          link: '/api/built-in-special-attributes'
        }
      ]
    },
    {
      text: '单文件组件',
      items: [
        { text: '语法定义', link: '/api/sfc-spec' },
        { text: '<script lang="py">', link: '/api/sfc-script-setup' },
        { text: 'CSS 功能', link: '/api/sfc-css-features' },
        { text: '作为 Python 模块导入', link: '/api/sfc-import-sfc' },
      ]
    },
    {
      text: '进阶 API',
      items: [
        // { text: '渲染函数', link: '/api/render-function' },
        // { text: '服务端渲染', link: '/api/ssr' },
        // { text: 'TypeScript 工具类型', link: '/api/utility-types' },
        { text: '自定义渲染', link: '/api/custom-renderer' },
        // { text: '编译时标志', link: '/api/compile-time-flags' },
      ]
    }
  ],
  '/ipywui/': [
    {
      text: 'Overview 组件总览',
      items: [
        {text: 'IPywUI UI 组件', link: '/ipywui/overview'},
      ]
    },
    {
      text: 'Basic 基础组件',
      items: [
        {text: 'Button 按钮', link: '/ipywui/button'},
        {text: 'Layout 布局', link: '/ipywui/layout'},
        {text: 'App Layout 应用布局容器', link: '/ipywui/layout-app'},
        {text: 'Box Layout 基本布局', link: '/ipywui/layout-box'},
      ]
    },
    {
      text: 'Form 表单组件',
      items: [
        {text: 'Checkbox 多选框', link: '/ipywui/checkbox'},
        {text: 'ColorPicker 颜色选择器', link: '/ipywui/color-picker'},
        {text: 'ComboBox 选择输入框', link: '/ipywui/combobox'},
        {text: 'Date Picker 日期选择器', link: '/ipywui/date-picker'},
        {text: 'DateTime Picker 日期时间选择', link: '/ipywui/datetime-picker'},
        {text: 'Time Picker 时间选择器', link: '/ipywui/time-picker'},
        {text: 'Input 输入框', link: '/ipywui/input'},
        {text: 'Input Number 数字输入框', link: '/ipywui/input-number'},
        {text: 'Radio 单选框', link: '/ipywui/radio'},
        {text: 'Select 选择器', link: '/ipywui/select'},
        {text: 'Select Colors 颜色列表选择器', link: '/ipywui/select-colors'},
        {text: 'Select Numbers 数字列表选择', link: '/ipywui/select-numbers'},
        {text: 'Select Tags 标签列表选择器', link: '/ipywui/select-tags'},
        {text: 'Slider 滑块', link: '/ipywui/slider'},
        {text: 'Toggle Button 开关', link: '/ipywui/toggle-button'},
        {text: 'Toggle Buttons 切换按钮', link: '/ipywui/toggle-buttons'},
        {text: 'File Upload 上传', link: '/ipywui/file-upload'},
      ]
    },
    {
      text: 'Data 数据展示',
      items: [
        {text: 'Accordion 折叠面板', link: '/ipywui/accordion'},
        {text: 'Display 组件展示器', link: '/ipywui/display'},
        {text: 'Image 图片', link: '/ipywui/image'},
        {text: 'Label 标签', link: '/ipywui/label'},
        {text: 'Markdown 查看器', link: '/ipywui/markdown-viewer'},
        {text: 'Play 播放器', link: '/ipywui/play'},
        {text: 'Progress 进度条', link: '/ipywui/progress'},
        {text: 'Valid 状态指示器', link: '/ipywui/valid'},
      ]
    },
    {
      text: 'Navigation 导航',
      items: [
        {text: 'Dropdown 下拉菜单', link: '/ipywui/dropdown'},
        {text: 'Tabs 标签页', link: '/ipywui/tabs'},
        {text: 'Stack 组件栈', link: '/ipywui/stack'},
      ]
    },
    {
      text: 'Feedback 反馈组件',
      items: [
        {text: 'Dialog 对话框', link: '/ipywui/dialog'},
        {text: 'Message 消息提示', link: '/ipywui/message'},
      ]
    },
    {
      text: 'Other 其他',
      items: [
        {text: 'Clipboard 剪贴板组件', link: '/ipywui/clipboard'},
        {text: 'Controller 游戏控制器', link: '/ipywui/controller'},
        {text: '集成第三方小组件', link: '/ipywui/display'},
      ]
    },
  ],
  '/vleaflet/': [
    {
      text: 'Overview 组件总览',
      items: [
        {text: 'VLeaflet 组件总览', link: '/vleaflet/overview'},
      ]
    },
    {
      text: 'Basic 基础组件',
      items: [
        {text: '🔥 快速上手', link: '/vleaflet/quick-start'},
        {text: 'Map 地图', link: '/vleaflet/map'},
        {text: 'Basemaps 底图', link: '/vleaflet/basemaps'},
      ]
    },
    {
      text: 'Layers 图层组件',
      items: [
        {text: 'TileLayer 瓦片图层', link: '/vleaflet/layers/tile-layer'},
        {text: 'LocalTileLayer 本地瓦片图层', link: '/vleaflet/layers/local-tile-layer'},
        {text: 'MagnifyingGlass 放大镜', link: '/vleaflet/layers/magnifying-glass'},
        {text: 'Marker 标记', link: '/vleaflet/layers/marker'},
        {text: 'MarkerCluster 标记聚合', link: '/vleaflet/layers/marker-cluster'},
        {text: 'Icon 图标', link: '/vleaflet/layers/icon'},
        {text: 'DivIcon 自定义图标', link: '/vleaflet/layers/div-icon'},
        {text: 'AwesomeIcon 字体图标', link: '/vleaflet/layers/awesome-icon'},
        {text: 'Popup 弹出框', link: '/vleaflet/layers/popup'},
        {text: 'WMS Layer WMS图层', link: '/vleaflet/layers/wms-layer'},
        {text: 'ImageOverly 图片覆盖层', link: '/vleaflet/layers/image-overly'},
        {text: 'ImageService 图片服务', link: '/vleaflet/layers/image-service'},
        {text: 'AntPath 蚂蚁线', link: '/vleaflet/layers/ant-path'},
        {text: 'Polyline 折线', link: '/vleaflet/layers/polyline'},
        {text: 'Polygon 多边形', link: '/vleaflet/layers/polygon'},
        {text: 'Rectangle 矩形', link: '/vleaflet/layers/rectangle'},
        {text: 'Circle 圆形', link: '/vleaflet/layers/circle'},
        {text: 'CircleMarker 圆形标记', link: '/vleaflet/layers/circle-marker'},
        {text: 'Heatmap 热力图', link: '/vleaflet/layers/heatmap'},
        {text: 'Velocity 速度场图层', link: '/vleaflet/layers/velocity'},
        {text: 'LayerGroup 图层组', link: '/vleaflet/layers/layer-group'},
        {text: 'GeoJson GeoJSON数据', link: '/vleaflet/layers/geo-json'},
        {text: 'GeoData 地理数据', link: '/vleaflet/layers/geo-data'},
        {text: 'Choropleth 等值区域图', link: '/vleaflet/layers/choropleth'},
        {text: 'VectorTileLayer 矢量瓦片图层', link: '/vleaflet/layers/vector-tile-layer'},
        {text: 'WKTLayer WKT图层', link: '/vleaflet/layers/wkt-layer'},
        {text: 'LayerLikeObjects 图层对象', link: '/vleaflet/layers/layer-like-objects'},
      ]
    },
    {
      text: 'Controls 控件组件',
      items: [
        {text: 'Zoom 缩放控件', link: '/vleaflet/controls/zoom'},
        {text: 'Scale 比例尺', link: '/vleaflet/controls/scale'},
        {text: 'Layers 图层控制', link: '/vleaflet/controls/layers'},
        {text: 'Fullscreen 全屏', link: '/vleaflet/controls/fullscreen'},
        {text: 'Measure 测量工具', link: '/vleaflet/controls/measure'},
        {text: 'SplitMap 分屏地图', link: '/vleaflet/controls/split-map'},
        {text: 'GeomanDraw 绘图工具', link: '/vleaflet/controls/geoman-draw'},
        {text: 'Widget 小部件', link: '/vleaflet/controls/widget'},
        {text: 'Legend 图例', link: '/vleaflet/controls/legend'},
        {text: 'Search 搜索控件', link: '/vleaflet/controls/search'},
      ]
    }
  ],
  '/panel_vuepy/': [
    {
      text: 'Overview 总览',
      items: [
        {text: '快速上手', link: '/panel_vuepy/quick-start'},
        {text: 'Panel-vuepy 组件总览', link: '/panel_vuepy/overview'},
      ]
    },
    {
      text: 'Chat 组件',
      items: [
        {text: 'ChatInterface 聊天界面', link: '/panel_vuepy/chat/ChatInterface'},
        {text: 'ChatAreaInput 聊天输入区域', link: '/panel_vuepy/chat/ChatAreaInput'},
        {text: 'ChatFeed 聊天信息流', link: '/panel_vuepy/chat/ChatFeed'},
        {text: 'ChatMessage 聊天消息', link: '/panel_vuepy/chat/ChatMessage'},
        {text: 'ChatStep 聊天步骤', link: '/panel_vuepy/chat/ChatStep'},
        {text: 'PanelCallbackHandler 回调处理器', link: '/panel_vuepy/chat/PanelCallbackHandler'},
      ]
    },
    {
      text: 'Widgets 组件',
      items: [
        {text: 'ArrayInput 数组输入框', link: '/panel_vuepy/widgets/ArrayInput'},
        {text: 'AutocompleteInput 自动完成输入', link: '/panel_vuepy/widgets/AutocompleteInput'},
        {text: 'Button 按钮', link: '/panel_vuepy/widgets/Button'},
        {text: 'ButtonIcon 图标按钮', link: '/panel_vuepy/widgets/ButtonIcon'},
        {text: 'CheckBoxGroup 复选框组', link: '/panel_vuepy/widgets/CheckBoxGroup'},
        {text: 'CheckButtonGroup 复选按钮组', link: '/panel_vuepy/widgets/CheckButtonGroup'},
        {text: 'Checkbox 复选框', link: '/panel_vuepy/widgets/Checkbox'},
        {text: 'CodeEditor 代码编辑器', link: '/panel_vuepy/widgets/CodeEditor'},
        {text: 'ColorMap 颜色映射', link: '/panel_vuepy/widgets/ColorMap'},
        {text: 'ColorPicker 颜色选择器', link: '/panel_vuepy/widgets/ColorPicker'},
        {text: 'CrossSelector 交叉选择器', link: '/panel_vuepy/widgets/CrossSelector'},
        {text: 'DatePicker 日期选择器', link: '/panel_vuepy/widgets/DatePicker'},
        {text: 'DateRangePicker 日期范围选择器', link: '/panel_vuepy/widgets/DateRangePicker'},
        {text: 'DateRangeSlider 日期范围滑块', link: '/panel_vuepy/widgets/DateRangeSlider'},
        {text: 'DateSlider 日期滑块', link: '/panel_vuepy/widgets/DateSlider'},
        {text: 'DatetimeInput 日期时间输入', link: '/panel_vuepy/widgets/DatetimeInput'},
        {text: 'DatetimePicker 日期时间选择器', link: '/panel_vuepy/widgets/DatetimePicker'},
        {text: 'DatetimeRangeInput 日期时间范围输入', link: '/panel_vuepy/widgets/DatetimeRangeInput'},
        {text: 'DatetimeRangePicker 日期时间范围选择器', link: '/panel_vuepy/widgets/DatetimeRangePicker'},
        {text: 'DatetimeRangeSlider 日期时间范围滑块', link: '/panel_vuepy/widgets/DatetimeRangeSlider'},
        {text: 'DatetimeSlider 日期时间滑块', link: '/panel_vuepy/widgets/DatetimeSlider'},
        {text: 'Debugger 调试器', link: '/panel_vuepy/widgets/Debugger'},
        {text: 'DiscretePlayer 离散播放器', link: '/panel_vuepy/widgets/DiscretePlayer'},
        {text: 'DiscreteSlider 离散滑块', link: '/panel_vuepy/widgets/DiscreteSlider'},
        {text: 'Display 显示组件', link: '/panel_vuepy/widgets/Display'},
        {text: 'EditableFloatSlider 可编辑浮点滑块', link: '/panel_vuepy/widgets/EditableFloatSlider'},
        {text: 'EditableIntSlider 可编辑整数滑块', link: '/panel_vuepy/widgets/EditableIntSlider'},
        {text: 'EditableRangeSlider 可编辑范围滑块', link: '/panel_vuepy/widgets/EditableRangeSlider'},
        {text: 'FileDownload 文件下载', link: '/panel_vuepy/widgets/FileDownload'},
        {text: 'FileDropper 文件拖放', link: '/panel_vuepy/widgets/FileDropper'},
        {text: 'FileInput 文件输入', link: '/panel_vuepy/widgets/FileInput'},
        {text: 'FileSelector 文件选择器', link: '/panel_vuepy/widgets/FileSelector'},
        {text: 'FloatInput 浮点数输入', link: '/panel_vuepy/widgets/FloatInput'},
        {text: 'FloatSlider 浮点数滑块', link: '/panel_vuepy/widgets/FloatSlider'},
        {text: 'IntInput 整数输入', link: '/panel_vuepy/widgets/IntInput'},
        {text: 'IntRangeSlider 整数范围滑块', link: '/panel_vuepy/widgets/IntRangeSlider'},
        {text: 'IntSlider 整数滑块', link: '/panel_vuepy/widgets/IntSlider'},
        {text: 'JSONEditor JSON编辑器', link: '/panel_vuepy/widgets/JSONEditor'},
        {text: 'LiteralInput 文本输入', link: '/panel_vuepy/widgets/LiteralInput'},
        {text: 'MenuButton 菜单按钮', link: '/panel_vuepy/widgets/MenuButton'},
        {text: 'MultiChoice 多选', link: '/panel_vuepy/widgets/MultiChoice'},
        {text: 'MultiSelect 多选选择器', link: '/panel_vuepy/widgets/MultiSelect'},
        {text: 'NestedSelect 嵌套选择器', link: '/panel_vuepy/widgets/NestedSelect'},
        {text: 'PasswordInput 密码输入', link: '/panel_vuepy/widgets/PasswordInput'},
        {text: 'Player 播放器', link: '/panel_vuepy/widgets/Player'},
        {text: 'RadioBoxGroup 单选框组', link: '/panel_vuepy/widgets/RadioBoxGroup'},
        {text: 'RadioButtonGroup 单选按钮组', link: '/panel_vuepy/widgets/RadioButtonGroup'},
        {text: 'RangeSlider 范围滑块', link: '/panel_vuepy/widgets/RangeSlider'},
        {text: 'Select 选择器', link: '/panel_vuepy/widgets/Select'},
        {text: 'SpeechToText 语音转文字', link: '/panel_vuepy/widgets/SpeechToText'},
        {text: 'StaticText 静态文本', link: '/panel_vuepy/widgets/StaticText'},
        {text: 'Switch 开关', link: '/panel_vuepy/widgets/Switch'},
        {text: 'Tabulator 表格', link: '/panel_vuepy/widgets/Tabulator'},
        {text: 'Terminal 终端', link: '/panel_vuepy/widgets/Terminal'},
        {text: 'TextAreaInput 文本区域输入', link: '/panel_vuepy/widgets/TextAreaInput'},
        {text: 'TextEditor 文本编辑器', link: '/panel_vuepy/widgets/TextEditor'},
        {text: 'TextInput 文本输入', link: '/panel_vuepy/widgets/TextInput'},
        {text: 'TextToSpeech 文字转语音', link: '/panel_vuepy/widgets/TextToSpeech'},
        {text: 'TimePicker 时间选择器', link: '/panel_vuepy/widgets/TimePicker'},
        {text: 'Toggle 切换按钮', link: '/panel_vuepy/widgets/Toggle'},
        {text: 'ToggleGroup 切换按钮组', link: '/panel_vuepy/widgets/ToggleGroup'},
        {text: 'ToggleIcon 切换图标', link: '/panel_vuepy/widgets/ToggleIcon'},
        {text: 'VideoStream 视频流', link: '/panel_vuepy/widgets/VideoStream'},
      ]
    },
    {
      text: 'Panes 组件',
      items: [
        {text: 'Alert 警告', link: '/panel_vuepy/panes/Alert'},
        {text: 'Audio 音频', link: '/panel_vuepy/panes/Audio'},
        {text: 'Bokeh 图表', link: '/panel_vuepy/panes/Bokeh'},
        {text: 'DataFrame 数据框', link: '/panel_vuepy/panes/DataFrame'},
        {text: 'DeckGL', link: '/panel_vuepy/panes/DeckGL'},
        {text: 'ECharts 图表', link: '/panel_vuepy/panes/ECharts'},
        {text: 'Folium 地图', link: '/panel_vuepy/panes/Folium'},
        {text: 'GIF 图像', link: '/panel_vuepy/panes/GIF'},
        {text: 'HTML', link: '/panel_vuepy/panes/HTML'},
        {text: 'HoloViews 图表', link: '/panel_vuepy/panes/HoloViews'},
        {text: 'IPyWidget 小部件', link: '/panel_vuepy/panes/IPyWidget'},
        {text: 'Image 图像', link: '/panel_vuepy/panes/Image'},
        {text: 'JPG 图像', link: '/panel_vuepy/panes/JPG'},
        {text: 'JSON 数据', link: '/panel_vuepy/panes/JSON'},
        {text: 'LaTeX 公式', link: '/panel_vuepy/panes/LaTeX'},
        {text: 'Markdown 文本', link: '/panel_vuepy/panes/Markdown'},
        {text: 'Matplotlib 图表', link: '/panel_vuepy/panes/Matplotlib'},
        {text: 'PDF 文档', link: '/panel_vuepy/panes/PDF'},
        {text: 'PNG 图像', link: '/panel_vuepy/panes/PNG'},
        {text: 'Param 参数', link: '/panel_vuepy/panes/Param'},
        {text: 'Perspective 数据表', link: '/panel_vuepy/panes/Perspective'},
        {text: 'Placeholder 占位符', link: '/panel_vuepy/panes/Placeholder'},
        {text: 'Plotly 图表', link: '/panel_vuepy/panes/Plotly'},
        {text: 'ReactiveExpr 响应式表达式', link: '/panel_vuepy/panes/ReactiveExpr'},
        {text: 'Reacton', link: '/panel_vuepy/panes/Reacton'},
        {text: 'SVG 矢量图', link: '/panel_vuepy/panes/SVG'},
        {text: 'Str 字符串', link: '/panel_vuepy/panes/Str'},
        {text: 'Streamz 流数据', link: '/panel_vuepy/panes/Streamz'},
        {text: 'Textual 文本', link: '/panel_vuepy/panes/Textual'},
        {text: 'VTK 3D可视化', link: '/panel_vuepy/panes/VTK'},
        {text: 'VTKJS 3D可视化', link: '/panel_vuepy/panes/VTKJS'},
        {text: 'VTKVolume 体积渲染', link: '/panel_vuepy/panes/VTKVolume'},
        {text: 'Vega 图表', link: '/panel_vuepy/panes/Vega'},
        {text: 'Video 视频', link: '/panel_vuepy/panes/Video'},
        {text: 'Vizzu 图表', link: '/panel_vuepy/panes/Vizzu'},
        {text: 'WebP 图像', link: '/panel_vuepy/panes/WebP'},
      ]
    },
    {
      text: 'Layouts 组件',
      items: [
        {text: 'Accordion 手风琴', link: '/panel_vuepy/layouts/Accordion'},
        {text: 'Card 卡片', link: '/panel_vuepy/layouts/Card'},
        {text: 'Column 列布局', link: '/panel_vuepy/layouts/Column'},
        {text: 'Divider 分隔线', link: '/panel_vuepy/layouts/Divider'},
        {text: 'Feed 信息流', link: '/panel_vuepy/layouts/Feed'},
        {text: 'FlexBox 弹性盒子', link: '/panel_vuepy/layouts/FlexBox'},
        {text: 'FloatPanel 浮动面板', link: '/panel_vuepy/layouts/FloatPanel'},
        {text: 'GridBox 网格布局', link: '/panel_vuepy/layouts/GridBox'},
        {text: 'GridSpec 网格规格', link: '/panel_vuepy/layouts/GridSpec'},
        {text: 'GridStack 可拖拽网格', link: '/panel_vuepy/layouts/GridStack'},
        {text: 'Modal 模态框', link: '/panel_vuepy/layouts/Modal'},
        {text: 'Row 行布局', link: '/panel_vuepy/layouts/Row'},
        {text: 'Swipe 滑动', link: '/panel_vuepy/layouts/Swipe'},
        {text: 'Tabs 标签页', link: '/panel_vuepy/layouts/Tabs'},
        {text: 'WidgetBox 小部件盒子', link: '/panel_vuepy/layouts/WidgetBox'},
      ]
    },
    {
      text: 'Global 组件',
      items: [
        {text: 'Notifications 通知', link: '/panel_vuepy/global/Notifications'},
      ]
    },
    {
      text: 'Indicators 组件',
      items: [
        {text: 'BooleanStatus 布尔状态', link: '/panel_vuepy/indicators/BooleanStatus'},
        {text: 'Dial 表盘', link: '/panel_vuepy/indicators/Dial'},
        {text: 'Gauge 仪表', link: '/panel_vuepy/indicators/Gauge'},
        {text: 'LinearGauge 线性仪表', link: '/panel_vuepy/indicators/LinearGauge'},
        {text: 'LoadingSpinner 加载动画', link: '/panel_vuepy/indicators/LoadingSpinner'},
        {text: 'Number 数字', link: '/panel_vuepy/indicators/Number'},
        {text: 'Progress 进度条', link: '/panel_vuepy/indicators/Progress'},
        {text: 'TooltipIcon 提示图标', link: '/panel_vuepy/indicators/TooltipIcon'},
        {text: 'Tqdm 进度条', link: '/panel_vuepy/indicators/Tqdm'},
        {text: 'Trend 趋势', link: '/panel_vuepy/indicators/Trend'},
      ]
    },
  ],
  '/textual_vuepy/': [
    {
      text: 'Overview 总览',
      items: [
        {text: '🚀 快速上手', link: '/textual_vuepy/quick-start/quick-start'},
        {text: 'Textual-vuepy 组件总览', link: '/textual_vuepy/overview/overview'},
      ]
    },
    {
      text: 'Layout 布局组件',
      items: [
        {text: 'VBox / HBox 布局容器', link: '/textual_vuepy/layout-box/layout-box'},
        {text: 'Collapsible 折叠容器', link: '/textual_vuepy/collapsible/collapsible'},
        {text: 'TabbedContent 标签页容器', link: '/textual_vuepy/tabbed-content/tabbed-content'},
        {text: 'Tabs 标签导航', link: '/textual_vuepy/tabs/tabs'},
        {text: 'ContentSwitcher 内容切换', link: '/textual_vuepy/content-switcher/content-switcher'},
      ]
    },
    {
      text: 'Basic 基础组件',
      items: [
        {text: 'Button 按钮', link: '/textual_vuepy/button/button'},
        {text: 'Label 标签', link: '/textual_vuepy/label/label'},
        {text: 'Static 静态内容', link: '/textual_vuepy/static/static'},
        {text: 'Link 超链接', link: '/textual_vuepy/link/link'},
        {text: 'Placeholder 占位符', link: '/textual_vuepy/placeholder/placeholder'},
        {text: 'Rule 分隔线', link: '/textual_vuepy/rule/rule'},
      ]
    },
    {
      text: 'Form 表单组件',
      items: [
        {text: 'Input 输入框', link: '/textual_vuepy/input/input'},
        {text: 'TextArea 文本编辑器', link: '/textual_vuepy/textarea/textarea'},
        {text: 'MaskedInput 掩码输入', link: '/textual_vuepy/masked-input/masked-input'},
        {text: 'Checkbox 复选框', link: '/textual_vuepy/checkbox/checkbox'},
        {text: 'RadioButton / RadioSet 单选', link: '/textual_vuepy/radio/radio'},
        {text: 'Select 下拉选择', link: '/textual_vuepy/select/select'},
        {text: 'SelectionList 多选列表', link: '/textual_vuepy/selection-list/selection-list'},
        {text: 'Switch 开关', link: '/textual_vuepy/switch/switch'},
      ]
    },
    {
      text: 'Data 数据展示',
      items: [
        {text: 'DataTable 数据表格', link: '/textual_vuepy/data-table/data-table'},
        {text: 'RichLog 富文本日志', link: '/textual_vuepy/rich-log/rich-log'},
        {text: 'Log 纯文本日志', link: '/textual_vuepy/log/log'},
        {text: 'Markdown 渲染', link: '/textual_vuepy/markdown/markdown'},
        {text: 'Pretty 对象格式化', link: '/textual_vuepy/pretty/pretty'},
        {text: 'Sparkline 迷你折线图', link: '/textual_vuepy/sparkline/sparkline'},
        {text: 'Digits 大号数字', link: '/textual_vuepy/digits/digits'},
        {text: 'ProgressBar 进度条', link: '/textual_vuepy/progress-bar/progress-bar'},
      ]
    },
    {
      text: 'Navigation 导航组件',
      items: [
        {text: 'ListView 列表视图', link: '/textual_vuepy/list-view/list-view'},
        {text: 'OptionList 选项列表', link: '/textual_vuepy/option-list/option-list'},
        {text: 'Tree 树形结构', link: '/textual_vuepy/tree/tree'},
        {text: 'DirectoryTree 目录树', link: '/textual_vuepy/directory-tree/directory-tree'},
      ]
    },
    {
      text: 'Feedback 反馈组件',
      items: [
        {text: 'Dialog 对话框', link: '/textual_vuepy/dialog/dialog'},
        {text: 'LoadingIndicator 加载动画', link: '/textual_vuepy/loading-indicator/loading-indicator'},
        {text: 'Tooltip 工具提示', link: '/textual_vuepy/tooltip/tooltip'},
      ]
    },
    {
      text: 'Structure 结构组件',
      items: [
        {text: 'Header / Footer', link: '/textual_vuepy/header-footer/header-footer'},
        {text: 'Display 组件展示器', link: '/textual_vuepy/display/display'},
        {text: 'Welcome 欢迎页', link: '/textual_vuepy/welcome/welcome'},
      ]
    },
    {
      text: '自定义 SFC 组件',
      items: [
        {text: 'ShimmerText 流光文字', link: '/textual_vuepy/shimmer-text/shimmer-text'},
        {text: 'Spinner 加载旋转器', link: '/textual_vuepy/spinner/spinner'},
      ]
    },
    {
      text: 'VueUse 组合式函数',
      items: [
        {text: 'onKeyStroke / useMouse', link: '/textual_vuepy/vueuse/vueuse'},
      ]
    },
  ],
  // '/examples/': [
  //   {
  //     text: '基础',
  //     items: [
  //       {
  //         text: '你好，世界',
  //         link: '/examples/#hello-world'
  //       },
  //       {
  //         text: '处理用户输入',
  //         link: '/examples/#handling-input'
  //       },
  //       {
  //         text: 'Attribute 绑定',
  //         link: '/examples/#attribute-bindings'
  //       },
  //       {
  //         text: '条件与循环',
  //         link: '/examples/#conditionals-and-loops'
  //       },
  //       {
  //         text: '表单绑定',
  //         link: '/examples/#form-bindings'
  //       },
  //       {
  //         text: '简单组件',
  //         link: '/examples/#simple-component'
  //       }
  //     ]
  //   },
  //   {
  //     text: '实战',
  //     items: [
  //       {
  //         text: 'Markdown 编辑器',
  //         link: '/examples/#markdown'
  //       },
  //       {
  //         text: '获取数据',
  //         link: '/examples/#fetching-data'
  //       },
  //       {
  //         text: '带有排序和过滤器的网格',
  //         link: '/examples/#grid'
  //       },
  //       {
  //         text: '树状视图',
  //         link: '/examples/#tree'
  //       },
  //       {
  //         text: 'SVG 图像',
  //         link: '/examples/#svg'
  //       },
  //       {
  //         text: '带过渡动效的模态框',
  //         link: '/examples/#modal'
  //       },
  //       {
  //         text: '带过渡动效的列表',
  //         link: '/examples/#list-transition'
  //       },
  //       {
  //         text: 'TodoMVC',
  //         link: '/examples/#todomvc'
  //       }
  //     ]
  //   },
  //   {
  //     // https://eugenkiss.github.io/7guis/
  //     text: '7 GUIs',
  //     items: [
  //       {
  //         text: '计数器',
  //         link: '/examples/#counter'
  //       },
  //       {
  //         text: '温度转换器',
  //         link: '/examples/#temperature-converter'
  //       },
  //       {
  //         text: '机票预订',
  //         link: '/examples/#flight-booker'
  //       },
  //       {
  //         text: '计时器',
  //         link: '/examples/#timer'
  //       },
  //       {
  //         text: 'CRUD',
  //         link: '/examples/#crud'
  //       },
  //       {
  //         text: '画圆',
  //         link: '/examples/#circle-drawer'
  //       },
  //       {
  //         text: '单元格',
  //         link: '/examples/#cells'
  //       }
  //     ]
  //   }
  // ],
  '/style-guide/': [
    {
      text: 'Style Guide',
      items: [
        {
          text: 'Overview',
          link: '/style-guide/'
        },
        {
          text: 'A - Essential',
          link: '/style-guide/rules-essential'
        },
        {
          text: 'B - Strongly Recommended',
          link: '/style-guide/rules-strongly-recommended'
        },
        {
          text: 'C - Recommended',
          link: '/style-guide/rules-recommended'
        },
        {
          text: 'D - Use with Caution',
          link: '/style-guide/rules-use-with-caution'
        }
      ]
    }
  ]
}

const i18n: ThemeConfig['i18n'] = {
  search: '搜索',
  menu: '菜单',
  toc: '本页目录',
  returnToTop: '返回顶部',
  appearance: '外观',
  previous: '前一篇',
  next: '下一篇',
  pageNotFound: '页面未找到',
  deadLink: {
    before: '你打开了一个不存在的链接：',
    after: '。'
  },
  deadLinkReport: {
    before: '不介意的话请提交到',
    link: '这里',
    after: '，我们会跟进修复。'
  },
  footerLicense: {
    before: '',
    after: ''
  },
  ariaAnnouncer: {
    before: '',
    after: '已经加载完毕'
  },
  ariaDarkMode: '切换深色模式',
  ariaSkipToContent: '直接跳到内容',
  ariaToC: '当前页面的目录',
  ariaMainNav: '主导航',
  ariaMobileNav: '移动版导航',
  ariaSidebarNav: '侧边栏导航',
}

export default defineConfigWithTheme<ThemeConfig>({
  extends: baseConfig,
  // 降低 SSR 渲染并发，减轻 CI 峰值内存（默认 64；8 是速度/内存折中）
  buildConcurrency: 8,
  appearance: 'dark',
  lang: 'zh-CN',
  title: 'Vue.py',
  base: base,
  sitemap: {
    hostname: 'https://vuepy.org/'
  },
  description: 'Vue.py - 渐进式的 Python 框架',
  srcDir: 'src',
  srcExclude: [
    'tutorial/**/description.md',
    'examples/**',
  ],

  head: [
    // ['link', { rel: "icon", type: "image/png", sizes: "16x16", href: "/assets/favicons/favicon-16x16.png"}],
    // ['link', { rel: "apple-touch-icon", sizes: "180x180", href: "/assets/favicons/apple-touch-icon.png"}],
    // ['link', { rel: "manifest", href: "/assets/favicons/site.webmanifest"}],
    // ['link', { rel: "shortcut icon", href: "/images/favicon.ico"}],
    // ['link', { rel: "mask-icon", href: "/favicon.svg", color: "#16b8f3"}],
    // ['link', { rel: "icon", type: "image/svg+xml", href: "/favicon.svg"}],
    // ['link', { rel: "shortcut icon", href: "/favicon.svg"}],
    ['meta', { name: 'theme-color', content: '#16B8F3' }],
    ['meta', { property: 'og:url', content: 'https://vuepy.org/' }],
    ['meta', { property: 'og:type', content: 'website' }],
    ['meta', { property: 'og:title', content: 'Vue.py' }],
    ['meta', { property: 'og:description', content: 'Vue.py - 响应式 Python 框架, 易学易用，性能出色，适用场景丰富的 Jupyter Notebook UI 框架' }],
    ['meta', { property: 'og:image', content: 'https://vuepy.org/images/vuepy-logo.png' }],
    ['meta', { name: 'twitter:site', content: '@vuepy-org' }],
    ['meta', { name: 'twitter:card', content: 'summary' }],
    ['meta', { name: 'google-site-verification', content: 'FKvvfZEgCQTC6aMGsz-DP2O8Hrf29q1frWoClysKcvA' }],

    /* todo  暂不支持 赞助位
    [
      'link',
      {
        rel: 'preconnect',
        href: 'https://sponsors.vuejs.org'
      }
    ],
     */
    [
      'script',
      {},
      fs.readFileSync(
        path.resolve(__dirname, './inlined-scripts/restorePreference.js'),
        'utf-8'
      )
    ],
    [
      'script',
      {
        async: '',
        src: 'https://www.googletagmanager.com/gtag/js?id=G-19C6C7N66C'
      }
    ],
    [
      'script',
      {},
      "window.dataLayer = window.dataLayer || [];\nfunction gtag(){dataLayer.push(arguments);}\ngtag('js', new Date());\ngtag('config', 'G-19C6C7N66C');"
    ],
    /* todo  暂不支持 网站分析
    [
      'script',
      {
        src: 'https://cdn.usefathom.com/script.js',
        'data-site': 'ZPMMDSYA',
        'data-spa': 'auto',
        defer: ''
      }
    ],
    */
    /* <!-- todo 暂不支持 赞助位 头部的广告
    [
      'script',
      {
        src: 'https://vueschool.io/banner.js?affiliate=vuejs&type=top',
        async: 'true'
      }
    ]
     */
  ],

  themeConfig: {
    nav,
    sidebar,
    i18n,

    localeLinks: [
      /*
       <!-- todo 暂不支持
      {
        link: 'https://vuejs.org',
        text: 'English',
        repo: 'https://github.com/vuejs/docs'
      },
      {
        link: 'https://ja.vuejs.org',
        text: '日本語',
        repo: 'https://github.com/vuejs-translations/docs-ja'
      },
      {
        link: 'https://ua.vuejs.org',
        text: 'Українська',
        repo: 'https://github.com/vuejs-translations/docs-uk'
      },
      {
        link: 'https://fr.vuejs.org',
        text: 'Français',
        repo: 'https://github.com/vuejs-translations/docs-fr'
      },
      {
        link: 'https://ko.vuejs.org',
        text: '한국어',
        repo: 'https://github.com/vuejs-translations/docs-ko'
      },
      {
        link: 'https://pt.vuejs.org',
        text: 'Português',
        repo: 'https://github.com/vuejs-translations/docs-pt'
      },
      {
        link: 'https://bn.vuejs.org',
        text: 'বাংলা',
        repo: 'https://github.com/vuejs-translations/docs-bn'
      },
      {
        link: 'https://it.vuejs.org',
        text: 'Italiano',
        repo: 'https://github.com/vuejs-translations/docs-it'
      },
       */
      {
        link: '/translations/',
        text: '帮助我们翻译！',
        isTranslationsDesc: true
      }
    ],

    // search: {
    //   provider: 'local'
    // },

    algolia: {
      indexName: 'vuepy',
      appId: '4IXSDYQCAD',
      apiKey: '29c9c3fa48c106fbed9d8b93b05c608d',
      searchParameters: {
        // facetFilters: ['version:v3']
      },
      placeholder: '搜索文档',
      translations: {
        button: {
          buttonText: '搜索'
        },
        modal: {
          searchBox: {
            resetButtonTitle: '清除查询条件',
            resetButtonAriaLabel: '清除查询条件',
            cancelButtonText: '取消',
            cancelButtonAriaLabel: '取消'
          },
          startScreen: {
            recentSearchesTitle: '搜索历史',
            noRecentSearchesText: '没有搜索历史',
            saveRecentSearchButtonTitle: '保存到搜索历史',
            removeRecentSearchButtonTitle: '从搜索历史中移除',
            favoriteSearchesTitle: '收藏',
            removeFavoriteSearchButtonTitle: '从收藏中移除'
          },
          errorScreen: {
            titleText: '无法获取结果',
            helpText: '你可能需要检查你的网络连接'
          },
          footer: {
            selectText: '选择',
            navigateText: '切换',
            closeText: '关闭',
            searchByText: '搜索供应商'
          },
          noResultsScreen: {
            noResultsText: '无法找到相关结果',
            suggestedQueryText: '你可以尝试查询',
            reportMissingResultsText: '你认为这个查询应该有结果？',
            reportMissingResultsLinkText: '向我们反馈'
          }
        }
      },
    },

    // carbonAds: {
    //   code: 'CEBDT27Y',
    //   placement: 'vuejsorg'
    // },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/vuepy/vuepy' },
      { icon: 'twitter', link: 'https://twitter.com/vuepy-org' },
      { icon: 'discord', link: 'https://discord.com/' }
    ],

    editLink: {
      repo: 'vuepy/docs',
      text: '在 GitHub 上编辑此页'
    },

    footer: {
      license: {
        text: '版权声明',
        link: 'https://github.com/vuejs-translations/docs-zh-cn#%E7%89%88%E6%9D%83%E5%A3%B0%E6%98%8E'
      },
      copyright: '本中文文档采用 知识共享署名-非商业性使用-相同方式共享 4.0 国际许可协议  (CC BY-NC-SA 4.0) 进行许可。'
    }
  },

  markdown: {
    // html: true,
    theme: 'github-dark',
    config(md) {
      // @ts-ignore
      md.use(tableWrapper)
      md.use(tooltip)
      mdPlugin(md)
      textualVuepyDemoPlugin(md)
      md.use(headerPlugin)
      // .use(textAdPlugin)
    }
  },

  transformHtml: (code, id, context) => {
    const $ = cheerio.load(code)
    $('script').each((i, el) => {
      const content = $(el).text();
      $(el).text(he.decode(content));
    })
    return $.html();
  },

  vite: {
    define: {
      __VUE_OPTIONS_API__: false
    },
    optimizeDeps: {
      include: ['gsap', 'dynamics.js'],
      exclude: ['@vue/repl']
    },
    // @ts-ignore
    ssr: {
      external: ['@vue/repl']
    },
    server: {
      host: true,
      fs: {
        // for when developing with locally linked theme
        allow: ['../..']
      }
    },
    build: {
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes('panel_vuepy/widgets/')) {
              let n = id.split('/').pop()
              return `panel_vuepy_widget-${n}`;
            }
            if (id.includes('panel_vuepy/panes/')) {
              let n = id.split('/').pop()
              return `panel_vuepy_pane-${n}`;
            }
            if (id.includes('panel_vuepy/layouts/')) {
              return 'panel_vuepy_layouts';
            }
            if (id.includes('panel_vuepy/chat/')) {
              return 'panel_vuepy_chat';
            }
          }
        }
      },
      minify: 'terser',
      chunkSizeWarningLimit: Infinity,
      // sourcemap: false,
    },
    json: {
      stringify: true
    },
    plugins: [
      generateLLMSTXTPlugin(),
    ]
  }
})
