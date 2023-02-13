<script setup lang="ts">
import { ref, onMounted } from "vue";
import { supabase } from "@/supabase";
import { useUserStore } from "@/stores/users";
import { storeToRefs } from "pinia";
import TimelineCard from "./TimelineCard.vue";
import TimelineSearch from "./TimelineSearch.vue";
import Loading from "../Loading.vue";
import Error from "../Error.vue";

const userStore = useUserStore();
const { user } = storeToRefs(userStore);
const posts = ref<{}[]>();
const loading = ref(false);
const emptyPost = ref(false);
const error = ref(false);

const fetchData = async () => {
  loading.value = true;
  try {
    const { data: following } = await supabase
      .from("follower_following")
      .select()
      .eq("follower_id", user.value?.id);

    const ownerIds = following?.map((f) => f.following_id);

    const { data: postsData } = await supabase
      .from("post")
      .select()
      .in("owner_id", ownerIds!)
      .order("created_at", { ascending: false });

    posts.value = postsData!;
    emptyPost.value = posts.value.length < 1;
  } catch {
    error.value = true;
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchData();
});
</script>

<template>
  <div v-if="!error">
    <TimelineSearch />
    <div class="emptyPost" v-if="emptyPost">
      <span>Add Friends to see what they have watched!</span>
    </div>
    <div v-if="!loading" class="cardContainer">
      <TimelineCard v-for="post in posts" :post="post" />
    </div>
    <div v-else><Loading /></div>
  </div>
  <div v-else>
    <Error />
  </div>
</template>

<style scoped>
.cardContainer {
  margin: 0 auto;
  max-width: 1400px;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  justify-items: center;
  gap: 5px;
}

.emptyPost {
  margin-top: 50px;
  width: 100%;
  text-align: center;
}

@media (max-width: 1400px) {
  .cardContainer {
    grid-template-columns: 1fr;
  }
}
</style>
