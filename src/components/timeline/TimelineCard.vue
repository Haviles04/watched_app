<script setup lang="ts">
import { ref, onMounted, watch } from "vue";
import { supabase } from "@/supabase";
import blank from "@/assets/blank.jpg";
import Loading from "../Loading.vue";

const { post } = defineProps(["post"]);
const postUser = ref();
const userImage = ref();
const loading = ref(true);
const rating = ref<number>();

const fetchUserData = async () => {
  loading.value = true;
  if (!post.owner_id) return;

  const { data: userData } = await supabase
    .from("users")
    .select()
    .eq("id", post.owner_id)
    .single();

  postUser.value = userData;
  userImage.value = postUser.value.photo ? postUser.value.photo : blank;
  loading.value = false;
};

onMounted(() => {
  fetchUserData();
});
</script>

<template>
  <div class="post">
    <div v-if="!loading" class="postInfo">
      <div class="showImage">
        <img :src="post.show_image" />
      </div>
      <div class="postDetails">
        <div class="userBar">
          <div class="userImgContainer">
            <img class="userImage" :src="userImage" />
          </div>
          <h3>{{ postUser.username }}</h3>
          <p>- {{ post.created_at.slice(0, 10) }}</p>
        </div>
        <div class="capRat">
          <span>"{{ post.caption }}"</span>
          <div class="text-center">
            <v-rating v-model="post.rating" readonly></v-rating>
          </div>
        </div>
      </div>
    </div>
    <div v-else>
      <Loading />
    </div>
  </div>
</template>

<style scoped>
.showImage img {
  max-height: 300px;
  border-radius: 5px;
}

.postInfo {
  display: flex;
  height: 100%;
  width: 100%;
  justify-content: space-around;
}

.userImgContainer {
  width: 75px;
  height: 75px;
  border-radius: 50%;
  object-fit: contain;
  overflow: hidden;
}
.userImage {
  width: 75px;
}

.userBar {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  margin-left: 10px;
}

.userBar p {
  margin-left: 5px;
}

h3 {
  margin-left: 10px;
}

.capRat {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.postDetails {
  display: flex;
  flex-direction: column;
}

.postDetails span {
  margin-left: 10px;
  max-width: 300px;
}

.post {
  min-height: 350px;
  max-width: 600px;
  width: 100%;
  border: 2px solid gray;
  border-radius: 15px;
  padding: 20px;
  margin: 25px;
  box-shadow: 10px 10px 10px #778da9;
  background-color: white;
  display: flex;
  flex-direction: row;
}

@media (max-width: 900px) {
  .postInfo {
    flex-direction: column;
    align-items: center;
  }

  .post {
    max-width: 375px;
    margin: 0;
  }
}
</style>
