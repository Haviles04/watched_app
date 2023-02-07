<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import { supabase } from "@/supabase";
import { post } from "@supabase/storage-js/dist/module/lib/fetch";

const route = useRoute();
const { userName } = route.params;

const posts = ref();

const getPost = async () => {
  const { data: userData, error } = await supabase
    .from("users")
    .select()
    .eq("username", userName)
    .single();

  const { data: postData } = await supabase
    .from("post")
    .select()
    .eq("owner_id", userData.id);
  console.log(postData);
  posts.value = postData?.reverse();
};

onMounted(() => getPost());
</script>

<template>
  <h1>{{ userName }}</h1>
  <div class="watched" v-for="post in posts">
    <img :src="post.show_image" :alt="post.name" />
    <div class="postDetails">
      <h3>{{ post.name }}</h3>
      <p>{{ post.caption }}</p>
    </div>
  </div>
</template>

<style scoped>
.watched {
  margin: 20px auto;
  display: flex;
  max-width: 900px;
  max-height: 300px;
  display: flex;
  padding: 10px;
  border: 2px solid gray;
  border-radius: 10px;
  box-shadow: 2px 2px 2px gray;
}

.watched img {
  height: 200px;
  object-fit: contain;
}

.postDetails {
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-left: 25px;
}
</style>
