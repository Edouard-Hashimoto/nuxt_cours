<script setup lang="ts">
const { data: recipe, error } = await useAsyncData('recipes', async () => {
  const {data} = await $fetch<{ data: Recipe[] }>('http://localhost:4000/api/recipes');
  return data;
});

if (error && error.value) throw new Error("Failed to fetch recipes");
</script>

<template>
  <div>
    <h1>Homepage</h1>
    <div>
      <p>Liste des recettes :</p>
      <ul>
        <li v-for="(recipes, index) in recipe" :key="index">
        <NuxtLink :to="`/recipe/${recipes.recipe_id}`">{{ recipes.title }}</NuxtLink>
        </li>
      </ul>
    </div>
  </div>
</template>
