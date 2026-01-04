<script setup lang="ts">
import { ref } from "vue";

const config = useRuntimeConfig();

// Initialisation avec null ou chaînes vides pour faciliter la validation
const payload = ref({
  title: "",
  description: "",
  image_url: "",
  cuisine_id: null,
  goal_id: null,
  DietaryInformation_id: null,
  AllergiesInformation_id: null,
});

const error = ref('');
const success = ref(false);

async function onSubmit() {
  // Réinitialisation des messages
  error.value = '';
  success.value = false;

  // Validation : on vérifie que chaque champ a une valeur
  const p = payload.value;
  if (!p.title || !p.description || !p.image_url || !p.cuisine_id || !p.goal_id || !p.DietaryInformation_id || !p.AllergiesInformation_id) {
    error.value = 'Tous les champs doivent être remplis';
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
      };
    } else {
      const errorData = await response.json();
      error.value = errorData.message || "Une erreur est survenue lors de l'envoi.";
    }
  } catch (err) {
    console.error('Failed to create recipe:', err);
    error.value = "Impossible de contacter le serveur.";
  }
}

// Récupération des données pour les selects
// Note : Utilisation de config.public.apiUrl pour la cohérence
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

      <div class="field">
        <label for="image_url">Image (URL)</label>
        <input id="image_url" v-model="payload.image_url" type="text" placeholder="https://...">
      </div>

      <div class="field">
        <label for="cuisine">Cuisine</label>
        <select id="cuisine" v-model="payload.cuisine_id">
          <option :value="null" disabled>Choisir une cuisine</option>
          <option v-for="c in cuisines" :key="c.cuisine_id" :value="c.cuisine_id">
            {{ c.name }}
          </option>
        </select>
      </div>

      <div class="field">
        <label for="goal">Objectif (Goal)</label>
        <select id="goal" v-model="payload.goal_id">
          <option :value="null" disabled>Choisir un objectif</option>
          <option v-for="g in goals" :key="g.goal_id" :value="g.goal_id">
            {{ g.name }}
          </option>
        </select>
      </div>

      <div class="field">
        <label for="diet">Régime Alimentaire</label>
        <select id="diet" v-model="payload.DietaryInformation_id">
          <option :value="null" disabled>Choisir une diète</option>
          <option v-for="d in dietaries" :key="d.diet_id" :value="d.diet_id">
            {{ d.name }}
          </option>
        </select>
      </div>

      <div class="field">
        <label for="allergy">Allergies</label>
        <select id="allergy" v-model="payload.AllergiesInformation_id">
          <option :value="null" disabled>Choisir une allergie</option>
          <option v-for="a in allergies" :key="a.allergy_id" :value="a.allergy_id">
            {{ a.name }}
          </option>
        </select>
      </div>

      <button type="submit" class="submit-btn">Créer la recette</button>
    </form>
  </div>
</template>

<style scoped>
.form {
  display: flex;
  flex-direction: column;
  max-width: 500px;
  margin: 0 auto;
}
.field {
  margin-bottom: 1rem;
  display: flex;
  flex-direction: column;
}
label {
  font-weight: bold;
  margin-bottom: 0.3rem;
}
input, textarea, select {
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 4px;
}
.submit-btn {
  background-color: #4CAF50;
  color: white;
  padding: 0.8rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
}
.submit-btn:hover {
  background-color: #45a049;
}
</style>