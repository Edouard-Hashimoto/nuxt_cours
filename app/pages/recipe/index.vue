<script setup lang="ts">
import { ref, computed } from "vue";

const config = useRuntimeConfig(); // Récupère l'URL de l'API depuis .env

useHead({
  title: "Mes recettes | Toutes les recettes",
  meta: [
    { name: "description", content: "Découvrez l'intégralité de nos recettes" },
  ],
});

// Récupération des recettes via l'URL configurée
const { data: recipe, error } = await useAsyncData("recipes", async () => {
  const { data } = await $fetch<{ data: Recipe[] }>(
    `${config.public.apiUrl}/api/recipes`
  );
  return data;
});

const { data: cuisine } = await useAsyncData("cuisines", async () => {
  const { data } = await $fetch<{ data: Cuisine[] }>(
    `${config.public.apiUrl}/api/cuisines`
  );
  return data;
});

const page = ref(1);
const RECIPES_PER_PAGE = 3;
const search = ref("");
const filters = ref<string[]>([]);

function onCheckboxInput($event: Event) {
  const target = $event.target;
  if (!(target instanceof HTMLInputElement)) return;
  const value = target.value;
  const index = filters.value.indexOf(value);
  if (index === -1) filters.value.push(value);
  else filters.value.splice(index, 1);
  page.value = 1; // Reset à la page 1 lors d'un filtrage
}

const filteredRecipes = computed<Recipe[]>(() => {
  if (!recipe.value) return [];
  let result = recipe.value;
  if (search.value.trim() !== "") {
    const s = search.value.toLowerCase();
    result = result.filter((r) => r.title.toLowerCase().includes(s));
  }
  if (filters.value.length) {
    result = result.filter((r) => filters.value.includes(r.cuisine_name));
  }
  return result;
});

const totalPages = computed(() => {
  return Math.ceil(filteredRecipes.value.length / RECIPES_PER_PAGE) || 1;
});

const displayedRecipes = computed<Recipe[]>(() => {
  if (!filteredRecipes.value.length) return [];
  return filteredRecipes.value.slice(
    (page.value - 1) * RECIPES_PER_PAGE,
    page.value * RECIPES_PER_PAGE
  );
});

function nextPage() { if (page.value < totalPages.value) page.value++; }
function prevPage() { if (page.value > 1) page.value--; }

if (error && error.value) throw new Error("Failed to fetch recipes");
</script>

<template>
  <div class="contenue">
    <h1 class="title -display -gradient">Toutes les recettes</h1>
    
    <div class="search-container">
      <input
        v-model="search"
        type="text"
        placeholder="Rechercher une recette..."
        @input="page = 1"
      />
    </div>

    <div class="recipes-filters">
      <div
        v-for="(c, index) in cuisine"
        :key="index"
        class="recipes-filters__item"
      >
        <input
          :id="c.name"
          type="checkbox"
          :value="c.name"
          :checked="filters.includes(c.name)"
          @change="onCheckboxInput"
        />
        <label :for="c.name">{{ c.name }}</label>
      </div>
    </div>

    <div class="info-bar">
      <p>Résultats : <strong>{{ filteredRecipes.length }}</strong></p>
      <p>Page : <strong>{{ page }} / {{ totalPages }}</strong></p>
    </div>

    <ul class="recipe-list">
      <li
        v-for="(r, index) in displayedRecipes"
        :key="index"
        class="recipe-card"
      >
        <NuxtImg
          :src="`/recipes/` + r.image_url"
          class="recipe-card__image"
          alt="Image de la recette"
        />
        <div class="recipe-card__content">
          <NuxtLink :to="`/recipe/${r.recipe_id}`" class="recipe-card__link">
            {{ r.title }}
          </NuxtLink>
          <span class="badge">{{ r.cuisine_name }}</span>
        </div>
      </li>
    </ul>

    <div class="pagination">
      <button
        class="btn-nav"
        :disabled="page === 1"
        @click="prevPage"
      >
        ◀ Précédent
      </button>
      <span class="page-indicator">{{ page }} / {{ totalPages }}</span>
      <button
        class="btn-nav"
        :disabled="page === totalPages"
        @click="nextPage"
      >
        Suivant ▶
      </button>
    </div>

    <div class="action-footer">
      <NuxtLink class="btn-primary" to="/recipe/Ajout">
        + Ajouter une recette
      </NuxtLink>
    </div>
  </div>
</template>

<style lang="scss" scoped>
  html,
body {
  margin: 0;
  padding: 0;
  font-family: "Inter", Arial, sans-serif;
  background-color: #fafafa;
  color: #333;
}

.contenue {
  margin: 0 auto;
  padding: 20px;
  width: 100%;
  max-width: 1000px;
}

.search-container { margin-bottom: 20px; }

input[type="text"] {
  width: 100%;
  padding: 14px;
  border: 1px solid #ddd;
  border-radius: 10px;
  font-size: 1rem;
}

.recipes-filters {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  margin-bottom: 20px;
  
  &__item {
    display: flex;
    align-items: center;
    gap: 8px;
    background: #fff;
    padding: 8px 12px;
    border-radius: 20px;
    border: 1px solid #e0eceb;
    font-size: 0.9rem;
  }
}

.info-bar {
  display: flex;
  justify-content: space-between;
  font-size: 0.9rem;
  color: #666;
  margin-bottom: 20px;
}

.recipe-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.recipe-card {
  display: flex;
  flex-direction: column; // Mobile first
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0,0,0,0.06);

  @media (min-width: 640px) {
    flex-direction: row; // Desktop
    align-items: center;
  }

  &__image {
    width: 100%;
    height: 180px;
    object-fit: cover;
    @media (min-width: 640px) {
      width: 200px;
      height: 130px;
    }
  }

  &__content {
    padding: 15px;
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  &__link {
    font-size: 1.2rem;
    font-weight: 700;
    color: #00796b;
    text-decoration: none;
    &:hover { text-decoration: underline; }
  }
}

.badge {
  display: inline-block;
  align-self: flex-start;
  background: #e0f2f1;
  color: #00796b;
  padding: 4px 10px;
  border-radius: 6px;
  font-size: 0.8rem;
}

.pagination {
  margin: 30px 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.btn-nav {
  padding: 10px 15px;
  border-radius: 8px;
  border: 1px solid #ddd;
  background: white;
  cursor: pointer;
  &:disabled { opacity: 0.5; cursor: not-allowed; }
}

.action-footer {
  text-align: center;
  margin-top: 40px;
}

.btn-primary {
  display: inline-block;
  background: #00796b;
  color: white;
  padding: 15px 30px;
  border-radius: 10px;
  text-decoration: none;
  font-weight: bold;
}
</style>