<script setup lang="ts">
import { onMounted, ref } from "vue";
import AddWatched from "../addWatched/AddWatched.vue";
import { useRouter } from "vue-router";
import { useUserStore } from "@/stores/users";
import { storeToRefs } from "pinia";
import { supabase } from "@/supabase";

const userStore = useUserStore();
const { user } = storeToRefs(userStore);

const router = useRouter();
const { title, releaseDate, overview, image, mediaType, id } = defineProps([
  "title",
  "releaseDate",
  "overview",
  "image",
  "mediaType",
  "id",
]);

const watched = ref();

const checkIfWatched = async () => {
  const { data, error } = await supabase
    .from("post")
    .select()
    .eq("owner_id", user.value?.id)
    .eq("show_id", id);

  if (data && data.length > 0) {
    watched.value = true;
  }
};

onMounted(() => checkIfWatched());
</script>

<template>
  <v-card class="mx-auto card" max-width="300">
    <v-img class="align-end text-white" height="400" :src="image" cover>
    </v-img>

    <v-card-subtitle class="pt-4">{{ releaseDate }} </v-card-subtitle>

    <v-card-text>
      <h1>{{ title }}</h1>
      <div class="overView">{{ overview }}</div>
    </v-card-text>

    <v-card-actions>
      <v-btn
        class="detailBtn"
        @click="router.push(`/${mediaType}/${id}`)"
        color="black"
      >
        Details
      </v-btn>

      <AddWatched
        :id="id"
        :name="title"
        :mediaType="mediaType"
        :image="image"
        textColor="black"
        v-if="!watched"
      />
      <p v-else class="alreadyWatched">Watched!</p>
    </v-card-actions>
  </v-card>
</template>

<style scoped>
.card {
  width: 300px;
  background-color: white;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.card h1 {
  color: #415a77;
  margin-bottom: 10px;
  line-height: 1.7rem;
}

.overView {
  max-height: 100px;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 5;
  line-clamp: 2;
  -webkit-box-orient: vertical;
}

.detailBtn {
  margin-top: 25px;
}

.alreadyWatched {
  margin-top: 25px;
  margin-left: 10px;
}
</style>
