<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { supabase } from "@/supabase";

const route = useRoute();

const searchTerm = route.params.searchTerm as string;
const searchTermArr = searchTerm.split(" ");
const searchMatches = ref<{}[]>([]);
const error = ref(false);

const filterSearchByQuery = async () => {
  //fetchs data from user table from supabase
  try {
    const { data: allUserData } = await supabase.from("users").select();
    console.log(allUserData);
    allUserData?.map((user: string, {}, []) => {
      let lowerCaseArr: string[] = [];

      //turns each user which is an object into an array and lowercases the value
      Object.values(user).map((item) => {
        if (!item) return;
        lowerCaseArr.push(item.toLowerCase());
      });

      //goes through each value in the search term and pushes value to matched array
      searchTermArr.forEach((term, i) => {
        //returns if the term before it doesn't match
        if (i > 0 && !lowerCaseArr.includes(searchTermArr[i - 1]))
          return searchMatches.value.pop();

        //pushes user to array if searchterm is matched
        if (
          lowerCaseArr.includes(term) &&
          !searchMatches.value.includes(user)
        ) {
          searchMatches.value?.push(user);
        }
      });
    });
  } catch {
    error.value = true;
  }
};

onMounted(() => {
  filterSearchByQuery();
});
</script>

<template>
  <h1>Search</h1>
</template>

<style scoped></style>
