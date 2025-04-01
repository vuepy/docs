<template>
  <ClientOnly>
    <div class='example'>
      <div class='example-showcase'>
        <slot name='output'></slot>
      </div>

      <hr>

      <div class='op-btns'>
        <a class='op-btn'
           href='https://github.com/vuepy/ipywui-docs/tree/main/component'
           title='在 Github 中编辑'
        >
          <VTIconGitHub class='close' />
        </a>

        <button class='op-btn'
                @click='toggleSourceVisible()'
                title='查看源代码'
        >
          <VTIconCode class='close' />
        </button>
      </div>

      <Transition name='slide-fade-in-linear'>
        <div v-show='sourceVisible' class='source-code'>
          <slot name='src'></slot>
        </div>
      </Transition>

      <div
        v-show='sourceVisible'
        class='example-float-control'
        tabindex='0'
        role='button'
        @click='toggleSourceVisible(false)'
        @keydown='onSourceVisibleKeydown'
      >
        <CaretTop class='close' />
        <span>隐藏源代码</span>
      </div>
    </div><!-- ./example -->
  </ClientOnly>
</template>

<script setup>
import { VTIconGitHub, VTIconCode } from '@vue/theme'
import CaretTop from './icons/CaretTop.vue'
import { useToggle } from '@vueuse/core'

const [sourceVisible, toggleSourceVisible] = useToggle()

const onSourceVisibleKeydown = (e) => {
  if (['Enter', 'Space'].includes(e.code)) {
    e.preventDefault()
    toggleSourceVisible(false)
    // sourceCodeRef.value?.focus()
  }
}
</script>

<style lang='scss' >
.slide-fade-in-linear-enter-active {
  transition: all 0.2s linear;
}
.slide-fade-in-linear-enter-from {
  max-height: 0px;
  padding-top: 0px;
  padding-bottom: 0px;
  overflow: hidden;
}
.slide-fade-in-linear-enter-to {
  max-height: 600px;
  overflow: hidden;
}

.slide-fade-in-linear-leave-active {
  transition: all 0.1s linear;
}
.slide-fade-in-linear-leave-from {
  max-height: 300px;
}
.slide-fade-in-linear-leave-to {
  max-height: 0px;
  overflow: hidden;
}

.example {
  --border-color: #dcdfe6;
  --el-border-radius-base: 4px;
  --text-color: #909399;
  --text-color-lighter: #909399;
  --bg-color: #ffffff;
  --el-color-primary: #409eff;
  --el-text-color-secondary: #909399;
}

.dark {
  .example {
    --border-color: #363636;
  }
} 

.close {
  width: 16px;
  height: 16px;
  fill: gray;
  &:hover {
    fill: #2a2929;
  }
}

.example {
  border: 1px solid var(--border-color);
  border-radius: var(--el-border-radius-base);

  .source-code {
    background-color: #3c4258;

    div[class*='language-'] {
      border-radius: 0 !important;
      margin: 0 !important;
    }
  }

  hr {
    margin: 0;
  }
  .op-btns {
    padding: 0.5rem;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    height: 2.5rem;

    .el-icon {
      &:hover {
        color: var(--text-color);
      }
    }

    .op-btn {
      margin: 0 0.5rem;
      cursor: pointer;
      color: var(--text-color-lighter);
      transition: 0.2s;

      &.github a {
        transition: 0.2s;
        color: var(--text-color-lighter);

        &:hover {
          color: var(--text-color);
        }
      }
    }
  }

  &-float-control {
    display: flex;
    align-items: center;
    justify-content: center;
    border-top: 1px solid var(--border-color);
    height: 44px;
    box-sizing: border-box;
    // background-color: var(--bg-color, #fff);
    background-color: var(--vt-c-bg);
    border-bottom-left-radius: 4px;
    border-bottom-right-radius: 4px;
    margin-top: -1px;
    color: var(--el-text-color-secondary);
    cursor: pointer;
    position: sticky;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 10;
    span {
      font-size: 14px;
      margin-left: 10px;
    }

    &:hover {
      color: var(--el-color-primary);
    }
  }
} //.example

.example-showcase {
  padding: 1.5rem;
  margin: 0.5px;
  background-color: var(--vt-c-bg);
}
</style>
