<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import { useUserStore } from "@/stores/users";
import { storeToRefs } from "pinia";
import { supabase } from "@/supabase";
import blank from "@/assets/blank.jpg";

const userStore = useUserStore();
const { user } = storeToRefs(userStore);

const route = useRoute();
const { userName } = route.params;

const posts = ref();
const userImage = ref();
const currentUser = ref(user.value?.userName === userName);

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
  const { data: userData, error } = await supabase
    .from("users")
    .select()
    .eq("username", userName)
    .single();

  userData.photo
    ? (userImage.value = `https://gjbbtnlizfreuapdlysi.supabase.co/storage/v1/object/public/userphotos/${userData.photo}`)
    : (userImage.value = blank);
};

onMounted(() => {
  getPost();
  getUserInfo();
});

console.log(user);
</script>

<template>
  <div class="userBar">
    <div class="userInfo">
      <div class="userImage">
        <img :src="userImage" />
      </div>
      <h1>{{ userName }}</h1>
    </div>
    <v-btn v-if="!currentUser" class="btn">Follow</v-btn>
  </div>
  <div class="watched" v-for="post in posts">
    <img :src="post.show_image" :alt="post.name" />
    <div class="postDetails">
      <h3>{{ post.name }}</h3>
      <p>{{ post.caption }}</p>
    </div>
  </div>
</template>

<style scoped>
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
