<script lang="ts" setup>
defineProps<{
  as: "h1" | "h2" | "h3";
}>();
</script>

<template>
  <component :is="as" class="title"><slot /></component>
</template>

<style lang="scss">
.title {
  font-weight: bold;
  font-size: rem(50);
  line-height: rem(50);
  .-small {
    font-size: rem(20);
    line-height: rem(20);
  }
}
</style>
