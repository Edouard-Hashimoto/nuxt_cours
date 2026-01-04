<script setup lang="ts">
import type { SanitySiteSettings } from '~/types/cms/site-settings'

// request for Sanity siteSettings

const query = groq`*[_type == "siteSettings"][0]`

const { data } = await useLazySanityQuery<SanitySiteSettings>(query)

// ... champs seo remplis depuis Sanity
</script>

<template>
  <main class="ly-default">
    <Header v-if="data" v-bind="{ navigation: data.navigation, logo: data.logo }" />
    <!-- <NuxtLink to="/dashboard">Dashboard</NuxtLink> -->
    <!-- <NuxtLink to="/books">Books</NuxtLink> -->
    <!-- <Footer v-bind="{ text: 'My recipe app' }" /> -->
    <slot />
  </main>
</template>