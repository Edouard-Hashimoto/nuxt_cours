<script setup lang="ts">
definePageMeta({
  middleware: ["auth"],
});

const cookie = useCookie("recipe_token");

const logout = () => {
  cookie.value = null;
  navigateTo("/login");
};


</script>

<template>
  <div class="p-dashboard">
    <h1>Dashboard</h1>

    <button @click="logout">Se déconnecter</button>
  </div>
</template>

<style scoped lang="scss">
div {
  background-color: white;
  min-height: 100vh;
  display: flex;
  align-items: center;
  flex-direction: column;
  padding: 2rem;
}

button {
  margin-top: 2rem;
  padding: 0.7rem 1.5rem;
  background: black;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
}
</style>
