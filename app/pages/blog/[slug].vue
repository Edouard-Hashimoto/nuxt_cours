<script lang="ts" setup>
const route = useRoute();
console.log(route);
</script>

<template>
    <div>
        <h1>l'article {{ route.params.slug }}</h1>
    </div>
</template>