<script setup lang="ts">
import { ref, onBeforeMount } from "vue";
import ResultsCard from "./ResultsCard.vue";
import placeHolder from "@/assets/placeholderImg.png";

const { VITE_MOVIEDB_API_KEY } = import.meta.env;
const trendingMovies = ref();
const trendingTv = ref();

const fetchMovies = async () => {
  const { results } = await fetch(
    `https://api.themoviedb.org/3/trending/movie/day?api_key=${VITE_MOVIEDB_API_KEY}`
  )
    .then((r) => r.json())
    .catch((err) => console.log(err));
  trendingMovies.value = results.slice(0, 6);
};

const fetchTv = async () => {
  const { results } = await fetch(
    `https://api.themoviedb.org/3/trending/tv/day?api_key=${VITE_MOVIEDB_API_KEY}`
  )
    .then((r) => r.json())
    .catch((err) => console.log(err));
  trendingTv.value = results.slice(0, 6);
  console.log(trendingTv.value);
};

onBeforeMount(() => {
  fetchMovies();
  fetchTv();
});
</script>

<template>
  <h1>Trending Movies</h1>
  <div class="container">
    <ResultsCard
      class="card"
      v-for="movie in trendingMovies"
      :title="movie.title || movie.name"
      :releaseDate="movie.release_date"
      :overview="movie.overview"
      :id="movie.id"
      :mediaType="movie.media_type"
      :image="
        movie.poster_path
          ? `https://image.tmdb.org/t/p/w400/${movie.poster_path}`
          : placeHolder
      "
    />
  </div>
  <h1>Trending Tv</h1>
  <div class="container">
    <ResultsCard
      class="card"
      v-for="show in trendingTv"
      :title="show.title || show.name"
      :releaseDate="show.release_date"
      :overview="show.overview"
      :id="show.id"
      :mediaType="show.media_type"
      :image="
        show.poster_path
          ? `https://image.tmdb.org/t/p/w400/${show.poster_path}`
          : placeHolder
      "
    />
  </div>
</template>

<style scoped>
h1 {
  margin: 25px;
}
.container {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 1rem;
}
</style>
