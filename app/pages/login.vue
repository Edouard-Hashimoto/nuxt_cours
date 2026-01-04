<script setup lang="ts">
const config = useRuntimeConfig();
const email = ref("");
const password = ref("");

// États pour le retour utilisateur
const error = ref("");
const success = ref(false);
const isLoading = ref(false);

async function onLogin() {
  error.value = "";
  success.value = false;
  isLoading.value = true;

  try {
    const response = await fetch(`${config.public.apiUrl}/api/users/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ 
        email: email.value, 
        password: password.value 
      }),
    });

    const json = await response.json();

    if (!response.ok) {
      // Si l'API renvoie une erreur (ex: 401 Unauthorized)
      throw new Error(json.message || "Email ou mot de passe incorrect");
    }

    // Connexion réussie
    success.value = true;
    
    // Extraction et stockage du token JWT
    const token = json.data.token;
    const cookie = useCookie("recipe_token", {
      maxAge: 60 * 60 * 24, // Expire après 1 jour
      path: '/'
    });
    cookie.value = token;

    // Petite pause pour laisser l'utilisateur voir le message de succès avant redirection
    setTimeout(async () => {
      await navigateTo("/"); // Redirection vers l'accueil
    }, 1500);

  } catch (err: any) {
    error.value = err.message;
  } finally {
    isLoading.value = false;
  }
}
</script>

<template>
  <div class="container">
    <form @submit.prevent="onLogin" class="auth-form">
      <h1>Connexion</h1>
      
      <div v-if="error" class="alert error">
        ❌ {{ error }}
      </div>
      
      <div v-if="success" class="alert success">
        ✅ Connexion réussie ! Redirection en cours...
      </div>
      
      <div class="field">
        <label for="email">Email</label>
        <input 
          id="email"
          v-model="email" 
          type="email" 
          required 
          :disabled="isLoading"
          placeholder="votre@email.com"
        />
      </div>

      <div class="field">
        <label for="password">Mot de passe</label>
        <input 
          id="password"
          v-model="password" 
          type="password" 
          required 
          :disabled="isLoading"
        />
      </div>

      <button type="submit" :disabled="isLoading">
        {{ isLoading ? "Chargement..." : "Se connecter" }}
      </button>

      <div class="footer-links">
        <NuxtLink to="/register">Créer un compte</NuxtLink>
        <NuxtLink to="/" class="back-home">Retour à l'accueil</NuxtLink>
      </div>
    </form>
  </div>
</template>

<style scoped lang="scss">
.container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #f4f7f6;
}

.auth-form {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
  width: 100%;
  max-width: 400px;

  h1 {
    text-align: center;
    color: #333;
    margin-bottom: 1.5rem;
  }
}

.alert {
  padding: 0.8rem;
  border-radius: 4px;
  margin-bottom: 1rem;
  font-size: 0.9rem;
  text-align: center;

  &.error {
    background-color: #fee2e2;
    color: #dc2626;
    border: 1px solid #fecaca;
  }

  &.success {
    background-color: #dcfce7;
    color: #16a34a;
    border: 1px solid #bbf7d0;
  }
}

.field {
  margin-bottom: 1rem;
  display: flex;
  flex-direction: column;

  label {
    margin-bottom: 0.5rem;
    color: #666;
    font-weight: 600;
  }

  input {
    padding: 0.7rem;
    border: 1px solid #ddd;
    border-radius: 4px;
    &:focus {
      outline: none;
      border-color: #4CAF50;
    }
  }
}

button {
  width: 100%;
  padding: 0.8rem;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 4px;
  font-weight: bold;
  cursor: pointer;
  transition: background 0.3s;

  &:hover:not(:disabled) {
    background-color: #45a049;
  }

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
}

.footer-links {
  margin-top: 1.5rem;
  display: flex;
  justify-content: space-between;
  font-size: 0.85rem;
  
  a {
    color: #2196F3;
    text-decoration: none;
    &:hover { text-decoration: underline; }
  }
}
</style>