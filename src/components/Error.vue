<script setup lang="ts">
import { useRouter } from "vue-router";

const router = useRouter();

const handleClick = () => {
  router.push("/");
};
</script>

<template>
  <div class="container">
    <h1>Oops!</h1>
    <p>Something went wrong!</p>
    <p>Please try again later</p>
    <button @click="handleClick">Go home!</button>
  </div>
</template>

<style scoped>
.container {
  margin: 50px auto;
  text-align: center;
}

button {
  margin-top: 20px;
  color: white;
  background-color: #778da9;
  padding: 10px;
  border-radius: 10px;
  cursor: pointer;
}
</style>
