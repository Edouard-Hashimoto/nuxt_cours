<script setup lang="ts">
// Pas de logique complexe ici, juste de la navigation
</script>

<template>
  <div class="auth-selection-container">
    <div class="card">
      <div class="logo">
        <span class="icon">🍳</span>
        <h1>Ma Recette</h1>
      </div>
      
      <p class="subtitle">Bienvenue ! Pour continuer, veuillez choisir une option :</p>

      <div class="actions">
        <NuxtLink to="/login" class="btn btn-primary">
          Se connecter
        </NuxtLink>

        <NuxtLink to="/register" class="btn btn-outline">
          Créer un compte
        </NuxtLink>
      </div>

      <p class="footer-text">
        Accès réservé aux membres de la communauté.
      </p>
    </div>
  </div>
</template>

<style scoped lang="scss">
.auth-selection-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #f5f5f5;
  padding: 1rem;
}

.card {
  background: white;
  padding: 2.5rem;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  text-align: center;
  max-width: 400px;
  width: 100%;
}

.logo {
  margin-bottom: 1.5rem;
  .icon { font-size: 3rem; }
  h1 { color: #333; margin: 0; font-size: 1.8rem; }
}

.subtitle {
  color: #666;
  margin-bottom: 2rem;
}

.actions {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.btn {
  padding: 0.8rem;
  border-radius: 8px;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.2s;
  
  &.btn-primary {
    background-color: #4CAF50;
    color: white;
    border: none;
    &:hover { background-color: #45a049; }
  }

  &.btn-outline {
    background-color: transparent;
    color: #4CAF50;
    border: 2px solid #4CAF50;
    &:hover { background-color: #f0fdf4; }
  }
}

.footer-text {
  margin-top: 2rem;
  font-size: 0.8rem;
  color: #999;
}
</style>