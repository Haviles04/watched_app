<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import Error from "../Error.vue";
import Loading from "../Loading.vue";
import DetailsCard from "./DetailsCard.vue";

const { VITE_MOVIEDB_API_KEY } = import.meta.env;
const route = useRoute();
const { mediaType, id } = route.params;
const showDetails = ref();
const showMediaType = ref();
const cast = ref();
const error = ref(false);
const similar = ref();

const fetchData = async () => {
  const data = await fetch(
    `https://api.themoviedb.org/3/${mediaType}/${id}?api_key=${VITE_MOVIEDB_API_KEY}`
  )
    .then((r) => r.json())
    .catch();

  showDetails.value = data;
  showMediaType.value = mediaType;
};

const fetchCastData = async () => {
  const data = await fetch(`
https://api.themoviedb.org/3/${mediaType}/${id}/credits?api_key=${VITE_MOVIEDB_API_KEY}&language=en-US`)
    .then((r) => r.json())
    .catch(() => (error.value = true));
  cast.value = data.cast.slice(0, 6);
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
  fetchCastData();
  fetchSimilar();
});
</script>

<template>
  <div v-if="!error">
    <div v-if="showDetails">
      <DetailsCard
        :showDetails="showDetails"
        :mediaType="showMediaType"
        :cast="cast"
        :similar="similar"
      />
    </div>
    <div v-else>
      <Loading />
    </div>
  </div>
  <div v-else>
    <Error />
  </div>
</template>
