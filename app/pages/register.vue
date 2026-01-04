<script setup lang="ts">
const config = useRuntimeConfig();
const error = ref("");
const success = ref(false);

const form = ref({
  username: "",
  email: "",
  password: "", // Sera hashé côté API via User.create
  first_name: "",
  last_name: ""
});

async function onRegister() {
  error.value = "";
  try {
    const response = await fetch(`${config.public.apiUrl}/api/users/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form.value),
    });

    const json = await response.json();
    if (!response.ok) throw new Error(json.message || "Erreur lors de l'inscription");

    success.value = true;
    // Redirection vers la connexion après 2 secondes
    setTimeout(() => navigateTo("/login"), 2000);
  } catch (err: any) {
    error.value = err.message;
  }
}
</script>

<template>
  <div class="container">
    <form @submit.prevent="onRegister" class="auth-form">
      <h1>Créer un compte</h1>
      <div v-if="error" class="error-msg">{{ error }}</div>
      <div v-if="success" class="success-msg">Compte créé avec succès ! Redirection...</div>

      <label>Nom d'utilisateur (Pseudo)</label>
      <input v-model="form.username" type="text" required placeholder="Ex: ChefGourmet" />

      <label>Prénom</label>
      <input v-model="form.first_name" type="text" />

      <label>Nom</label>
      <input v-model="form.last_name" type="text" />

      <label>Email</label>
      <input v-model="form.email" type="email" required placeholder="email@exemple.com" />

      <label>Mot de passe</label>
      <input v-model="form.password" type="password" required />

      <button type="submit">S'inscrire</button>
      <NuxtLink to="/" class="back-link">Retour</NuxtLink>
    </form>
  </div>
</template>