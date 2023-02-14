<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import { supabase } from "@/supabase";
import { useUserStore } from "@/stores/users";
import { storeToRefs } from "pinia";
import Card from "../post/Card.vue";
import TimelineSearch from "./TimelineSearch.vue";
import Loading from "../Loading.vue";
import Error from "../Error.vue";
import Observer from "./Observer.vue";

interface Post {
  caption?: string;
  id: number;
  media_type: string;
  name: string;
  ownerid: number;
  rating?: number;
  show_id: number;
  show_image?: string;
}

const userStore = useUserStore();
const { user } = storeToRefs(userStore);
const posts = ref<Post[]>([]);
const loading = ref(false);
const error = ref(false);
const startI = ref(0);
const endI = ref(5);
const allLoaded = ref(false);

const fetchData = async () => {
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
      .range(startI.value, endI.value)
      .order("created_at", { ascending: false });

    posts.value = [...posts.value!].concat(postsData!);

    if (!postsData!.length) {
      allLoaded.value = true;
    }
  } catch {
    error.value = true;
  } finally {
    loading.value = false;
  }
};

const emptyPost = computed(() => {
  if (!posts.value) return false;
});

const fetchIntersectedData = () => {
  if (allLoaded.value) return;
  startI.value += 6;
  endI.value += 6;
  fetchData();
};

onMounted(() => {
  loading.value = true;
  fetchData();
});
</script>

<template>
  <div v-if="loading"><Loading /></div>
  <div v-else-if="error"><Error /></div>
  <div v-else class="container">
    <TimelineSearch />
    <div class="emptyPost" v-if="emptyPost">
      <h1>Add Friends to see what they have watched!</h1>
    </div>
    <div class="cardContainer">
      <Card v-for="post in posts" :post="post" :key="post.id" />
      <Observer @intersect="fetchIntersectedData" v-if="posts.length!" />
    </div>
  </div>
</template>

<style scoped>
.cardContainer {
  margin: 0 auto;
  max-width: 1000px;
  display: flex;
  flex-direction: column;
  align-items: center;
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
