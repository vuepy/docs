<template>
  <a class="VPNavBarTitle" href="/">
    <slot name="navbar-title">
      <img class='logo' src='/images/vuepy-logo.svg' alt='vuepy-logo' width='50'>
      <span class="text" style='color: var(--vt-c-brand)'>Vue.py</span>
    </slot>
  </a>
</template>

<style scoped>
.VPNavBarTitle {
  display: flex;
  align-items: center;
  padding-top: 1px;
  height: var(--vt-nav-height);
  transition: opacity 0.25s;
}

.VPNavBarTitle:hover {
  opacity: 0.6;
}

.logo {
  position: relative;
}

.logo + .text {
  padding-left: 8px;
}

.text {
  font-size: 16px;
  font-weight: 500;
}
</style>
