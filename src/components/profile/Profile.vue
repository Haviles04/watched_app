<script setup lang="ts">
import { ref, onBeforeMount, reactive, computed } from "vue";
import { useRoute } from "vue-router";
import { useUserStore } from "@/stores/users";
import { storeToRefs } from "pinia";
import { supabase } from "@/supabase";
import blank from "@/assets/blank.jpg";
import Card from "../post/Card.vue";
import Loading from "../Loading.vue";
import Error from "../Error.vue";

interface PageUser {
  id: number;
  username?: string;
  photo?: string;
  followers?: number;
  following?: number;
}

const userStore = useUserStore();
const { user } = storeToRefs(userStore);

const route = useRoute();
const { userName } = route.params;

const posts = ref<{}[]>();
const currentUser = ref(user.value?.userName === userName);
const following = ref<boolean>();
const pageError = ref(false);
const emptyPosts = ref(false);
const loading = ref<boolean>();
const { VITE_USERPHOTO_URL } = import.meta.env;
const pageUser = reactive<PageUser>({ id: 0 });

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

    pageUser.id = userData.id;
    pageUser.username =
      userData.username[0].toUpperCase() + userData.username.slice(1);

    pageUser.photo = userData.photo;

    await getPost();
    await checkIsFollowing();
    await fetchFollowers();
    await fetchFollowing();
  } catch {
    pageError.value = true;
  } finally {
    loading.value = false;
  }
};

const followUser = async () => {
  try {
    await supabase.from("follower_following").insert({
      follower_id: user.value?.id,
      following_id: pageUser.id,
    });

    following.value = true;
    pageUser.followers!++;
  } catch {
    pageError.value = true;
  }
};

const unFollowUser = async () => {
  try {
    await supabase
      .from("follower_following")
      .delete()
      .eq("follower_id", user.value?.id)
      .eq("following_id", pageUser.id);

    following.value = false;
    pageUser.followers!--;
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
      .eq("following_id", pageUser.id);
    if (data!.length > 0) following.value = true;
  } catch {
    following.value = false;
  }
  loading.value = false;
};

const fetchFollowers = async () => {
  try {
    const { data } = await supabase
      .from("follower_following")
      .select()
      .eq("following_id", pageUser.id);

    pageUser.followers = data!.length;
  } catch {
    pageError.value = true;
  }
};

const fetchFollowing = async () => {
  try {
    const { data } = await supabase
      .from("follower_following")
      .select()
      .eq("follower_id", pageUser.id);

    pageUser.following = data!.length;
  } catch {
    pageError.value = true;
  }
};

onBeforeMount(() => {
  getUserInfo();
});
</script>

<template>
  <div v-if="loading"><Loading /></div>
  <div v-else-if="pageError"><Error /></div>
  <div v-else>
    <div class="userBar">
      <div class="userInfo">
        <div class="userImage">
          <img
            :src="
              pageUser.photo ? `${VITE_USERPHOTO_URL}${pageUser.photo}` : blank
            "
            :alt="pageUser.username"
          />
        </div>
        <div class="userName">
          <h1>{{ pageUser.username }}</h1>
          <div class="follow">
            <p>{{ pageUser.followers }} Followers</p>
            <p>{{ pageUser.following }} Following</p>
          </div>
        </div>
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

.userName {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
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

@media (max-width: 625px) {
  .userBar {
    flex-direction: column;
  }

  .btn {
    margin-top: 20px;
  }
}
</style>
