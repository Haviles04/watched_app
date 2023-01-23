<script setup lang="ts">
import { onMounted, ref } from "vue";
import { storeToRefs } from "pinia";
import { RouterView, useRouter } from "vue-router";
import Navbar from "./components/NavBar.vue";
import { useUserStore } from "./stores/users";

const userStore = useUserStore();
const { user } = storeToRefs(userStore);
</script>

<template>
  <main>
    <Navbar v-if="user" :user="user" />
    <RouterView />
  </main>
</template>

<style scoped></style>
