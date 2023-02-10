<script setup lang="ts">
import { ref, onMounted, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { supabase } from "@/supabase";

const route = useRoute();
const searchTerm = ref<string>(route.params.searchTerm as string);
const searchMatches = ref<any>([]);
const allUserData = ref();
const error = ref(false);

const getAllUserData = async () => {
  try {
    const { data } = await supabase.from("users").select();
    allUserData.value = data;
  } catch {
    error.value = true;
  }
};

const filterSearch = async () => {
  searchMatches.value = [];
  allUserData?.value.map((user: string, {}, []) => {
    //turns object into array and lowercases
    const lowerCaseArr = Object.values(user).map((item) => {
      if (!item) return;
      return item.toLowerCase();
    });

    //custom filter to match multiple search terms
    const searchTermArr = searchTerm.value.toLowerCase().trim().split(" ");

    searchTermArr.forEach((term, i) => {
      //checks if values after first match, if not they remove the user from the matched arrays
      if (i > 0 && !lowerCaseArr.includes(searchTermArr[i - 1]))
        return searchMatches.value.pop();

      if (lowerCaseArr.includes(term) && !searchMatches.value.includes(user)) {
        searchMatches.value?.push(user);
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
