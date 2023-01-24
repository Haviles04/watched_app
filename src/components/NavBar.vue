<script setup lang="ts">
import { ref } from "vue";
import { RouterView, useRouter } from "vue-router";
import { useUserStore } from "@/stores/users";
import { storeToRefs } from "pinia";
import blank from "../assets/blank.jpg";
const { VITE_USERPHOTO_URL } = import.meta.env;

const drawer = ref(true);
const rail = ref(true);
const router = useRouter();
const userStore = useUserStore();
const { user } = storeToRefs(userStore);
const photo = user.value?.photo
  ? `${VITE_USERPHOTO_URL}${user.value.photo}`
  : blank;

const handleLogout = () => {
  userStore.handleLogout();
};
</script>

<template>
  <v-card>
    <v-layout>
      <v-navigation-drawer
        v-model="drawer"
        :rail="rail"
        permanent
        @click="rail = false"
      >
        <v-list-item
          class="user"
          :prepend-avatar="photo"
          prepend-icon="mdi-account-badge"
          :title="user?.userName"
          nav
        >
          <template v-slot:append>
            <v-btn
              variant="text"
              icon="mdi-chevron-left"
              @click.stop="rail = !rail"
            ></v-btn>
          </template>
        </v-list-item>

        <v-divider></v-divider>

        <v-list density="compact" nav class="nav">
          <div>
            <v-list-item
              prepend-icon="mdi-timeline"
              title="Timeline"
              value="Timeline"
              @click="router.push('/')"
            ></v-list-item>
            <v-list-item
              prepend-icon="mdi-movie-open-plus"
              title="Add Watched"
              value="Add Watched"
            ></v-list-item>
            <v-list-item
              prepend-icon="mdi-movie-search"
              title="Find Something To Watch"
              value="Find Something To Watch"
              @click="router.push('/find')"
            ></v-list-item>
          </div>
          <div>
            <v-list-item
              prepend-icon="mdi-logout"
              title="Logout"
              value="Logout"
              @click="handleLogout"
            ></v-list-item>
          </div>
        </v-list>
      </v-navigation-drawer>
      <v-main class="main"><RouterView /> </v-main>
    </v-layout>
  </v-card>
</template>

<style scoped>
.main {
  background-color: #1b263b;
  min-height: 100vh;
}
</style>
