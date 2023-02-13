<script setup lang="ts">
import { ref, onMounted, watch } from "vue";
import { useRouter } from "vue-router";
import { supabase } from "@/supabase";
import blank from "@/assets/blank.jpg";
import Loading from "../Loading.vue";
import CommentLike from "./CommentLike.vue";
import CommentSection from "./CommentSection.vue";
import Error from "../Error.vue";
const { VITE_USERPHOTO_URL } = import.meta.env;

const router = useRouter();

interface postUser {
  id?: number;
  email?: string;
  username?: string;
  photo?: string;
}

const { post } = defineProps(["post"]);
const postUser = ref<postUser>();
const userImage = ref<string>();
const loading = ref<boolean>(true);
const error = ref(false);
const postComments = ref();

const fetchUserData = async () => {
  loading.value = true;
  if (!post.owner_id) return;
  try {
    const { data: userData } = await supabase
      .from("users")
      .select()
      .eq("id", post.owner_id)
      .single();
    postUser.value! = userData;
    userImage.value = postUser.value?.photo
      ? `${VITE_USERPHOTO_URL}${postUser.value.photo}`
      : blank;
  } catch {
    error.value = true;
  } finally {
    fetchComments();
    loading.value = false;
  }
};

const fetchComments = async () => {
  loading.value = true;
  try {
    const response = await supabase
      .from("posts_comments")
      .select()
      .eq("post_id", post.id);
    postComments.value = response.data;
  } catch {
    error.value = true;
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchUserData();
});
</script>

<template>
  <div class="container" v-if="!error">
    <div v-if="!loading">
      <div class="postInfo">
        <div class="showImage">
          <img
            :src="post.show_image"
            @click="router.push(`/${post.media_type}/${post.show_id}`)"
          />
        </div>
        <div class="postDetails">
          <div
            class="userBar"
            @click="router.push(`/users/${postUser?.username}`)"
          >
            <div class="userImgContainer">
              <img class="userImage" :src="userImage" />
            </div>
            <h3>{{ postUser!.username }}</h3>
            <p>- {{ post.created_at.slice(0, 10) }}</p>
          </div>
          <v-rating v-model="post.rating" readonly></v-rating>
          <div class="capRat">
            <span>"{{ post.caption }}"</span>
            <div class="text-center"></div>
          </div>
          <CommentLike :post="post" @refreshComments="fetchComments" />
        </div>
      </div>
      <CommentSection
        :postComments="postComments"
        v-if="postComments.length > 0"
      />
    </div>
    <div v-else class="loading">
      <Loading />
    </div>
  </div>
  <div v-else>
    <Error />
  </div>
</template>

<style scoped>
.showImage img {
  max-height: 300px;
  border-radius: 5px;
  cursor: pointer;
}

.loading {
  width: 100%;
}

.postInfo {
  display: flex;
  height: 100%;
  width: 100%;
}

.userImgContainer {
  width: 75px;
  height: 75px;
  border-radius: 50%;
  overflow: hidden;
}
.userImage {
  width: 75px;
  height: 75px;
  object-fit: cover;
}

.userBar {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  margin-left: 10px;
  cursor: pointer;
}

.userBar p {
  margin-left: 5px;
}

h3 {
  margin-left: 10px;
}

.capRat {
  margin-top: 10px;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.postDetails {
  width: 100%;
  display: flex;
  flex-direction: column;
  margin-left: 20px;
}

.postDetails span {
  margin-left: 10px;
  max-width: 300px;
}

.container {
  min-height: 350px;
  max-width: 1000px;
  width: 100%;
  border: 2px solid gray;
  border-radius: 15px;
  padding: 20px;
  margin: 25px;
  box-shadow: 10px 10px 10px #778da9;
  background-color: white;
  display: flex;
  flex-direction: column;
}

@media (max-width: 900px) {
  .postInfo {
    flex-direction: column;
    align-items: center;
  }

  .container {
    max-width: 100vw;
    margin: 0;
  }
}
</style>
