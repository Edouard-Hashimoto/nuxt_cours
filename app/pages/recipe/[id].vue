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
    <ol>
      <li v-for="instruction in recipe.instructions" :key="instruction.instruction_id">
        {{ instruction.step_number }}. {{ instruction.description }}
      </li>
    </ol>
  </div>
</template>

<style lang="scss">

</style>