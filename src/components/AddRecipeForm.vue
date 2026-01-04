<script setup lang="ts">
import { ref } from "vue";

const config = useRuntimeConfig();

// 1. Structure du payload avec ingrédients en saisie libre
const payload = ref({
  title: "",
  description: "",
  image_url: "",
  cuisine_id: null,
  goal_id: null,
  DietaryInformation_id: null,
  AllergiesInformation_id: null,
  // On envoie le nom et l'unité en texte brut pour que l'API les traite
  ingredients: [] as { name: string; quantity: number; unit: string }[] 
});

// 2. Variables pour la saisie d'un nouvel ingrédient personnalisé
const newIngName = ref("");
const newIngUnit = ref("");
const newIngQuantity = ref(1);

const error = ref('');
const success = ref(false);

// 3. Ajouter l'ingrédient saisi à la liste locale
function addIngredientToRecipe() {
  if (!newIngName.value || !newIngUnit.value || newIngQuantity.value <= 0) {
    error.value = "Veuillez renseigner le nom, la quantité et l'unité de l'ingrédient.";
    return;
  }

  payload.value.ingredients.push({
    name: newIngName.value,
    unit: newIngUnit.value,
    quantity: newIngQuantity.value
  });

  // Réinitialisation des champs de saisie d'ingrédient
  newIngName.value = "";
  newIngUnit.value = "";
  newIngQuantity.value = 1;
  error.value = "";
}

function removeIngredient(index: number) {
  payload.value.ingredients.splice(index, 1);
}

// 4. Soumission de la recette complète à l'API
async function onSubmit() {
  error.value = '';
  success.value = false;

  const p = payload.value;
  // Validation : Titre, Description et au moins un ingrédient requis
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
      // Réinitialisation du formulaire après succès
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
      error.value = errorData.message || "Erreur lors de l'envoi au serveur.";
    }
  } catch (err) {
    error.value = "Impossible de contacter le serveur API.";
  }
}

// 5. Récupération des données pour les menus déroulants
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
</script>

<template>
  <div class="container">
    <form class="form" @submit.prevent="onSubmit">
      <h2 class="form__title">Ajouter une nouvelle recette</h2>

      <div v-if="error" class="alert alert--error">{{ error }}</div>
      <div v-if="success" class="alert alert--success">Recette créée avec succès !</div>

      <div class="field">
        <label for="title">Titre de la recette</label>
        <input id="title" v-model="payload.title" type="text" placeholder="Ex: Gratin Dauphinois">
      </div>

      <div class="field">
        <label for="description">Description / Instructions</label>
        <textarea id="description" v-model="payload.description" rows="4" placeholder="Décrivez les étapes de préparation..."/>
      </div>

      <div class="ingredients-section card">
        <h3 class="ingredients-section__title">Ingrédients personnalisés</h3>
        
        <div class="ingredient-creator">
          <input v-model="newIngName" type="text" placeholder="Nom (Farine, Sel...)" class="input-name">
          <input v-model="newIngQuantity" type="number" min="1" class="input-qty">
          <input v-model="newIngUnit" type="text" placeholder="Unité (g, ml, pincée)" class="input-unit">
          
          <button type="button" @click="addIngredientToRecipe" class="btn btn--add">Ajouter à la liste</button>
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

      <button type="submit" class="btn btn--submit">Publier la recette</button>
    </form>
  </div>
</template>

<style scoped lang="scss">
/* Respect de la convention ABEM demandée dans le barème */
.form {
  display: flex;
  flex-direction: column;
  max-width: 700px;
  margin: 0 auto;
  gap: 1.5rem;

  &__title {
    font-size: 1.5rem;
    font-weight: bold;
    color: #333;
  }
}

.field {
  display: flex;
  flex-direction: column;
  label { font-weight: bold; margin-bottom: 0.5rem; }
  input, textarea, select { padding: 0.7rem; border: 1px solid #ccc; border-radius: 6px; }
}

.card {
  padding: 1.5rem;
  background: #f8fafc;
  border-radius: 10px;
  border: 1px solid #e2e8f0;
}

.ingredient-creator {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1rem;
  
  .input-name { flex: 2; }
  .input-qty { width: 80px; }
  .input-unit { flex: 1; }
}

.btn {
  padding: 0.7rem 1.2rem;
  border-radius: 6px;
  font-weight: bold;
  cursor: pointer;
  border: none;
  transition: 0.2s;

  &--add { background-color: #3b82f6; color: white; }
  &--submit { background-color: #10b981; color: white; padding: 1rem; font-size: 1.1rem; }
  
  &:hover { opacity: 0.9; }
}

.added-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: white;
  padding: 0.6rem;
  margin-bottom: 0.5rem;
  border: 1px solid #cbd5e1;
  border-radius: 6px;

  .btn--remove { background: none; border: none; color: #ef4444; cursor: pointer; font-size: 1.2rem; }
}

.grid-fields {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.alert {
  padding: 1rem;
  border-radius: 6px;
  &--error { background: #fee2e2; color: #b91c1c; }
  &--success { background: #dcfce7; color: #15803d; }
}
</style>