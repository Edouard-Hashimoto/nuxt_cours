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
</script>

<template>
  <div v-if="recipe">
    <h1>{{ recipe.title }}</h1>
    <p><strong>Description:</strong> {{ recipe.description }}</p>
    <p><strong>Cuisine:</strong> {{ recipe.cuisine_name }}</p>
    <p><strong>Goal:</strong> {{ recipe.goal_name }}</p>
    <p><strong>Diet:</strong> {{ recipe.diet_name }}</p>
    <p><strong>Allergies:</strong> {{ recipe.allergy_name }}</p>

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

div {
  max-width: 800px;
  margin: 40px auto;
  padding: 20px;
  background-color: #fff;
  border-radius: 12px;
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

p {
  line-height: 1.6;
  margin: 5px 0;
  font-size: 1rem;
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