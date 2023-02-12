<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import blank from "@/assets/blank.jpg";
const { user } = defineProps(["user"]);
const { VITE_USERPHOTO_URL } = import.meta.env;
const router = useRouter();
const profileImg = user.photo ? `${VITE_USERPHOTO_URL}/${user.photo}` : blank;
const userName = user.username[0].toUpperCase() + user.username.slice(1);
</script>

<template>
  <div class="userResult">
    <div class="infoContainer">
      <img
        :src="profileImg"
        alt="user.username"
        @click="router.push(`/users/${user.username}`)"
      />
      <div class="userInfo">
        <h3>{{ userName }}</h3>
        <span>{{ user.first_name }}</span>
      </div>
    </div>
    <v-btn @click="router.push(`/users/${user.username}`)">View Profile</v-btn>
  </div>
</template>

<style scoped>
.userResult {
  display: flex;
  align-items: center;
  border: 2px solid gray;
  border-radius: 10px;
  box-shadow: 5px 5px 5px #778da9;
  margin-bottom: 20px;
  background-color: white;
  padding: 10px;
  justify-content: space-between;
}

.infoContainer {
  display: flex;
  align-items: center;
}

.userInfo {
  margin-left: 20px;
}

.infoContainer img {
  height: 100px;
  width: 100px;
  object-fit: cover;
  border-radius: 50%;
  cursor: pointer;
}

@media (max-width: 1000px) {
  img {
    height: 75px;
    width: 75px;
  }
}
</style>
