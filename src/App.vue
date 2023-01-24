<script setup lang="ts">
import { onBeforeMount, ref } from "vue";
import { storeToRefs } from "pinia";
import { RouterView, useRouter } from "vue-router";
import { useUserStore } from "./stores/users";
import Navbar from "./components/NavBar.vue";

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
    <div class="loading">
      <v-progress-circular indeterminate color="#1b263b"></v-progress-circular>
    </div>
  </main>
</template>

<style scoped>
.loading {
  width: 100%;
  min-height: 500px;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
