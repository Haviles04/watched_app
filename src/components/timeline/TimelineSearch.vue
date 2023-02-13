<script setup lang="ts">
import { supabase } from "@/supabase";
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
const searchTerm = ref<string>();
const allUsers = ref();

const handleClick = async () => {
  router.push(`/users/search/${searchTerm.value?.toLowerCase()}`);
};

onMounted(async () => {
  const { data: allUserData } = await supabase.from("users").select();
  allUsers.value = allUserData;
});
</script>

<template>
  <div class="searchContainer">
    <form @submit.prevent="handleClick">
      <input
        v-model="searchTerm"
        type="text"
        placeholder="Search by username..."
      />
      <button :disabled="searchTerm ? false : true">
        <v-icon icon="mdi-magnify" size="large"></v-icon>
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
  margin-bottom: 20px;
}

button {
  background-color: white;
  border: 1px solid black;
  border-radius: 0 10px 10px 0;
  border-left: 0;
  padding: 8px;
}

form {
  display: flex;
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
  border-radius: 10px 0 0 10px;
  background-color: white;
  margin-left: 10px;
}
</style>
