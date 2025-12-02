<script lang="ts" setup>
const isNavOpen = ref(false)

const onMenuClick = () => {
  isNavOpen.value = !isNavOpen.value
}
</script>
<template>
  <MyButton @click="onMenuClick">{{ isNavOpen ? 'Close' : 'Menu' }}</MyButton>
  <nav v-if="isNavOpen">
    <ul>
      <li>link 1</li>
      <li>link 2</li>
      <li>link 3</li>
    </ul>
  </nav>
</template>

<style lang="scss"></style>
