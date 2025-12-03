<script setup lang="ts">
const config = useRuntimeConfig();
const route = useRoute();




const { data: recipe, error } = await useAsyncData(
  `recipe-${route.params.id}`,
  async () => {
    const { data } = await $fetch<{ data: FullRecipe }>(
      `${config.public.apiUrl}/api/recipes/${route.params.id}`
    );
    return data;
  }
);

if (!recipe.value || error.value) {
  throw createError({
    statusCode: 404,
    statusMessage: "Recipe not found",
  });
}

useHead({
  title: 'Mes recettes | Recettes',
  meta: [
    {name: 'description', content: recipe.value?.description}
  ]
})
</script>

<template>
  <div v-if="recipe" class="contenue">
    <h1 class="title -primary -mono">{{ recipe.title }}</h1>
    <p class="title -sm -light"><strong>Description:</strong> {{ recipe.description }}</p>
    <p class="title -sm -light"><strong>Cuisine:</strong> {{ recipe.cuisine_name }}</p>
    <p class="title -sm -light"><strong>Goal:</strong> {{ recipe.goal_name }}</p>
    <p class="title -sm -light"><strong>Diet:</strong> {{ recipe.diet_name }}</p>
    <p class="title -sm -light"><strong>Allergies:</strong> {{ recipe.allergy_name }}</p>

    <h2>Ingredients</h2>
    <ul>
      <li v-for="ingredient in recipe.ingredients" :key="ingredient.ingredient_id">
        {{ ingredient.quantity }} {{ ingredient.unit }} de {{ ingredient.name }}
      </li>
    </ul>

    <h2>Instructions</h2>
    <ul>
      <li v-for="instruction in recipe.instructions" :key="instruction.instruction_id">
        {{ instruction.step_number }}. {{ instruction.description }}
      </li>
    </ul>
  </div>
</template>

<style lang="scss">
html, body {
  margin: 0;
  padding: 0;
  font-family: 'Arial', sans-serif;
  background-color: #f9f9f9;
  color: #333;
}

.contenue {
  margin: 30px auto;
  padding-left: 400px;
  padding-right: 400px;
}

h1 {
  font-size: 2.5rem;
  margin-bottom: 15px;
  color: #2c3e50;
  text-align: center;
}

h2 {
  font-size: 1.8rem;
  margin-top: 30px;
  margin-bottom: 15px;
  color: #34495e;
  border-bottom: 2px solid #e0e0e0;
  padding-bottom: 5px;
}



ul {
  list-style: none;
  padding-left: 0;
}

li {
  background-color: #f4f4f4;
  margin-bottom: 8px;
  padding: 10px 15px;
  border-radius: 8px;
  transition: background-color 0.3s ease;
}

li:hover {
  background-color: #e0f7fa;
}

strong {
  color: #00796b;
}
</style>