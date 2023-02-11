<script setup lang="ts">
import { ref, onMounted, watch, computed } from "vue";
import { useRoute } from "vue-router";
import { supabase } from "@/supabase";

interface User {
  id?: number;
  email?: string;
  username?: string;
  photo?: string;
  first_name?: string;
  last_name?: string;
  hometown?: string;
}

const route = useRoute();
const allUserData = ref<User[] | null>();
const error = ref(false);
const searchTerm = ref<string>();
searchTerm.value = route.params.searchTerm as string;

const getAllUserData = async () => {
  try {
    const { data } = await supabase.from("users").select();
    allUserData.value = data;
  } catch {
    error.value = true;
  }
};

const filteredUsers = computed(() =>
  searchTerm.value
    ? allUserData.value?.filter(({ first_name, last_name, username }) =>
        [first_name, last_name, username]
          .join(" ")
          .toLowerCase()
          .includes(searchTerm.value!.toLowerCase())
      )
    : allUserData.value
);

onMounted(() => {
  getAllUserData();
});
</script>

<template>
  <h1>Search</h1>
  <input type="text" v-model="searchTerm" />
  <div v-for="user in filteredUsers">{{ user.username }}</div>
</template>

<style scoped></style>
