<script setup lang="ts">
import { computed, ref } from "vue";

useHead({
  title: "Cuisine | Accueil",
  meta: [
    {
      name: "description",
      content: "Explorez nos délicieuses recettes de cuisine",
    },
  ],
});

const { data: recipes, error: recipesError } = await useAsyncData(
  "recipes-homepage",
  async () => {
    const { data } = await $fetch<{ data: Recipe[] }>(
      "http://localhost:4000/api/recipes"
    );
    return data;
  }
);

const { data: cuisines } = await useAsyncData("cuisines-homepage", async () => {
  const { data } = await $fetch<{ data: Cuisine[] }>(
    "http://localhost:4000/api/cuisines"
  );
  return data;
});

const selectedCuisine = ref<string>("");

const filteredRecipes = computed<Recipe[]>(() => {
  if (!recipes.value) return [];
  if (!selectedCuisine.value) return recipes.value.slice(0, 6);
  return recipes.value
    .filter((r) => r.cuisine_name === selectedCuisine.value)
    .slice(0, 6);
});

const featuredRecipes = computed<Recipe[]>(() => {
  if (!recipes.value) return [];
  return recipes.value.slice(0, 3);
});
</script>

<template>
  <div class="contenue">
    <h1 class="title -display -gradient">Bienvenue dans notre Cuisine</h1>
    <p class="subtitle">
      Découvrez des recettes délicieuses et faciles à préparer
    </p>

    <!-- Recettes à la Une -->
    <div>
      <h2>Recettes à la Une</h2>
      <p>Nos meilleures recettes sélectionnées pour vous</p>

      <div v-if="recipesError" class="error">
        Erreur lors du chargement des recettes
      </div>

      <ul v-else>
        <li
          v-for="recipe in featuredRecipes"
          :key="recipe.recipe_id"
          class="recipe-card"
        >
          <NuxtImg
            :src="'/recipes/' + recipe.image_url"
            :alt="recipe.title"
            class="recipe-image"
          />
          <div>
            <NuxtLink :to="`/recipe/${recipe.recipe_id}`">
              {{ recipe.title }}
            </NuxtLink>
            <p>{{ recipe.description.substring(0, 80) }}...</p>
            <div class="recipe-meta">
              <span v-if="recipe.cuisine_name" class="badge">
                {{ recipe.cuisine_name }}
              </span>
              <span v-if="recipe.diet_name" class="badge">
                {{ recipe.diet_name }}
              </span>
            </div>
          </div>
        </li>
      </ul>
    </div>

    <!-- Explorez par Cuisine -->
    <div>
      <h2>Explorez par Cuisine</h2>
      <p>Sélectionnez une cuisine pour voir toutes les recettes</p>

      <div class="recipes-filters">
        <div class="recipes-filters__item">
          <input
            id="all"
            type="radio"
            name="cuisine"
            :checked="selectedCuisine === ''"
            @change="selectedCuisine = ''"
          />
          <label for="all">Toutes</label>
        </div>
        <div
          v-for="cuisine in cuisines"
          :key="cuisine.name"
          class="recipes-filters__item"
        >
          <input
            :id="cuisine.name"
            type="radio"
            name="cuisine"
            :value="cuisine.name"
            :checked="selectedCuisine === cuisine.name"
            @change="selectedCuisine = cuisine.name"
          />
          <label :for="cuisine.name">{{ cuisine.name }}</label>
        </div>
      </div>

      <ul>
        <li
          v-for="recipe in filteredRecipes"
          :key="recipe.recipe_id"
          class="recipe-card"
        >
          <NuxtImg
            :src="'/recipes/' + recipe.image_url"
            :alt="recipe.title"
            class="recipe-image"
          />
          <div>
            <NuxtLink :to="`/recipe/${recipe.recipe_id}`">
              {{ recipe.title }}
            </NuxtLink>
            <p>{{ recipe.description.substring(0, 80) }}...</p>
            <div class="recipe-meta">
              <span v-if="recipe.cuisine_name" class="badge">
                {{ recipe.cuisine_name }}
              </span>
              <span v-if="recipe.diet_name" class="badge">
                {{ recipe.diet_name }}
              </span>
            </div>
          </div>
        </li>
      </ul>
    </div>

    <!-- CTA -->
    <div class="cta-section">
      <h2>Prêt à cuisiner ?</h2>
      <p>
        Parcourez notre collection complète de recettes et trouvez votre
        prochaine création culinaire
      </p>
      <NuxtLink to="/recipe" class="button -secondary -medium">
        Voir toutes les recettes
      </NuxtLink>
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

.subtitle {
  font-size: 1.1rem;
  color: #666;
  margin-bottom: 40px;
}

h2 {
  font-size: 2rem;
  margin-top: 50px;
  margin-bottom: 10px;
  color: #333;
}

p {
  color: #666;
  margin-bottom: 20px;
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

.recipe-image {
  width: 100%;
  max-width: 220px;
  height: 150px;
  object-fit: cover;
  border-radius: 10px;
  margin-bottom: 10px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.12);
  transition: transform 0.2s ease, box-shadow 0.2s ease;

  &:hover {
    transform: scale(1.03);
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.18);
  }
}

.recipe-card {
  display: flex;
  align-items: center;
  gap: 20px;
}

.recipe-meta {
  display: flex;
  gap: 8px;
  margin-top: 10px;
}

.badge {
  display: inline-block;
  padding: 4px 10px;
  border-radius: 6px;
  font-size: 0.85rem;
  background-color: #eef7f6;
  color: #00796b;
  border: 1px solid #e0eceb;
}

.cta-section {
  margin-top: 60px;
  padding: 40px;
  background-color: #eef7f6;
  border-radius: 12px;
  text-align: center;

  h2 {
    margin-top: 0;
  }

  p {
    margin-bottom: 30px;
  }
}

.error {
  background-color: #ffebee;
  color: #c62828;
  padding: 20px;
  border-radius: 8px;
  text-align: center;
  margin: 30px 0;
}
</style>
