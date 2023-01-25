<script setup lang="ts">
import placeHolder from "@/assets/placeholderImg.png";
const { showDetails } = defineProps(["showDetails"]);
const detailimage = showDetails.poster_path
  ? `https://image.tmdb.org/t/p/w400/${showDetails.poster_path}`
  : placeHolder;
const title = showDetails.name || showDetails.title;

console.log(showDetails);
</script>

<template>
  <div
    class="container"
    :style="{
      backgroundImage: `url(https://image.tmdb.org/t/p/original/${showDetails.backdrop_path})`,
    }"
  >
    <div class="overlay"></div>
    <img :src="detailimage" alt="title" />
    <div class="title">
      <h1>{{ title }}</h1>
    </div>
  </div>
</template>

<style scoped>
h1 {
  color: white;
}

.container {
  max-width: 100%;
  height: 500px;
  background-size: cover;
  background-position-y: center;
  display: flex;
  justify-content: space-around;
}
.title {
  border-radius: 20px;
  margin-left: 20px;
  padding: 20px;
  height: fit-content;
}

.title h1 {
  color: white;
}

.overlay {
  position: absolute;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.582);
}
</style>
