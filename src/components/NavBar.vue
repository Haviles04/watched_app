<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";
import { RouterView, useRouter } from "vue-router";
import { useUserStore } from "@/stores/users";
import { storeToRefs } from "pinia";
import blank from "@/assets/blank.jpg";
const { VITE_USERPHOTO_URL } = import.meta.env;

const drawer = ref(true);
const rail = ref(true);
const isMobile = ref(window.matchMedia("(max-width: 600px)"));
const router = useRouter();
const userStore = useUserStore();
const { user } = storeToRefs(userStore);

const photo = user.value?.photo
  ? `${VITE_USERPHOTO_URL}${user.value.photo}`
  : blank;

const handleLogout = () => {
  userStore.handleLogout();
};

onMounted(() => {
  window.addEventListener("resize", checkIsOnMobile);
});

onUnmounted(() => {
  window.removeEventListener("resize", checkIsOnMobile);
});

const checkIsOnMobile = () => {
  isMobile.value = window.matchMedia("(max-width: 625px)");
};
</script>

<template :onresize="checkIsOnMobile">
  <v-card>
    <v-layout>
      <v-navigation-drawer
        class="drawer"
        v-model="drawer"
        :rail="rail"
        permanent
        @click="rail = false"
        :location="isMobile.matches ? 'bottom' : 'left'"
      >
        <v-list-item
          class="user"
          :prepend-avatar="photo"
          prepend-icon="mdi-account-badge"
          nav
        >
          <template v-slot:append>
            <btn
              class="btn"
              variant="text"
              @click="router.push(`/users/${user?.userName}`)"
            >
              {{ user?.userName }}
            </btn>
            <v-btn
              variant="text"
              :icon="isMobile.matches ? 'mdi-chevron-down' : 'mdi-chevron-left'"
              @click.stop="rail = !rail"
            ></v-btn>
          </template>
        </v-list-item>

        <v-divider></v-divider>

        <v-list density="compact" nav class="nav">
          <div>
            <v-list-item
              prepend-icon="mdi-timeline"
              title="Timeline"
              value="Timeline"
              @click="router.push('/')"
            ></v-list-item>
            <v-list-item
              prepend-icon="mdi-movie-search"
              title="Search Media"
              value="search"
              @click="router.push('/find')"
            ></v-list-item>
          </div>

          <div>
            <v-divider></v-divider>
            <v-list-item
              prepend-icon="mdi-account"
              title="My Account"
              value="Account"
            ></v-list-item>

            <v-list-item
              prepend-icon="mdi-logout"
              title="Logout"
              value="Logout"
              @click="handleLogout"
            ></v-list-item>
          </div>
        </v-list>
      </v-navigation-drawer>
      <v-main class="main"><RouterView :key="$route.path" /> </v-main>
    </v-layout>
  </v-card>
</template>

<style scoped>
.main {
  background-color: rgb(231, 230, 230);
  min-height: 100vh;
}

.btn {
  cursor: pointer;
  margin-right: 30px;
}

.nav {
  height: calc(97% - 40px);
  display: flex;
  flex-flow: column;
  justify-content: space-between;
}
</style>
