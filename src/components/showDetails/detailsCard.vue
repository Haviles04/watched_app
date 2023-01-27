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
      <div>
      <h1>{{ title }}</h1>
      <p>{{showDetails.tagline}}</p>
    </div>
      <button> Add to watched</button>
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
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
}

.title h1 , p {
  color: white;
}

.title button {
  background-color: white;
  padding: 10px;
  border-radius: 5px;
}

.overlay {
  position: absolute;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.582);
}
</style>
