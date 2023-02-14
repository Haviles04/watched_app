<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import { useRoute } from "vue-router";
import { supabase } from "@/supabase";
import ResultCard from "./ResultCard.vue";

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
const searchTerm = ref<string>(route.params.searchTerm as string);

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

const noResults = computed(() =>
  !filteredUsers.value ? true : filteredUsers.value!.length ? false : true
);

onMounted(() => {
  getAllUserData();
});
</script>

<template>
  <div class="searchContainer">
    <h1>Search</h1>
    <input
      type="text"
      v-model="searchTerm"
      placeholder="Search for someone.."
    />
    <button></button>
  </div>
  <div v-if="noResults" class="noUser">
    <h2>Ooops!</h2>
    <p>We couldn't find the person you are looking for!</p>
  </div>
  <div v-if="!error">
    <section>
      <div class="resultContainer">
        <ResultCard v-for="user in filteredUsers" :user="user" :key="user.id" />
      </div>
    </section>
  </div>
  <div v-else>Ooops.. something went wrong</div>
</template>

<style scoped>
.searchContainer {
  margin: 0 auto;
  max-width: 1000px;
  margin: 25px auto;
}

.searchContainer input {
  background-color: white;
  border: 1px solid black;
  border-radius: 5px;
  padding-left: 5px;
}
.resultContainer {
  margin: 0 auto;
  max-width: 1000px;
  display: flex;
  flex-direction: column;
}

.noUser {
  width: 100%;
  text-align: center;
  margin: 0 auto;
}
</style>
