<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import Error from "../Error.vue";
import Loading from "../Loading.vue";
import MainCard from "./MainCard.vue";

const { VITE_MOVIEDB_API_KEY } = import.meta.env;
const route = useRoute();
const { mediaType, id } = route.params;
const showDetails = ref();
const showMediaType = ref();
const cast = ref();
const error = ref(false);
const similar = ref();

const fetchData = async () => {
  try {
    const data = await fetch(
      `https://api.themoviedb.org/3/${mediaType}/${id}?api_key=${VITE_MOVIEDB_API_KEY}`
    ).then((r) => r.json());
    showDetails.value = data;
    showMediaType.value = mediaType;
    fetchCastData();
  } catch {
    error.value = true;
  }
};

const fetchCastData = async () => {
  try {
    const data = await fetch(`
https://api.themoviedb.org/3/${mediaType}/${id}/credits?api_key=${VITE_MOVIEDB_API_KEY}&language=en-US`).then(
      (r) => r.json()
    );
    cast.value = data.cast.slice(0, 6);
    fetchSimilar();
  } catch {
    error.value = true;
  }
};

const fetchSimilar = async () => {
  try {
    const data = await fetch(
      `https://api.themoviedb.org/3/${mediaType}/${id}/recommendations?api_key=${VITE_MOVIEDB_API_KEY}&language=en-US&page=1`
    ).then((r) => r.json());
    if (data.results.length > 0) {
      similar.value = data.results.slice(0, 5);
    }
  } catch {
    error.value = true;
  }
};

onMounted(() => {
  fetchData();
});
</script>

<template>
  <div v-if="error"><Error /></div>
  <div v-else-if="!showDetails"><Loading /></div>
  <MainCard
    v-else-if="showDetails"
    :showDetails="showDetails"
    :mediaType="showMediaType"
    :cast="cast"
    :similar="similar"
  />
</template>
