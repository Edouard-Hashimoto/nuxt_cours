<script lang="ts" setup>
const simpsonsArray = reactive([
  {
    prenom: "Maggie",
    nom: "Simpson",
    description: "lorem",
    img: "bart.webp",
    isAdult: false,
  },
  {
    prenom: "Bart",
    nom: "Simpson",
    description: "lorem",
    img: "bart.webp",
    isAdult: false,
  },
  {
    prenom: "Lisa",
    nom: "Simpson",
    description: "lorem",
    img: "bart.webp",
    isAdult: false,
  },
  {
    prenom: "Homer",
    nom: "Simpson",
    description: "lorem",
    img: "bart.webp",
    isAdult: true,
  },
  {
    prenom: "Marge",
    nom: "Simpson",
    description: "lorem",
    img: "bart.webp",
    isAdult: true,
  },
]);

const filteredSimpsons = computed(() =>
  simpsonsArray.filter((simpson) => simpson.prenom.includes("a"))
);
</script>
<template>
  <MyTitle as="h2"
    >Liste de tous les Simpsons qui ont un "a" dans le prénom</MyTitle
  >
  <ul class="simpsons">
    <!-- <MyCharacter
      v-for="(simpson, index) in simpsonsArray"
      :key="`simpson-${index}`"
      :prenom="simpson.prenom"
      :nom="simpson.nom"
      :description="`${simpson.description} ${index}`"
      :img="simpson.img"
    /> -->
    <li
      v-for="(simpson, index) in filteredSimpsons"
      :key="`simpson-${index}`"
      class="simpsons__character"
    >
      <MyCharacter
        :prenom="simpson.prenom"
        :nom="simpson.nom"
        :description="`${simpson.description} ${index}`"
        :img="simpson.img"
      />
    </li>
  </ul>
</template>
<style lang="scss">
.simpsons {
  list-style: none;
  padding: 0;
  @include medium-up {
    //display: flex;
  }
}
</style>
