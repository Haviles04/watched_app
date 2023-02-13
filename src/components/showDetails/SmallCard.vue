<script setup lang="ts">
import { useRouter } from "vue-router";
import placeholderimg from "../../assets/placeholderimg.png";
const { details, type, mediaType } = defineProps([
  "details",
  "type",
  "mediaType",
]);

const router = useRouter();

const image = details.profile_path
  ? `https://image.tmdb.org/t/p/w200/${details.profile_path}`
  : details.backdrop_path
  ? `https://image.tmdb.org/t/p/w200/${details.backdrop_path}`
  : placeholderimg;

const text = details.name ? details.name : details.title;

const handleClick = () => {
  router.push(`/${mediaType}/${details.id}`);
};
</script>

<template>
  <div class="card" @click="handleClick">
    <img :src="image" />
    <p>{{ text }}</p>
  </div>
</template>

<style scoped>
.card {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 15px;
  max-width: 150px;
  margin: 10px;
  cursor: pointer;
}

.card img {
  width: 150px;
  max-height: 85px;
  height: auto;
  object-fit: cover;
  border-radius: 10px;
}
</style>
