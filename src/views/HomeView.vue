<script setup lang="ts">
import { onMounted } from "vue";
import { useRouter } from "vue-router";
import { useUserStore } from "@/stores/users";
import { storeToRefs } from "pinia";

const router = useRouter();
const userStore = useUserStore();
const { user } = storeToRefs(userStore);

onMounted(() => {
  if (!user.value) {
    router.push("/login");
  }
});
</script>

<template>home</template>
