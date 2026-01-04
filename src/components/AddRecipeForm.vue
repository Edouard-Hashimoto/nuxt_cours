<script setup lang="ts">
import { ref } from "vue";
const config = useRuntimeConfig();

// --- LOGIQUE DES ÉTAPES ---
const newStepText = ref("");
function addStep() {
  if (!newStepText.value) return;
  payload.value.instructions.push({
    step_number: payload.value.instructions.length + 1,
    description: newStepText.value
  });
  newStepText.value = "";
}

// --- STRUCTURE DES DONNÉES ---
const payload = ref({
  title: "",
  description: "",
  image_url: "",
  cuisine_id: null,
  goal_id: null,
  DietaryInformation_id: null,
  AllergiesInformation_id: null,
  ingredients: [] as { name: string; quantity: number; unit: string }[],
  instructions: [] as { step_number: number; description: string }[]
});

// --- LOGIQUE DES INGRÉDIENTS ---
const newIngName = ref("");
const newIngUnit = ref("");
const newIngQuantity = ref(1);
const error = ref('');
const success = ref(false);

function addIngredientToRecipe() {
  if (!newIngName.value || !newIngUnit.value || newIngQuantity.value <= 0) {
    error.value = "Veuillez renseigner le nom, la quantité et l'unité.";
    return;
  }
  payload.value.ingredients.push({
    name: newIngName.value,
    unit: newIngUnit.value,
    quantity: newIngQuantity.value
  });
  newIngName.value = "";
  newIngUnit.value = "";
  newIngQuantity.value = 1;
  error.value = "";
}

function removeIngredient(index: number) {
  payload.value.ingredients.splice(index, 1);
}

// --- SOUMISSION ---
async function onSubmit() {
  error.value = '';
  success.value = false;
  if (!payload.value.title || !payload.value.description || payload.value.ingredients.length === 0) {
    error.value = 'Titre, description et ingrédients requis.';
    return;
  }
  try {
    const response = await fetch(`${config.public.apiUrl}/api/recipes`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${useCookie('recipe_token').value}`
      },
      body: JSON.stringify(payload.value)
    });
    if (response.ok) {
      success.value = true;
      payload.value = { title: "", description: "", image_url: "", cuisine_id: null, goal_id: null, DietaryInformation_id: null, AllergiesInformation_id: null, ingredients: [], instructions: [] };
    }
  } catch (err) {
    error.value = "Erreur de connexion à l'API.";
  }
}

// --- RÉCUPÉRATION DATA ---
const { data: cuisines } = await useAsyncData("cuisines", () => $fetch(`${config.public.apiUrl}/api/cuisines`).then((res: any) => res.data));
const { data: goals } = await useAsyncData("goals", () => $fetch(`${config.public.apiUrl}/api/goals`).then((res: any) => res.data));
</script>

<template>
  <div class="container">
    <form class="form" @submit.prevent="onSubmit">
      <h2 class="form__title">Ajouter une recette</h2>

      <div v-if="error" class="alert alert--error">{{ error }}</div>
      <div v-if="success" class="alert alert--success">Recette créée !</div>

      <div class="field">
        <label for="title">Titre</label>
        <input id="title" v-model="payload.title" type="text" placeholder="Ex: Lasagnes">
      </div>

      <div class="field">
        <label for="description">Description</label>
        <textarea id="description" v-model="payload.description" rows="3" placeholder="Présentation..."/>
      </div>

      <div class="card">
        <h3 class="card__title">Ingrédients</h3>
        <div class="ingredient-creator">
          <input v-model="newIngName" type="text" placeholder="Nom" class="input-name">
          <div class="ingredient-creator__sub">
            <input v-model="newIngQuantity" type="number" min="1" class="input-qty">
            <input v-model="newIngUnit" type="text" placeholder="Unité" class="input-unit">
          </div>
          <button type="button" @click="addIngredientToRecipe" class="btn btn--add">Ajouter</button>
        </div>

        <ul class="added-list">
          <li v-for="(item, index) in payload.ingredients" :key="index" class="added-item">
            <span><strong>{{ item.name }}</strong> : {{ item.quantity }} {{ item.unit }}</span>
            <button type="button" @click="removeIngredient(index)" class="btn--remove">✖</button>
          </li>
        </ul>
      </div>

      <div class="grid-fields">
        <div class="field">
          <label for="cuisine">Cuisine</label>
          <select id="cuisine" v-model="payload.cuisine_id">
            <option :value="null" disabled>Choisir</option>
            <option v-for="c in cuisines" :key="c.cuisine_id" :value="c.cuisine_id">{{ c.name }}</option>
          </select>
        </div>
        <div class="field">
          <label for="goal">Objectif</label>
          <select id="goal" v-model="payload.goal_id">
            <option :value="null" disabled>Choisir</option>
            <option v-for="g in goals" :key="g.goal_id" :value="g.goal_id">{{ g.name }}</option>
          </select>
        </div>
      </div>

      <div class="card">
        <h3 class="card__title">Instructions</h3>
        <div class="step-creator">
          <input v-model="newStepText" placeholder="Nouvelle étape..." class="flex-1">
          <button type="button" @click="addStep" class="btn btn--add">Ajouter</button>
        </div>
        <ol class="step-list">
          <li v-for="(step, index) in payload.instructions" :key="index">
            {{ step.description }}
          </li>
        </ol>
      </div>

      <button type="submit" class="btn btn--submit">Publier la recette</button>
    </form>
  </div>
</template>

<style scoped lang="scss">
.container {
  padding: 1rem;
  width: 100%;
}

.form {
  display: flex;
  flex-direction: column;
  max-width: 800px;
  margin: 0 auto;
  gap: 1.5rem;

  &__title { font-size: 1.7rem; color: #1e293b; text-align: center; }
}

.field {
  display: flex;
  flex-direction: column;
  label { font-weight: bold; margin-bottom: 0.5rem; color: #475569; }
  input, textarea, select { padding: 0.8rem; border: 1px solid #cbd5e1; border-radius: 8px; font-size: 1rem; width: 100%; }
}

.card {
  padding: 1.2rem;
  background: #f8fafc;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
  &__title { font-size: 1.1rem; margin-bottom: 1rem; color: #334155; }
}

// --- LOGIQUE RESPONSIVE CRÉATEUR ---
.ingredient-creator, .step-creator {
  display: flex;
  flex-direction: column;
  gap: 0.8rem;

  &__sub { display: flex; gap: 0.5rem; }
}

.grid-fields {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
}

// --- BUTTONS ---
.btn {
  padding: 0.8rem;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  border: none;
  &--add { background: #3b82f6; color: white; }
  &--submit { background: #10b981; color: white; font-size: 1.1rem; margin-top: 1rem; }
}

// --- TABLET & DESKTOP ---
@media (min-width: 640px) {
  .grid-fields { grid-template-columns: 1fr 1fr; }
  
  .ingredient-creator {
    flex-direction: row;
    align-items: center;
    .input-name { flex: 2; }
    &__sub { flex: 1; }
  }

  .step-creator { flex-direction: row; }
}

.added-item {
  display: flex;
  justify-content: space-between;
  background: white;
  padding: 0.7rem;
  margin-top: 0.5rem;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
  .btn--remove { background: none; border: none; color: #ef4444; font-size: 1.2rem; cursor: pointer; }
}

.alert {
  padding: 1rem;
  border-radius: 8px;
  &--error { background: #fef2f2; color: #991b1b; }
  &--success { background: #f0fdf4; color: #166534; }
}
</style>