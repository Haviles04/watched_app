<script setup lang="ts">
import { onBeforeMount, ref } from "vue";
import { storeToRefs } from "pinia";
import { RouterView, useRouter } from "vue-router";
import { useUserStore } from "./stores/users";
import Navbar from "./components/NavBar.vue";
import Loading from "./components/Loading.vue";

const router = useRouter();
const userStore = useUserStore();
const { user, loading } = storeToRefs(userStore);

onBeforeMount(async () => {
  await userStore.getUser();
  if (!user.value) {
    router.push("/login");
  }
});
</script>

<template>
  <main v-if="!loading">
    <div v-if="user">
      <Navbar />
    </div>
    <div v-else>
      <RouterView />
    </div>
  </main>
  <main v-else>
    <loading />
  </main>
</template>

<style scoped></style>
