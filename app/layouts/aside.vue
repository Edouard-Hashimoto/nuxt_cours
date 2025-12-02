<template>
    <div class="ly-aside">
        <aside class="ly-aside__main">Sidebar</aside>
        <main class="ly-aside__main">Contenue
            <slot />
        </main>
    </div>
</template>
<style lang="scss" scoped>
.ly-aside {
    display : flex;
    flex-flow: row wrap;

    &__sidebar {
        flex: 1;
    }

    &__main {
        flex: 4;
    }
}
</style>