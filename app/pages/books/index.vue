<script setup lang="ts">
import type { SanityDocument } from "@sanity/client";
import { createImageUrlBuilder, type SanityImageSource } from "@sanity/image-url";

// Requête mise à jour : Utilisation du champ 'image'
const POSTS_QUERY = groq`*[
  _type == "book"
  && defined(slug.current)
]|order(publishedAt desc)[0...12]{
  _id, 
  title, 
  slug, 
  image, // <--- CHANGEMENT ICI (de 'cover' à 'image')
  author-> {title}
}`;

const { data: book } = await useLazySanityQuery<SanityDocument[]>(POSTS_QUERY);
const { projectId, dataset } = useSanity().client.config();

const urlFor = (source: SanityImageSource) =>
  projectId && dataset
    ? createImageUrlBuilder({ projectId, dataset }).image(source)
    : null;
</script>

<template>
  <main class="container mx-auto min-h-screen max-w-3xl p-8">
    <h1 class="text-4xl font-bold mb-8">Posts</h1>
    <ul class="flex flex-col gap-y-4">
      <li v-for="post in book" :key="post._id" class="hover:underline">
        <nuxt-link :to="`/books/${post.slug.current}`">
          <h2 class="text-xl font-semibold">{{ post.title }}</h2>
          
          <img
            v-if="post.image && urlFor(post.image)"
            :src="
              urlFor(post.image)! // <--- CHANGEMENT ICI (de 'post.cover' à 'post.image')
                .width(550)
                .height(310)
                .url() 
            "
            :alt="post?.title"
            class="aspect-video rounded-xl"
            width="550"
            height="310"
          />
          <p>{{ post.author?.title }}</p>
        </nuxt-link>
      </li>
    </ul>
  </main>
</template>