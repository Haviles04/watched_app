<script setup lang="ts">
import Profile from "@/components/profile/Profile.vue";
import { useRoute } from "vue-router";

const route = useRoute();
const { userName } = route.params;
console.log(userName);
</script>

<template>
  <main>
    <Profile />
  </main>
</template>
