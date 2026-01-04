<script setup lang="ts">
const email = ref("");
const password = ref("");
const config = useRuntimeConfig();

async function onSubmit() {
  try {
    console.log("=> API call to login");

    const response = await fetch(`${config.public.apiUrl}/api/users/login`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: email.value,
        password: password.value,
      }),
    });
    const json = await response.json();

    const token = json.data.token;

    const cookie = useCookie("recipe_token");
    cookie.value = token;

    await navigateTo("/dashboard");
  } catch (err) {
    console.log(err);
  }
}
</script>

<template>
  <div>
    <h1>Connexion</h1>
    <form action="" @submit.prevent="onSubmit">
      <label for="email">Email</label>
      <input v-model="email" type="text" />
      <label for="password">Mot de passe</label>
      <input v-model="password" type="password" />
      <button type="submit">Se connecter</button>
    </form>
  </div>
</template>

<style scoped lang="scss">
div {
  background-color: white;
  min-height: 100vh; // s'assure que le fond couvre toute la hauteur de la page
  display: flex;
  align-items: center;
  flex-direction: column;
  padding: 2rem;
}

.text {
  color: black;
}

label {
  color: black;
}
</style>
