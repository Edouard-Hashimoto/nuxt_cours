<script setup lang="ts">
import { ref, computed } from "vue";
import AddRecipe from "../../../src/components/AddRecipeForm.vue";

useHead({
  title: "Mes recettes | Accueil",
  meta: [
    { name: "description", content: "Page d'accueil de mon site de recettes" },
  ],
});

const { data: recipe, error } = await useAsyncData("recipes", async () => {
  const { data } = await $fetch<{ data: Recipe[] }>(
    "http://localhost:4000/api/recipes"
  );
  return data;
});

const { data: cuisine } = await useAsyncData("cuisines", async () => {
  const { data } = await $fetch<{ data: Cuisine[] }>(
    "http://localhost:4000/api/cuisines"
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
  return Math.ceil(filteredRecipes.value.length / RECIPES_PER_PAGE);
});

const displayedRecipes = computed<Recipe[]>(() => {
  if (!filteredRecipes.value.length) return [];

  return filteredRecipes.value.slice(
    (page.value - 1) * RECIPES_PER_PAGE,
    page.value * RECIPES_PER_PAGE
  );
});

function nextPage() {
  if (page.value < totalPages.value) page.value++;
}

function prevPage() {
  if (page.value > 1) page.value--;
}

if (error && error.value) throw new Error("Failed to fetch recipes");
</script>

<template>
  <div class="contenue">
    <h1 class="title -display -gradient">Site Recettes</h1>
    <!-- RECHERCHE -->
    <input
      v-model="search"
      type="text"
      placeholder="Rechercher une recette..."
    />

    <!-- FILTRES CUISINES -->
    <div class="recipes-filters">
      <div
        v-for="(cuisines, index) in cuisine"
        :key="index"
        class="recipes-filters__item"
      >
        <input
          :id="cuisines.name"
          type="checkbox"
          :value="cuisines.name"
          @input="onCheckboxInput"
        />
        <label :for="cuisines.name">{{ cuisines.name }}</label>
      </div>
    </div>

    <div>
      <p>Recettes trouvées : {{ filteredRecipes.length }}</p>
      <p>Page : {{ page }} / {{ totalPages }}</p>
      <p>Filtres : {{ filters }}</p>
    </div>

    <!-- LISTE DES RECETTES -->
    <div>
      <p>Liste des recettes :</p>
      <ul>
        <li
          v-for="(recipes, index) in displayedRecipes"
          :key="index"
          class="recipe-card"
        >
          <NuxtImg
            :src="`/recipes/` + recipes.image_url"
            class="recipe-image"
          />
          <NuxtLink :to="`/recipe/${recipes.recipe_id}`">
            {{ recipes.title }}
          </NuxtLink>
        </li>
      </ul>
    </div>

    <!-- PAGINATION -->
    <div class="pagination">
      <button
        class="button -secondary -medium"
        :disabled="page === 1"
        @click="prevPage"
      >
        ◀ Page précédente
      </button>

      <span>Page {{ page }} / {{ totalPages }}</span>

      <button
        class="button -secondary -medium"
        :disabled="page === totalPages"
        @click="nextPage"
      >
        Page suivante ▶
      </button>
    </div>
    <div>
      <h2>
        <NuxtLink class="button -primary -medium" to="/recipe/Ajout">
          Ajouter une recette
        </NuxtLink>
        </h2>
    </div>
  </div>
</template>

<style lang="scss">
html,
body {
  margin: 0;
  padding: 0;
  font-family: "Inter", Arial, sans-serif;
  background-color: #fafafa;
  color: #333;
}

.contenue {
  margin: 30px auto;
  padding-left: 400px;
  padding-right: 400px;
}

input[type="text"] {
  width: 100%;
  padding: 12px 14px;
  border: 1px solid #ddd;
  border-radius: 8px;
  margin-bottom: 25px;
  font-size: 1rem;
  transition: border-color 0.2s, box-shadow 0.2s;

  &:focus {
    border-color: #00796b;
    box-shadow: 0 0 0 3px rgba(0, 121, 107, 0.2);
    outline: none;
  }
}

.recipes-filters {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  margin-bottom: 25px;
}

.recipes-filters__item {
  display: flex;
  align-items: center;
  gap: 6px;
  background-color: #eef7f6;
  padding: 6px 10px;
  border-radius: 8px;
  border: 1px solid #e0eceb;
  transition: background-color 0.2s, transform 0.1s;

  &:hover {
    background-color: #d8efec;
    transform: translateY(-1px);
  }
}

ul {
  list-style: none;
  padding: 0;
}

li {
  background: white;
  padding: 12px 16px;
  margin-bottom: 12px;
  border-radius: 10px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
  transition: box-shadow 0.2s;

  &:hover {
    box-shadow: 0 3px 8px rgba(0, 0, 0, 0.12);
  }
}

a {
  color: #00796b;
  text-decoration: none;
  font-weight: 500;

  &:hover {
    text-decoration: underline;
  }
}

.pagination {
  margin-top: 25px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.recipe-image {
  width: 100%;
  max-width: 220px; // largeur maximum
  height: 150px; // hauteur fixe pour une grille propre
  object-fit: cover; // recadre proprement l'image
  border-radius: 10px; // angles arrondis
  margin-bottom: 10px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.12);
  transition: transform 0.2s ease, box-shadow 0.2s ease;

  &:hover {
    transform: scale(1.03);
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.18);
  }
}

/* Conteneur des recettes */
.recipe-card {
  display: flex;
  align-items: center;
  gap: 20px;
}
</style>
