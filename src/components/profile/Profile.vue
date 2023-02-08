<script setup lang="ts">
import { ref, onMounted, watch } from "vue";
import { useRoute } from "vue-router";
import { useUserStore } from "@/stores/users";
import { storeToRefs } from "pinia";
import { supabase } from "@/supabase";
import blank from "@/assets/blank.jpg";
import TimelineCard from "../timeline/TimelineCard.vue";

const userStore = useUserStore();
const { user } = storeToRefs(userStore);

const route = useRoute();
const { userName } = route.params;

const posts = ref();
const userImage = ref();
const pageUser = ref();
const currentUser = ref(user.value?.userName === userName);
const following = ref();

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
  posts.value = postData?.reverse();
};

const getUserInfo = async () => {
  const { data: userData } = await supabase
    .from("users")
    .select()
    .eq("username", userName)
    .single();
  pageUser.value = userData;

  userData.photo
    ? (userImage.value = `https://gjbbtnlizfreuapdlysi.supabase.co/storage/v1/object/public/userphotos/${userData.photo}`)
    : (userImage.value = blank);
};

const followUser = async () => {
  const { data } = await supabase
    .from("follower_following")
    .insert({ follower_id: user.value?.id, following_id: pageUser.value.id });

  following.value = true;
};

const unFollowUser = async () => {
  const { data } = await supabase
    .from("follower_following")
    .delete()
    .eq("follower_id", user.value?.id)
    .eq("following_id", pageUser.value.id);

  following.value = false;
};

const checkIsFollowing = async () => {
  try {
    const { data } = await supabase
      .from("follower_following")
      .select()
      .eq("follower_id", user.value?.id)
      .eq("following_id", pageUser.value.id);
    console.log(data);
    if (data!.length > 0) following.value = true;
  } catch {
    following.value = false;
  }
};

watch(pageUser, () => {
  checkIsFollowing();
});

onMounted(() => {
  getPost();
  getUserInfo();
});
</script>

<template>
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
  <div class="cardContainer">
    <TimelineCard v-for="post in posts" :post="post" />
  </div>
</template>

<style scoped>
.cardContainer {
  margin: 0 auto;
  max-width: 1700px;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  justify-items: center;
  gap: 0px;
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
</style>
