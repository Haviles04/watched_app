<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import Loading from "../Loading.vue";
import DetailsCard from "./detailsCard.vue";

const { VITE_MOVIEDB_API_KEY } = import.meta.env;
const route = useRoute();
const { mediaType, id } = route.params;
const showDetails = ref();
const showMediaType = ref();

const fetchData = async () => {
  const data = await fetch(
    `https://api.themoviedb.org/3/${mediaType}/${id}?api_key=${VITE_MOVIEDB_API_KEY}`
  ).then((r) => r.json());

  showDetails.value = data;
  showMediaType.value = mediaType;
};

onMounted(() => {
  fetchData();
});
</script>

<template>
  <div v-if="showDetails">
    <DetailsCard :showDetails="showDetails" :mediaType="showMediaType" />
  </div>
  <div v-else>
    <Loading />
  </div>
</template>
