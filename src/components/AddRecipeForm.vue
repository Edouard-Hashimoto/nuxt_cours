<script setup lang="ts">
import { ref } from "vue";

const config = useRuntimeConfig();

// 1. Structure du payload incluant le tableau d'ingrédients
const payload = ref({
  title: "",
  description: "",
  image_url: "",
  cuisine_id: null,
  goal_id: null,
  DietaryInformation_id: null,
  AllergiesInformation_id: null,
  ingredients: [] as { ingredient_id: number; quantity: number }[] 
});

// 2. Variables pour la sélection temporaire d'un ingrédient
const selectedIngredientId = ref<number | null>(null);
const selectedQuantity = ref<number>(1);

const error = ref('');
const success = ref(false);

// 3. Fonctions de gestion de la liste locale d'ingrédients
function addIngredientToRecipe() {
  if (!selectedIngredientId.value || selectedQuantity.value <= 0) return;

  // Vérifier si l'ingrédient est déjà dans la liste
  const exists = payload.value.ingredients.find(i => i.ingredient_id === selectedIngredientId.value);
  
  if (exists) {
    error.value = "Cet ingrédient est déjà ajouté à la liste.";
    return;
  }

  payload.value.ingredients.push({
    ingredient_id: selectedIngredientId.value,
    quantity: selectedQuantity.value
  });

  // Reset des champs de sélection
  selectedIngredientId.value = null;
  selectedQuantity.value = 1;
  error.value = "";
}

function removeIngredient(index: number) {
  payload.value.ingredients.splice(index, 1);
}

// 4. Soumission du formulaire complet
async function onSubmit() {
  error.value = '';
  success.value = false;

  const p = payload.value;
  if (!p.title || !p.description || p.ingredients.length === 0) {
    error.value = 'Le titre, la description et au moins un ingrédient sont requis.';
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
      // Réinitialisation complète
      payload.value = {
        title: "",
        description: "",
        image_url: "",
        cuisine_id: null,
        goal_id: null,
        DietaryInformation_id: null,
        AllergiesInformation_id: null,
        ingredients: []
      };
    } else {
      const errorData = await response.json();
      error.value = errorData.message || "Erreur lors de l'envoi.";
    }
  } catch (err) {
    error.value = "Impossible de contacter le serveur.";
  }
}

// 5. Récupération des données (Cuisines, Goals, et la liste globale des Ingrédients)
const { data: cuisines } = await useAsyncData("cuisines", () => 
  $fetch(`${config.public.apiUrl}/api/cuisines`).then((res: any) => res.data)
);

const { data: allergies } = await useAsyncData("allergies", () => 
  $fetch(`${config.public.apiUrl}/api/allergies`).then((res: any) => res.data)
);

const { data: dietaries } = await useAsyncData("dietaries", () => 
  $fetch(`${config.public.apiUrl}/api/dietary`).then((res: any) => res.data)
);

const { data: goals } = await useAsyncData("goals", () => 
  $fetch(`${config.public.apiUrl}/api/goals`).then((res: any) => res.data)
);

const { data: allIngredients } = await useAsyncData("ingredients", () => 
  $fetch(`${config.public.apiUrl}/api/ingredients`).then((res: any) => res.data)
);
</script>

<template>
  <div class="container">
    <form class="form" @submit.prevent="onSubmit">
      <h2 class="text-xl font-bold mb-4">Ajouter une nouvelle recette</h2>

      <div v-if="error" class="bg-red-100 text-red-600 p-2 mb-4 rounded">{{ error }}</div>
      <div v-if="success" class="bg-green-100 text-green-600 p-2 mb-4 rounded">Recette créée avec succès !</div>

      <div class="field">
        <label for="title">Titre</label>
        <input id="title" v-model="payload.title" type="text" placeholder="Nom de la recette">
      </div>

      <div class="field">
        <label for="description">Description</label>
        <textarea id="description" v-model="payload.description" placeholder="Instructions..."/>
      </div>

      <div class="ingredients-section card">
        <h3 class="font-bold mb-2">Ingrédients</h3>
        
        <div class="ingredient-selector">
          <select v-model="selectedIngredientId">
            <option :value="null" disabled>Choisir un ingrédient</option>
            <option v-for="ing in allIngredients" :key="ing.ingredient_id" :value="ing.ingredient_id">
              {{ ing.name }} ({{ ing.unit }})
            </option>
          </select>
          
          <input type="number" v-model="selectedQuantity" min="1" class="qty-input">
          
          <button type="button" @click="addIngredientToRecipe" class="add-ing-btn">Ajouter</button>
        </div>

        <ul class="added-list">
          <li v-for="(item, index) in payload.ingredients" :key="index" class="added-item">
            <span>
              {{ allIngredients?.find(ing => ing.ingredient_id === item.ingredient_id)?.name }} : 
              {{ item.quantity }} {{ allIngredients?.find(ing => ing.ingredient_id === item.ingredient_id)?.unit }}
            </span>
            <button type="button" @click="removeIngredient(index)" class="remove-btn">✖</button>
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

      <button type="submit" class="submit-btn">Créer la recette</button>
    </form>
  </div>
</template>

<style scoped>
.form {
  display: flex;
  flex-direction: column;
  max-width: 600px;
  margin: 0 auto;
  gap: 1rem;
}
.field { display: flex; flex-direction: column; }
.card {
  padding: 1rem;
  background: #f9f9f9;
  border-radius: 8px;
  border: 1px solid #eee;
}
.ingredient-selector {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1rem;
}
.qty-input { width: 80px; }
.add-ing-btn { background: #2196F3; color: white; border: none; padding: 0.5rem 1rem; border-radius: 4px; cursor: pointer; }
.added-list { list-style: none; padding: 0; }
.added-item {
  display: flex;
  justify-content: space-between;
  background: white;
  padding: 0.5rem;
  margin-bottom: 0.3rem;
  border-radius: 4px;
  border: 1px solid #ddd;
}
.remove-btn { background: none; border: none; color: red; cursor: pointer; font-weight: bold; }
.submit-btn {
  background-color: #4CAF50;
  color: white;
  padding: 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1.1rem;
  font-weight: bold;
}
.grid-fields { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
input, textarea, select { padding: 0.6rem; border: 1px solid #ccc; border-radius: 4px; }
</style>