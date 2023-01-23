<script setup lang="ts">
import { onMounted } from "vue";
import { useRouter } from "vue-router";
import { useUserStore } from "@/stores/users";
import { storeToRefs } from "pinia";

const router = useRouter();
const userStore = useUserStore();
const { user } = storeToRefs(userStore);
console.log(user.value);
</script>

<template>home</template>
