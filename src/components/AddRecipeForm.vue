<script setup lang="ts">
import { ref } from "vue";

const config = useRuntimeConfig();


const payload = ref({
  title: "",
  description: "",
  image_url: "",
  cuisine_id: 0,
  goal_id: 0,
  DietaryInformation_id: 0,
  AllergiesInformation_id: 0,
});

const error = ref('');
const success = ref(false);

async function onSubmit () {
  if (!payload.value.title || !payload.value.description ||
     !payload.value.cuisine_id || !payload.value.goal_id || payload.value.image_url || payload.value.DietaryInformation_id || payload.value.AllergiesInformation_id) {
    error.value = 'Tous les champs ne sont pas remplis'
  }
  try {
    const response = await fetch(`${config.public.apiUrl}/api/recipes`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${useCookie('recipe_token').value}`
      },
      body: JSON.stringify(payload.value)
    })
    const json = await response.json()
    console.log('Recipe created successfully:', json)
  } catch (error) {
    console.error('Failed to create recipe:', error)
  }
}


const { data: cuisine } = await useAsyncData("cuisines", async () => {
  const { data } = await $fetch<{ data: Cuisine[] }>(
    "http://localhost:4000/api/cuisines"
  );
  return data;
});

const { data: allergy } = await useAsyncData("allergies", async () => {
  const { data } = await $fetch<{ data: Allergy[] }>(
    "http://localhost:4000/api/allergies"
  );
  return data;
});

const { data: diet } = await useAsyncData("dietaries", async () => {
  const { data } = await $fetch<{ data: Diet[] }>(
    "http://localhost:4000/api/dietary"
  );
  return data;
});

const { data: goal } = await useAsyncData("goals", async () => {
  const { data } = await $fetch<{ data: Goal[] }>(
    "http://localhost:4000/api/goals"
  );
  return data;
});

</script>

<template>
  <div>
    <form class="form" @submit.prevent="onSubmit">
      <div v-if="error" class="text-red-600 mb-2">{{ error }}</div>
      <div v-if="success" class="text-green-600 mb-2">Recette créée avec succès !</div>

      <!-- Titre -->
      <label for="title">Titre</label>
      <input id="title" v-model="payload.title" type="text" >

      <!-- Description -->
      <label for="description">Description</label>
      <textarea id="description" v-model="payload.description"/>

      <!-- Image URL -->
      <label for="image_url">Image (URL)</label>
      <input id="image_url" v-model="payload.image_url" type="text" >

      <!-- Cuisine ID -->
      <label for="cuisine">Cuisine</label>

      <select id="cuisine" v-model="payload.cuisine_id">
        <option disabled value="">Choisir une cuisine</option>

        <option v-for="c in cuisine" :key="c.cuisine_id" :value="c.cuisine_id">
          {{ c.name }}
        </option>
      </select>

      <!-- Goal ID -->
    <label for="goal">Goal</label>

      <select id="goal" v-model="payload.goal_id">
        <option disabled value="">Choisir un goal</option>

        <option v-for="c in goal" :key="c.goal_id" :value="c.goal_id">
          {{ c.name }}
        </option>
      </select>

      <!-- DietaryInformation ID -->
    <label for="diet">Dietary</label>

      <select id="diet" v-model="payload.DietaryInformation_id">
        <option disabled value="">Choisir une diet</option>

        <option v-for="c in diet" :key="c.diet_id" :value="c.diet_id">
          {{ c.name }}
        </option>
      </select>

      <!-- AllergiesInformation ID -->
        <label for="allergy">Allergies</label>

      <select id="allergy" v-model="payload.AllergiesInformation_id">
        <option disabled value="">Choisir une allergie</option>

        <option v-for="c in allergy" :key="c.allergy_id" :value="c.allergy_id">
          {{ c.name }}
        </option>
      </select>

      <!-- Submit -->
      <button type="submit">Créer la recette</button>
    </form>
  </div>
</template>
