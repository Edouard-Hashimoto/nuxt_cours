<script setup lang="ts">
import { computed, ref } from "vue";

const config = useRuntimeConfig();

useHead({
  title: "Cuisine | Accueil",
  meta: [
    {
      name: "description",
      content: "Explorez nos délicieuses recettes de cuisine",
    },
  ],
});

// Utilisation de config.public.apiUrl pour éviter le localhost en dur
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

const selectedCuisine = ref<string>("");

const filteredRecipes = computed<Recipe[]>(() => {
  if (!recipes.value) return [];
  const base = selectedCuisine.value 
    ? recipes.value.filter((r) => r.cuisine_name === selectedCuisine.value)
    : recipes.value;
  return base.slice(0, 6);
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
      <p class="subtitle">
        Découvrez des recettes délicieuses et faciles à préparer
      </p>
    </header>

    <section class="section">
      <div class="section-header">
        <h2>Recettes à la Une</h2>
        <p>Nos meilleures recettes sélectionnées pour vous</p>
      </div>

      <div v-if="recipesError" class="error">
        Erreur lors du chargement des recettes
      </div>

      <div v-else class="recipe-grid">
        <div
          v-for="recipe in featuredRecipes"
          :key="recipe.recipe_id"
          class="recipe-card"
        >
          <NuxtImg
            :src="'/recipes/' + recipe.image_url"
            :alt="recipe.title"
            class="recipe-card__image"
          />
          <div class="recipe-card__body">
            <NuxtLink :to="`/recipe/${recipe.recipe_id}`" class="recipe-card__title">
              {{ recipe.title }}
            </NuxtLink>
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
        <p>Sélectionnez une cuisine pour voir toutes les recettes</p>
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
        <div
          v-for="recipe in filteredRecipes"
          :key="recipe.recipe_id"
          class="recipe-card"
        >
          <NuxtImg
            :src="'/recipes/' + recipe.image_url"
            :alt="recipe.title"
            class="recipe-card__image"
          />
          <div class="recipe-card__body">
            <NuxtLink :to="`/recipe/${recipe.recipe_id}`" class="recipe-card__title">
              {{ recipe.title }}
            </NuxtLink>
            <p class="recipe-card__desc">{{ recipe.description.substring(0, 80) }}...</p>
            <div class="recipe-meta">
              <span v-if="recipe.cuisine_name" class="badge">{{ recipe.cuisine_name }}</span>
              <span v-if="recipe.diet_name" class="badge">{{ recipe.diet_name }}</span>
            </div>
          </div>
        </div>
      </div>
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
  margin: 0 auto;
  padding: 40px 20px;
  width: 100%;
  max-width: 1200px;
}

.hero {
  text-align: center;
  margin-bottom: 50px;
  .title { font-size: clamp(2rem, 5vw, 3.5rem); margin-bottom: 1rem; }
}

.section { margin-bottom: 60px; }

.section-header { margin-bottom: 30px; h2 { margin-bottom: 10px; } }

// GRILLE DE RECETTES RESPONSIVE
.recipe-grid {
  display: grid;
  grid-template-columns: 1fr; // 1 colonne sur mobile
  gap: 25px;

  @media (min-width: 768px) {
    grid-template-columns: repeat(2, 1fr); // 2 colonnes sur tablette
  }

  @media (min-width: 1024px) {
    grid-template-columns: repeat(3, 1fr); // 3 colonnes sur desktop
  }
}

.recipe-card {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
  display: flex;
  flex-direction: column; // Image au dessus du texte
  transition: transform 0.3s ease;

  &:hover { transform: translateY(-5px); }

  &__image {
    width: 100%;
    height: 200px;
    object-fit: cover;
  }

  &__body { padding: 20px; }
  &__title { font-size: 1.2rem; font-weight: 700; color: #00796b; margin-bottom: 10px; display: block; }
  &__desc { font-size: 0.95rem; color: #666; margin-bottom: 15px; }
}

.recipes-filters {
  display: flex;
  gap: 10px;
  flex-wrap: nowrap;
  overflow-x: auto; // Scroll horizontal sur mobile
  padding-bottom: 15px;
  margin-bottom: 30px;
  
  // Cache la scrollbar mais permet le scroll
  scrollbar-width: none; 
  &::-webkit-scrollbar { display: none; }
}

.recipes-filters__item {
  flex: 0 0 auto; // Empêche de rétrécir
  background-color: #eef7f6;
  padding: 8px 16px;
  border-radius: 20px;
  border: 1px solid #e0eceb;
  display: flex;
  align-items: center;
  gap: 8px;
}

.cta-section {
  background-color: #eef7f6;
  padding: 50px 20px;
  border-radius: 20px;
  text-align: center;
  h2 { margin-top: 0; }
}

.btn-secondary {
  display: inline-block;
  background: #00796b;
  color: white;
  padding: 12px 24px;
  border-radius: 8px;
  text-decoration: none;
  font-weight: 600;
  margin-top: 20px;
}

.badge {
  display: inline-block;
  padding: 4px 10px;
  background: #f0fdfa;
  color: #0d9488;
  border-radius: 6px;
  font-size: 0.8rem;
  margin-right: 5px;
}
</style>