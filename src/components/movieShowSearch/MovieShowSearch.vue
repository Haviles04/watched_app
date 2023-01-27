<script setup lang="ts">
import ResultsCard from "./ResultsCard.vue";
import { ref } from "vue";
import placeHolder from "@/assets/placeholderImg.png";

const { VITE_MOVIEDB_API_KEY } = import.meta.env;

const searchTerm = ref<string>("");
const searchedItems = ref<any[]>();
let searchTimeout: any;

const handleChange = (): void => {
  clearTimeout(searchTimeout);
  searchTimeout = setTimeout(() => {
    fetchData();
  }, 300);
};

const fetchData = async () => {
  const data = await fetch(
    `https://api.themoviedb.org/3/search/multi?api_key=${VITE_MOVIEDB_API_KEY}&language=en-US&query=${searchTerm.value}&page=1&include_adult=false`
  )
    .then((r) => r.json())
    .catch((err) => console.log(err));
  searchedItems.value = data.results;
};
</script>

<template>
  <main>
    <div class="findContainer">
      <h1>Need Something To Watch?</h1>
      <div class="searchBar">
        <input
          v-model="searchTerm"
          type="text"
          placeholder="Search for a movie or tv show..."
          @input="handleChange"
        />
      </div>
      <div class="cardContainer">
        <ResultsCard
          class="card"
          v-for="item in searchedItems"
          :title="item.title || item.name"
          :releaseDate="item.release_date"
          :overview="item.overview"
          :id="item.id"
          :mediaType="item.media_type"
          :image="
            item.poster_path
              ? `https://image.tmdb.org/t/p/w400/${item.poster_path}`
              : placeHolder
          "
        />
      </div>
    </div>
  </main>
</template>

<style scoped>
.findContainer {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.findContainer h1 {
  margin-top: 20px;
  color: white;
}

.cardContainer {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 1rem;
}

.card {
  margin: 20px;
}

.searchBar {
  margin-top: 25px;
  border-radius: 10px;
  padding: 10px;
  width: 300px;
  background-color: #415a77;
  color: white;
}

.searchBar input {
  color: white;
  width: 100%;
  outline: none;
}

.searchBar input::placeholder {
  color: white;
}

@media (max-width: 1020px) {
  .cardContainer {
    grid-template-columns: 1fr 1fr;
  }
}

@media (max-width: 650px) {
  .cardContainer {
    grid-template-columns: 1fr;
  }
}
</style>