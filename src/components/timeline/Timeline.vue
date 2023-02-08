<script setup lang="ts">
import { ref, onMounted } from "vue";
import { supabase } from "@/supabase";
import { useUserStore } from "@/stores/users";
import { storeToRefs } from "pinia";
import TimelineCard from "./TimelineCard.vue";
import TimelineSearch from "./TimelineSearch.vue";

const userStore = useUserStore();
const { user } = storeToRefs(userStore);
const posts = ref<{}[]>();
const loading = ref(false);

const fetchData = async () => {
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
};

onMounted(() => {
  fetchData();
});
</script>

<template>
  <TimelineSearch />
  <div class="cardContainer">
    <TimelineCard v-for="post in posts" :post="post" />
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

@media (max-width: 1400px) {
  .cardContainer {
    grid-template-columns: 1fr;
  }
}
</style>
