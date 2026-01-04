<script lang="ts" setup>
import type { SanitySiteSettings } from "~/types/cms/sanitySiteSettings";

defineProps<{
  logo?: SanitySiteSettings["logo"], // Optionnel pour éviter les erreurs de build
  navigation?: SanitySiteSettings["navigation"];
}>();

const isNavOpen = ref(false)

const onMenuClick = () => {
  isNavOpen.value = !isNavOpen.value
}

// Ferme le menu automatiquement lors d'un clic sur un lien (mobile)
const closeNav = () => {
  isNavOpen.value = false
}
</script>

<template>
  <header class="header">
    <NuxtLink to="/" class="logo-link">
      <div class="logo">R505 | Cuisine</div>
    </NuxtLink>

    <MyButton class="menu-btn" @click="onMenuClick">
      {{ isNavOpen ? 'Fermer' : 'Menu' }}
    </MyButton>

    <nav :class="{ open: isNavOpen }">
      <ul class="nav-list">
        <li><NuxtLink to="/recipe" @click="closeNav">Recettes</NuxtLink></li>
        <li><NuxtLink to="/auth" @click="closeNav">Connexion</NuxtLink></li>
      </ul>
    </nav>
  </header>
</template>

<style lang="scss">
.header {
  position: sticky; // Reste en haut au scroll
  top: 0;
  z-index: 100;
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.5rem;
  background: #fef7f2;
  border-bottom: 2px solid #e4c5a1;

  .logo-link {
    text-decoration: none;
    .logo {
      font-size: 1.5rem;
      font-weight: bold;
      color: #2c3e50;
    }
  }

  .nav-list {
    list-style: none;
    margin: 0;
    padding: 0;
    
    a {
      text-decoration: none;
      color: #2c3e50;
      font-weight: 500;
      &:hover { color: #4CAF50; }
    }
  }

  // --- MOBILE STYLE ---
  nav {
    position: absolute;
    top: 100%; // Juste sous le header
    left: 0;
    width: 100%;
    background: white;
    padding: 1.5rem;
    display: none;
    box-shadow: 0 10px 15px rgba(0,0,0,0.1);

    &.open {
      display: block;
    }

    ul {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
      text-align: center;
    }
  }

  // --- DESKTOP STYLE (768px +) ---
  @media (min-width: 768px) {
    .menu-btn {
      display: none;
    }

    nav {
      position: static;
      display: block !important;
      width: auto;
      padding: 0;
      background: none;
      box-shadow: none;

      ul {
        flex-direction: row;
        gap: 2.5rem;
      }
    }
  }
}
</style>