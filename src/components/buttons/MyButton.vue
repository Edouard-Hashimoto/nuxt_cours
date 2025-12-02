<script setup lang="ts">
defineProps<{
  href?: string;
  variant?: "default" | "outline";
  size?: "default" | "small";
}>();
</script>

<template>
  <a
    v-if="href"
    href=""
    class="button"
    :class="{ '-outline': variant === 'outline', '-small': size === 'small' }"
    ><slot />
  </a>
  <button
    v-else
    class="button"
    :class="{ '-outline': variant === 'outline', '-small': size === 'small' }"
  >
    <slot />
  </button>
</template>

<style lang="scss">
.button {
  --button-color: var(--color-text);
  --button-bg-color: var(--color-primary);
  --button-border-color: var(--color-primary);
  padding: rem(10) rem(20);
  background: var(--button-bg-color);
  color: var(--button-color);
  border: rem(1) solid var(--button-border-color);
  border-radius: rem(4);
  text-decoration: none;
  font-size: var(--font-size-base);
  @include medium-up {
    padding: rem(15) rem(25);
  }
  @include small-only {
    padding: rem(5) rem(10);
  }
  &:hover {
    --button-color: var(--color-primary);
    --button-bg-color: transparent;
  }
  &.-small {
    padding: rem(5) rem(10);
  }
  &.-outline {
    --button-color: var(--color-primary);
    --button-bg-color: transparent;
    &:hover {
      --button-color: var(--color-text);
      --button-bg-color: var(--color-primary);
    }
  }
}
</style>
