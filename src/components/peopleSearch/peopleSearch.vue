<script setup lang="ts">
import { ref, onMounted, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { supabase } from "@/supabase";

interface User {
  id?: number;
  email?: string;
  userName?: string;
  photo?: string;
  first_name?: string;
  last_name?: string;
  hometown?: string;
}

const route = useRoute();
const searchTerm = ref<string>(route.params.searchTerm as string);
const searchMatches = ref<any>([]);
const allUserData = ref<User[] | null>();
const error = ref(false);

const getAllUserData = async () => {
  try {
    const { data } = await supabase.from("users").select();
    allUserData.value = data;
  } catch {
    error.value = true;
  }
};

const filterSearch = () => {
  searchMatches.value = [];
  allUserData.value?.map((user) => {
    Object.values(user).filter((key) => {
      if (!key || searchMatches.value.includes(user)) return;
      if (key.toLowerCase().includes(searchTerm.value.toLowerCase())) {
        searchMatches.value.push(user);
      }
    });
  });
};

watch(searchTerm, () => filterSearch());

onMounted(async () => {
  await getAllUserData();
  filterSearch();
});

console.log(searchTerm.value);
</script>

<template>
  <h1>Search</h1>
  <input type="text" v-model="searchTerm" />
  <div v-for="person in searchMatches">
    <h1>{{ person.username }}</h1>
  </div>
</template>

<style scoped></style>
