<script setup lang="ts">
import { ref, onBeforeMount } from "vue";
import { supabase } from "@/supabase";
import placeHolder from "@/assets/placeholderImg.png";
import AddWatched from "../addWatched/AddWatched.vue";
import OtherDetails from "./OtherDetails.vue";
import { useUserStore } from "@/stores/users";
import { storeToRefs } from "pinia";
import CastDetails from "./CastDetails.vue";
import Recommended from "./Recommended.vue";

const userStore = useUserStore();
const { user } = storeToRefs(userStore);

const { showDetails, mediaType, cast, similar } = defineProps([
  "showDetails",
  "mediaType",
  "cast",
  "similar",
]);
const detailimage = showDetails.poster_path
  ? `https://image.tmdb.org/t/p/w400/${showDetails.poster_path}`
  : placeHolder;
const title = showDetails.name || showDetails.title;

const watched = ref(true);

const checkIfWatched = async () => {
  const { data, error } = await supabase
    .from("post")
    .select()
    .eq("owner_id", user.value?.id)
    .eq("show_id", showDetails.id);
  if (data && data.length > 0) {
    watched.value = true;
  } else {
    watched.value = false;
  }
};

onBeforeMount(() => checkIfWatched());
</script>

<template>
  <section>
    <div
      class="container"
      :style="{
        backgroundImage: `url(https://image.tmdb.org/t/p/original/${showDetails.backdrop_path})`,
      }"
    >
      <div class="overlay"></div>
      <img class="mainImage" :src="detailimage" alt="title" />
      <div class="title">
        <div>
          <h1>{{ title }}</h1>
          <p class="tagline">{{ showDetails.tagline }}</p>
          <div class="mainView">
            <h3>Overview</h3>
            <p>{{ showDetails.overview }}</p>
            <AddWatched
              v-if="!watched"
              :id="showDetails.id"
              :name="title"
              :image="detailimage"
              :mediaType="mediaType"
              textColor="white"
              @setWatched="watched = true"
            />
          </div>
        </div>
      </div>
    </div>
    <div class="mobileView">
      <h3>Overview</h3>
      <p>{{ showDetails.overview }}</p>
      <AddWatched
        v-if="!watched"
        :id="showDetails.id"
        :name="title"
        :image="detailimage"
        :mediaType="mediaType"
        textColor="white"
        @setWatched="watched = true"
      />
    </div>
    <CastDetails :cast="cast" v-if="cast" />
    <OtherDetails :showDetails="showDetails" />
    <Recommended :similar="similar" v-if="similar" :mediaType="mediaType" />
  </section>
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
  max-width: 700px;
  border-radius: 20px;
  margin-left: 20px;
  padding: 20px;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
}

.tagline {
  color: rgb(182, 173, 173);
  font-style: italic;
}

.title h1,
h3,
p {
  color: white;
}

.mainView {
  height: 100%;
}
.mainView h3 {
  margin-top: 10px;
}

.addBtn {
  margin-top: 20px;
}

.mobileView {
  display: none;
}

.overlay {
  position: absolute;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.582);
}

@media (max-width: 600px) {
  .mainImage {
    width: 50%;
    height: auto;
  }

  .title {
    height: 50%;
  }

  .container {
    align-items: center;
  }

  .mainView {
    display: none;
  }

  .mobileView {
    display: flex;
    flex-direction: column;
    background-color: #1b263b;
    padding: 15px;
    border-radius: 0px 0px 10px 10px;
  }

  .mobileView button {
    background-color: white;
    border-radius: 10px;
    padding: 10px;
    margin: 10px auto;
  }
}
</style>
