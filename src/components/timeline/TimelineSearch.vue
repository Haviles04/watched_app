<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
const searchTerm = ref<string>();

const handleClick = () => {
  router.push(`/users/${searchTerm.value?.toLowerCase()}`);
};
</script>

<template>
  <div class="searchContainer">
    <form @submit.prevent="handleClick">
      <input
        v-model="searchTerm"
        type="text"
        placeholder="Search by username..."
      />
      <button @click="handleClick">
        Search <v-icon icon="mdi-magnify" size="large"></v-icon>
      </button>
    </form>
  </div>
</template>

<style scoped>
.searchContainer {
  margin-top: 30px;
  display: flex;
  justify-content: center;
  align-items: center;
}

button {
  background-color: white;
  border: 1px solid black;
  border-radius: 5px;
  padding: 5px;
  margin-top: 10px;
}

form {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
}

.searchContainer input {
  font-size: 18px;
  padding: 10px;
  height: 100%;
  max-width: 300px;
  width: 100%;
  border: 1px solid black;
  border-radius: 10px;
  background-color: white;
  margin-left: 10px;
}
</style>
