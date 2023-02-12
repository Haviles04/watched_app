<script setup lang="ts">
import ResultsCard from "./ResultsCard.vue";
import { ref, computed } from "vue";
import placeHolder from "@/assets/placeholderImg.png";
import Trending from "./Trending.vue";
import Loading from "../Loading.vue";
import Error from "../Error.vue";

const { VITE_MOVIEDB_API_KEY } = import.meta.env;

const searchTerm = ref<string>("");
const searchedItems = ref<any[]>();
const loading = ref(false);
const pageNumber = ref(1);
const error = ref(false);
const totalPages = ref();

let searchTimeout: any;

const handleChange = (): void => {
  clearTimeout(searchTimeout);
  searchTimeout = setTimeout(() => {
    searchedItems.value = undefined;
    fetchData();
  }, 300);
};

const handleClick = (dir: string) => {
  pageNumber.value =
    dir === "next" ? (pageNumber.value += 1) : (pageNumber.value -= 1);
  fetchData();
};

const fetchData = async () => {
  loading.value = true;
  if (searchTerm.value.length < 1) {
    loading.value = false;
    return;
  }

  try {
    const data = await fetch(
      `https://api.themoviedb.org/3/search/multi?api_key=${VITE_MOVIEDB_API_KEY}&language=en-US&query=${searchTerm.value}&page=${pageNumber.value}&include_adult=false`
    ).then((r) => r.json());
    searchedItems.value = data.results;
    totalPages.value = data.total_pages;
    loading.value = false;
  } catch {
    loading.value = false;
    error.value = true;
  }
};
</script>

<template>
  <div v-if="!error">
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

      <div v-if="!loading">
        <div v-if="searchedItems" class="cardContainer">
          <ResultsCard
            class="card"
            :key="`${item.media_type}_${item.id}`"
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
          <div class="paginationContainer">
            <button v-if="pageNumber > 1" @click="handleClick('prev')">
              <v-icon x-large> mdi-arrow-left </v-icon>
            </button>
            <button v-if="pageNumber < totalPages" @click="handleClick('next')">
              <v-icon x-large> mdi-arrow-right </v-icon>
            </button>
          </div>
        </div>

        <div v-else>
          <Trending />
        </div>
      </div>
      <div v-else class="loading">
        <Loading />
      </div>
    </div>
  </div>
  <div v-else>
    <Error />
  </div>
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
  color: #415a77;
}

.paginationContainer {
  width: 100%;
  margin: 30px auto;
}

.paginationContainer button {
  background-color: white;
  border-radius: 50%;
  margin: 20px;
  padding: 20px;
  box-shadow: 5px 5px 5px #778da9;
}

.cardContainer {
  max-width: 1000px;
  flex-wrap: wrap;
  display: flex;
}

.card {
  margin: 20px;
  box-shadow: 5px 5px 5px #778da9;
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

.loading {
  margin-top: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
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
