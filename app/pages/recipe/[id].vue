<script setup lang="ts">
const config = useRuntimeConfig();
const route = useRoute();
const token = useCookie('recipe_token'); // Récupération du token d'auth
const router = useRouter();

async function deleteRecipe() {
  if (!confirm("Voulez-vous vraiment supprimer cette recette ?")) return;

  try {
    await $fetch(`${config.public.apiUrl}/api/recipes/${route.params.id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token.value}`
      }
    });
    
    alert("Recette supprimée avec succès.");
    router.push('/'); // Redirection vers l'accueil après suppression
  } catch (err) {
    alert("Erreur lors de la suppression. Vérifiez que vous êtes bien l'auteur.");
  }
}


// Récupération de la recette complète (incluant les ingrédients via votre API)
const { data: recipe, error } = await useAsyncData(
  `recipe-${route.params.id}`,
  async () => {
    const { data } = await $fetch<{ data: FullRecipe }>(
      `${config.public.apiUrl}/api/recipes/${route.params.id}`
    );
    return data;
  }
);

// Gestion d'erreur si la recette n'existe pas
if (error.value || !recipe.value) {
  throw createError({
    statusCode: 404,
    statusMessage: "Recette introuvable",
  });
}

useHead({
  title: `${recipe.value?.title} | Mes Recettes`,
  meta: [
    { name: 'description', content: recipe.value?.description }
  ]
})
</script>

<template>
  <div v-if="recipe" class="recipe-container">
    <header class="recipe-header">
      <h1 class="recipe-title">{{ recipe.title }}</h1>
      <div class="recipe-meta">
        <span class="badge"><strong>Cuisine:</strong> {{ recipe.cuisine_name }}</span>
        <span class="badge"><strong>Objectif:</strong> {{ recipe.goal_name }}</span>
        <span class="badge"><strong>Régime:</strong> {{ recipe.diet_name }}</span>
      </div>
    </header>

    <section class="recipe-info">
      <p class="description"><strong>Description:</strong> {{ recipe.description }}</p>
      <p v-if="recipe.allergy_name" class="alert-allergy">
        ⚠️ <strong>Allergies:</strong> {{ recipe.allergy_name }}
      </p>
    </section>

    <div class="recipe-grid">
      <section class="ingredients">
        <h2>Ingrédients</h2>
        <ul class="ingredient-list">
          <li v-for="ingredient in recipe.ingredients" :key="ingredient.ingredient_id">
            <span class="qty">{{ ingredient.quantity }} {{ ingredient.unit }}</span>
            <span class="name">{{ ingredient.name }}</span>
          </li>
        </ul>
      </section>

      <section class="instructions">
        <h2>Instructions</h2>
        <ol class="step-list">
          <li v-for="step in recipe.instructions" :key="step.instruction_id">
            <span class="step-number">Étape {{ step.step_number }}</span>
            <p>{{ step.description }}</p>
          </li>
        </ol>
      </section>

      <header class="recipe-header">
  <div class="header-top">
    <h1 class="recipe-title">{{ recipe.title }}</h1>
    <button @click="deleteRecipe" class="btn-delete">
      Supprimer la recette
    </button>
  </div>
  </header>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.recipe-container {
  max-width: 900px;
  margin: 40px auto;
  padding: 20px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0,0,0,0.05);
  color: #000;
}

.recipe-header {
  text-align: center;
  margin-bottom: 30px;
  
  .recipe-title {
    font-size: 2.5rem;
    color: #2c3e50;
    margin-bottom: 10px;
  }
}

.recipe-meta {
  display: flex;
  justify-content: center;
  gap: 15px;
  flex-wrap: wrap;
  
  .badge {
    background: #e0f2f1;
    padding: 5px 15px;
    border-radius: 20px;
    font-size: 0.9rem;
    color: #00796b;
  }
}

.recipe-grid {
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 40px;
  margin-top: 30px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
}

h2 {
  font-size: 1.5rem;
  border-bottom: 2px solid #4CAF50;
  padding-bottom: 8px;
  margin-bottom: 20px;
  color: #34495e;
}

.ingredient-list {
  list-style: none;
  padding: 0;

  li {
    display: flex;
    justify-content: space-between;
    padding: 10px;
    border-bottom: 1px solid #eee;
    background: transparent; // Reset du gris global
    
    .qty {
      font-weight: bold;
      color: #4CAF50;
    }
  }
}

.step-list {
  list-style: none;
  padding: 0;

  li {
    margin-bottom: 20px;
    padding: 15px;
    background: #f8f9fa;
    border-left: 4px solid #4CAF50;
    border-radius: 4px;

    .step-number {
      display: block;
      font-weight: bold;
      text-transform: uppercase;
      font-size: 0.8rem;
      color: #666;
      margin-bottom: 5px;
    }
  }
}



.alert-allergy {
  color: #d32f2f;
  background: #ffcdd2;
  padding: 10px;
  border-radius: 8px;
  margin-top: 10px;
}
</style>