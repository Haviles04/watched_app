<script setup lang="ts">
const { title, releaseDate, overview, image } = defineProps([
  "title",
  "releaseDate",
  "overview",
  "image",
]);
</script>

<template>
  <v-card class="mx-auto card" max-width="300">
    <v-img class="align-end text-white" height="400" :src="image" cover>
    </v-img>

    <v-card-subtitle class="pt-4">{{ releaseDate }} </v-card-subtitle>

    <v-card-text>
      <h1>{{ title }}</h1>
      <div class="overView">{{ overview }}</div>
    </v-card-text>

    <v-card-actions>
      <v-btn color="white"> Details </v-btn>

      <v-btn color="white"> Watched? </v-btn>
    </v-card-actions>
  </v-card>
</template>

<style scoped>
.card {
  background-color: #415a77;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.card h1 {
  color: white;
  margin-bottom: 10px;
  line-height: 1.7rem;
}

.overView {
  max-height: 100px;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 5;
  line-clamp: 2;
  -webkit-box-orient: vertical;
}
</style>
