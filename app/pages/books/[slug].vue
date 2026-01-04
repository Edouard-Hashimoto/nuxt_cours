<script setup lang="ts">
import groq from "groq";
import type { SanityDocument } from "@sanity/client";
import { createImageUrlBuilder, type SanityImageSource } from "@sanity/image-url";

const BOOK_QUERY = groq`*[_type == "book" && slug.current == $slug][0]`;
const { params } = useRoute();

const { data: book } = await useLazySanityQuery<SanityDocument>(BOOK_QUERY, params);
const { projectId, dataset } = useSanity().client.config();
const urlFor = (source: SanityImageSource) =>
  projectId && dataset
    ? createImageUrlBuilder({ projectId, dataset }).image(source)
    : null;
</script>

<template>
  <main
    v-if="book"
    class="container mx-auto min-h-screen max-w-3xl p-8 flex flex-col gap-4"
  >
    <a href="/" class="hover:underline">&larr; Back to posts</a>
    <img
      v-if="book.image"
      :src="
        urlFor(book.image)
          ?.width(550)
          .height(310)
          .url()
      "
      :alt="book?.title"
      class="aspect-video rounded-xl"
      width="550"
      height="310"
    />
    <h1 v-if="book.title" class="text-4xl font-bold mb-8">{{ book.title }}</h1>
    <div class="prose">
      <p v-if="book.publishedAt">
        Published: {{ new Date(book.publishedAt).toLocaleDateString() }}
      </p>
      <SanityContent v-if="book.body" :blocks="book.body" />
    </div>
  </main>
</template>
