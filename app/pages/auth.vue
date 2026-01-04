<script setup lang="ts">
import { jwtDecode } from "jwt-decode";
import { ref, onMounted } from "vue";

// 1. Récupération du token depuis les cookies (nommé comme dans votre code login)
const token = useCookie("recipe_token");

// 2. Définition de l'interface pour correspondre à votre table SQL "Users"
interface UserPayload {
  user_id: number;
  username: string;
  email: string;
  is_admin: number;
  exp?: number;
}

const user = ref<UserPayload | null>(null);

// 3. Décodage sécurisé (onMounted évite les erreurs de rendu côté serveur)
onMounted(() => {
  if (token.value) {
    try {
      const decoded = jwtDecode<UserPayload>(token.value);
      
      // Vérification de l'expiration du token
      const now = Date.now() / 1000;
      if (decoded.exp && decoded.exp < now) {
        token.value = null; // Token expiré
        user.value = null;
      } else {
        user.value = decoded;
      }
    } catch (error) {
      console.error("Erreur lors du décodage du token :", error);
      token.value = null;
      user.value = null;
    }
  }
});

// 4. Fonction de déconnexion
const logout = () => {
  token.value = null;
  user.value = null;
  navigateTo("/login");
};
</script>

<template>
  <div class="auth-page">
    <div v-if="user" class="card profile-view">
      <div class="user-info">
        <div class="avatar-circle">
          {{ user.username.charAt(0).toUpperCase() }}
        </div>
        <h1>Bienvenue, {{ user.username }}</h1>
        <p class="email-text">{{ user.email }}</p>
        
        <span v-if="user.is_admin === 1" class="badge-admin">
          🛡️ Administrateur
        </span>
      </div>

      <div class="stats-grid">
        <div class="stat-item">
          <span>ID Utilisateur</span>
          <strong>#{{ user.user_id }}</strong>
        </div>
      </div>

      <div class="action-buttons">
        <NuxtLink to="/recipe/Ajout" class="btn btn-primary">
          Créer une recette
        </NuxtLink>
        <button @click="logout" class="btn btn-danger">
          Se déconnecter
        </button>
      </div>
    </div>

    <div v-else class="card welcome-view">
      <div class="logo">🍳</div>
      <h2>Ma Cuisine Personnelle</h2>
      <p>Connectez-vous pour gérer vos recettes et vos favoris.</p>
      
      <div class="navigation-links">
        <NuxtLink to="/login" class="btn btn-success">Se connecter</NuxtLink>
        <NuxtLink to="/register" class="btn btn-outline">Créer un compte</NuxtLink>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.auth-page {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 80vh;
  padding: 20px;
  background-color: #f9f9f9;
}

.card {
  background: white;
  padding: 40px;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  width: 100%;
  max-width: 400px;
  text-align: center;
}

.avatar-circle {
  width: 70px;
  height: 70px;
  background-color: #4CAF50;
  color: white;
  font-size: 28px;
  font-weight: bold;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  margin: 0 auto 15px;
}

h1, h2 {
  color: #333;
  margin-bottom: 10px;
}

.email-text {
  color: #666;
  margin-bottom: 15px;
}

.badge-admin {
  background: #fff3cd;
  color: #856404;
  padding: 5px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: bold;
}

.stats-grid {
  margin: 25px 0;
  padding: 15px;
  background: #f1f5f9;
  border-radius: 8px;
  
  .stat-item {
    display: flex;
    justify-content: space-between;
    font-size: 14px;
    span { color: #64748b; }
  }
}

.action-buttons, .navigation-links {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.btn {
  padding: 12px;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  text-decoration: none;
  transition: 0.2s;
  border: none;

  &-primary { background: #4CAF50; color: white; }
  &-success { background: #4CAF50; color: white; }
  &-danger { background: #fee2e2; color: #dc2626; }
  &-outline { border: 2px solid #4CAF50; color: #4CAF50; }
  
  &:hover { opacity: 0.9; transform: translateY(-1px); }
}

.logo {
  font-size: 50px;
  margin-bottom: 10px;
}
</style>