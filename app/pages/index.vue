<script setup lang="ts">
import { computed, ref } from "vue";

const config = useRuntimeConfig();

useHead({
  title: "Cuisine | Accueil",
  meta: [
    { name: "description", content: "Explorez nos délicieuses recettes de cuisine" },
  ],
});

// 1. Récupération des données via l'URL d'API du .env
const { data: recipes, error: recipesError } = await useAsyncData(
  "recipes-homepage",
  async () => {
    const { data } = await $fetch<{ data: Recipe[] }>(
      `${config.public.apiUrl}/api/recipes`
    );
    return data;
  }
);

const { data: cuisines } = await useAsyncData("cuisines-homepage", async () => {
  const { data } = await $fetch<{ data: Cuisine[] }>(
    `${config.public.apiUrl}/api/cuisines`
  );
  return data;
});

// 2. Variables de filtrage
const selectedCuisine = ref<string>("");
const search = ref("");

// 3. Logique de filtrage combinée (Recherche + Cuisine)
const filteredRecipes = computed<Recipe[]>(() => {
  if (!recipes.value) return [];
  
  let result = recipes.value;

  // Filtre par texte (nom de recette)
  if (search.value.trim() !== "") {
    const s = search.value.toLowerCase();
    result = result.filter((r) => r.title.toLowerCase().includes(s));
  }

  // Filtre par catégorie de cuisine
  if (selectedCuisine.value !== "") {
    result = result.filter((r) => r.cuisine_name === selectedCuisine.value);
  }

  return result.slice(0, 6); // Limite à 6 résultats pour l'accueil
});

const featuredRecipes = computed<Recipe[]>(() => {
  if (!recipes.value) return [];
  return recipes.value.slice(0, 3);
});
</script>

<template>
  <div class="contenue">
    <header class="hero">
      <h1 class="title -display -gradient">Bienvenue dans notre Cuisine</h1>
      <p class="subtitle">Découvrez des recettes délicieuses et faciles à préparer</p>
    </header>

    

    <section class="section">
      <div class="section-header">
        <h2>Recettes à la Une</h2>
        <p>Nos meilleures recettes sélectionnées pour vous</p>
      </div>

      <div v-if="recipesError" class="error">
        Erreur lors du chargement des recettes. Vérifiez votre API URL.
      </div>

      <div v-else class="recipe-grid">
        <div v-for="recipe in featuredRecipes" :key="recipe.recipe_id" class="recipe-card">
          <NuxtImg :src="'/recipes/' + recipe.image_url" :alt="recipe.title" class="recipe-card__image" />
          <div class="recipe-card__body">
            <NuxtLink :to="`/recipe/${recipe.recipe_id}`" class="recipe-card__title">{{ recipe.title }}</NuxtLink>
            <p class="recipe-card__desc">{{ recipe.description.substring(0, 80) }}...</p>
            <div class="recipe-meta">
              <span v-if="recipe.cuisine_name" class="badge">{{ recipe.cuisine_name }}</span>
              <span v-if="recipe.diet_name" class="badge">{{ recipe.diet_name }}</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="section">
      <div class="section-header">
        <h2>Explorez par Cuisine</h2>
        <p>Sélectionnez une cuisine pour affiner les résultats</p>
      </div>
      <div class="search-container">
      <input 
        v-model="search" 
        type="text" 
        placeholder="Rechercher une recette par nom..." 
        class="search-input"
      />
    </div>

      <div class="recipes-filters">
        <div class="recipes-filters__item">
          <input id="all" type="radio" name="cuisine" :checked="selectedCuisine === ''" @change="selectedCuisine = ''" />
          <label for="all">Toutes</label>
        </div>
        <div v-for="cuisine in cuisines" :key="cuisine.name" class="recipes-filters__item">
          <input :id="cuisine.name" type="radio" name="cuisine" :value="cuisine.name" :checked="selectedCuisine === cuisine.name" @change="selectedCuisine = cuisine.name" />
          <label :for="cuisine.name">{{ cuisine.name }}</label>
        </div>
      </div>

      <div class="recipe-grid">
        <div v-for="recipe in filteredRecipes" :key="recipe.recipe_id" class="recipe-card">
          <NuxtImg :src="'/recipes/' + recipe.image_url" :alt="recipe.title" class="recipe-card__image" />
          <div class="recipe-card__body">
            <NuxtLink :to="`/recipe/${recipe.recipe_id}`" class="recipe-card__title">{{ recipe.title }}</NuxtLink>
            <p class="recipe-card__desc">{{ recipe.description.substring(0, 80) }}...</p>
            <div class="recipe-meta">
              <span v-if="recipe.cuisine_name" class="badge">{{ recipe.cuisine_name }}</span>
              <span v-if="recipe.diet_name" class="badge">{{ recipe.diet_name }}</span>
            </div>
          </div>
        </div>
      </div>
      
      <p v-if="filteredRecipes.length === 0" class="no-results">Aucune recette ne correspond à votre recherche.</p>
    </section>

    <div class="cta-section">
      <h2>Prêt à cuisiner ?</h2>
      <p>Parcourez notre collection complète de recettes.</p>
      <NuxtLink to="/recipe" class="btn-secondary">
        Voir toutes les recettes
      </NuxtLink>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.contenue {
  background: #000;
  color: #f5f5f5;
  margin: 0 auto;
  padding: 40px 20px;
  width: 100%;
  max-width: 1200px;
}

.hero {
  text-align: center;
  margin-bottom: 40px;
  .title { font-size: clamp(2rem, 5vw, 3.5rem); margin-bottom: 1rem; }
}

/* BARRE DE RECHERCHE */
.search-container {
  margin-bottom: 40px;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
}

.search-input {
  width: 100%;
  padding: 14px 20px;
  background: #111;
  border: 1px solid #333;
  border-radius: 12px;
  color: #fff;
  font-size: 1rem;
  transition: all 0.3s;
  &:focus { outline: none; border-color: #4fd1c5; box-shadow: 0 0 0 3px rgba(79, 209, 197, 0.1); }
}

.section { margin-bottom: 60px; }
.section-header { margin-bottom: 30px; h2 { margin-bottom: 10px; } }

/* GRILLE RESPONSIVE */
.recipe-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 25px;
  @media (min-width: 768px) { grid-template-columns: repeat(2, 1fr); }
  @media (min-width: 1024px) { grid-template-columns: repeat(3, 1fr); }
}

.recipe-card {
  background: #111;
  border-radius: 12px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  transition: transform 0.3s ease;
  &:hover { transform: translateY(-5px); }

  &__image { width: 100%; height: 200px; object-fit: cover; }
  &__body { padding: 20px; }
  &__title { font-size: 1.2rem; font-weight: 700; color: #4fd1c5; text-decoration: none; margin-bottom: 10px; display: block; }
  &__desc { font-size: 0.95rem; color: #cbd5e1; margin-bottom: 15px; }
}

/* FILTRES AVEC TEXTE BLANC */
.recipes-filters {
  display: flex;
  gap: 10px;
  overflow-x: auto;
  padding-bottom: 15px;
  margin-bottom: 30px;
  scrollbar-width: none;
  &::-webkit-scrollbar { display: none; }
}

.recipes-filters__item {
  flex: 0 0 auto;
  background-color: #151515;
  padding: 8px 16px;
  border-radius: 20px;
  border: 1px solid #333;
  display: flex;
  align-items: center;
  gap: 8px;
  color: #fff; // Texte blanc pour lisibilité
  label { cursor: pointer; color: #fff; }
  input[type="radio"] { cursor: pointer; accent-color: #4fd1c5; }
}

.cta-section {
  background: linear-gradient(135deg, #0f172a, #0b0f1a);
  padding: 50px 20px;
  border-radius: 20px;
  text-align: center;
  h2 { margin-top: 0; }
}

.btn-secondary {
  display: inline-block;
  background: #0f766e;
  color: #fff;
  padding: 12px 24px;
  border-radius: 8px;
  text-decoration: none;
  font-weight: 600;
  margin-top: 20px;
}

.badge {
  display: inline-block;
  padding: 4px 10px;
  background: #1f2937;
  color: #7bdcb5;
  border-radius: 6px;
  font-size: 0.8rem;
  margin-right: 5px;
}

.no-results { text-align: center; color: #666; font-style: italic; }
.error { background: #450a0a; color: #fca5a5; padding: 15px; border-radius: 8px; }
</style>