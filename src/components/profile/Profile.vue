<script setup lang="ts">
import { ref, onMounted, watch } from "vue";
import { useRoute } from "vue-router";
import { useUserStore } from "@/stores/users";
import { storeToRefs } from "pinia";
import { supabase } from "@/supabase";
import blank from "@/assets/blank.jpg";
import Card from "../post/Card.vue";
import Loading from "../Loading.vue";
import Error from "../Error.vue";

const userStore = useUserStore();
const { user } = storeToRefs(userStore);

const route = useRoute();
const { userName } = route.params;

const posts = ref<{}[]>();
const userImage = ref("");
const pageUser = ref<{ id: number }>();
const currentUser = ref(user.value?.userName === userName);
const following = ref<boolean>();
const pageError = ref(false);
const emptyPosts = ref(false);
const loading = ref<boolean>();
const { VITE_USERPHOTO_URL } = import.meta.env;

const getPost = async () => {
  if (pageError.value) return;
  try {
    const { data: userData } = await supabase
      .from("users")
      .select()
      .eq("username", userName)
      .single();

    const { data: postData } = await supabase
      .from("post")
      .select()
      .eq("owner_id", userData.id)
      .order("created_at", { ascending: false });

    posts.value = postData!;
    emptyPosts.value = posts.value!.length < 1;
  } catch {
    pageError.value = true;
  }
};

const getUserInfo = async () => {
  loading.value = true;
  try {
    const { data: userData } = await supabase
      .from("users")
      .select()
      .eq("username", userName)
      .single();
    pageUser.value = userData;

    userData.photo
      ? (userImage.value = `${VITE_USERPHOTO_URL}${userData.photo}`)
      : (userImage.value = blank);

    getPost();
    checkIsFollowing();
  } catch {
    pageError.value = true;
  } finally {
    loading.value = false;
  }
};

const followUser = async () => {
  try {
    const { data } = await supabase.from("follower_following").insert({
      follower_id: user.value?.id,
      following_id: pageUser.value?.id,
    });

    following.value = true;
  } catch {
    pageError.value = true;
  }
};

const unFollowUser = async () => {
  try {
    const { data } = await supabase
      .from("follower_following")
      .delete()
      .eq("follower_id", user.value?.id)
      .eq("following_id", pageUser.value?.id);

    following.value = false;
  } catch {
    pageError.value = true;
  }
};

const checkIsFollowing = async () => {
  if (currentUser.value) return;
  loading.value = true;
  try {
    const { data } = await supabase
      .from("follower_following")
      .select()
      .eq("follower_id", user.value?.id)
      .eq("following_id", pageUser.value?.id);
    if (data!.length > 0) following.value = true;
  } catch {
    following.value = false;
  }
  loading.value = false;
};

onMounted(() => {
  getUserInfo();
});
</script>

<template>
  <div v-if="loading"><Loading /></div>
  <div v-if="pageError"><Error /></div>
  <div v-if="!pageError && !loading">
    <div class="userBar">
      <div class="userInfo">
        <div class="userImage">
          <img :src="userImage" />
        </div>
        <h1>{{ userName }}</h1>
      </div>
      <v-btn v-if="!currentUser && !following" class="btn" @click="followUser"
        >Follow</v-btn
      >
      <v-btn v-if="following" class="btn" @click="unFollowUser">Unfollow</v-btn>
    </div>
    <div class="emptyPosts" v-if="emptyPosts">
      <span>This user hasn't watched anything yet</span>
    </div>
    <div class="cardContainer">
      <Card v-for="post in posts" :post="post" />
    </div>
  </div>
</template>

<style scoped>
.emptyPosts {
  margin-top: 50px;
  width: 100%;
  text-align: center;
}
.cardContainer {
  margin: 0 auto;
  max-width: 1000px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-items: center;
  gap: 0px;
}

.cardContainer span {
  margin: 0 auto;
}

@media (max-width: 1400px) {
  .cardContainer {
    grid-template-columns: 1fr;
  }
}
.userBar {
  margin: 10px auto;
  max-width: 900px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  background-color: #374a63;
  border-radius: 10px;
  padding: 10px;
  color: white;
}

.btn {
  color: black;
}
.userImage {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  object-fit: contain;
  overflow: hidden;
}

.userImage img {
  width: 100px;
  height: 100px;
  object-fit: cover;
}
.userInfo {
  display: flex;
  align-items: center;
}

.userInfo h1 {
  margin-left: 20px;
}
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

.loading {
  margin-top: 50px;
}
</style>
