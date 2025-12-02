<script setup lang="ts">
const email = ref("");
const password = ref("");

const onSubmit = () => {
  // POST SUR L'API
  console.log("Submit form");
  console.log(email.value, password.value);
};
</script>
<template>
  <form @submit.prevent="onSubmit">
    <input v-model="email" type="text" />

    <input v-model="password" type="password" />

    <MyButton>Submit</MyButton>
  </form>
</template>
