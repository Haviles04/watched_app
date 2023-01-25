import { createRouter, createWebHistory } from "vue-router";
import HomeView from "@/views/HomeView.vue";
import LoginView from "@/views/LoginView.vue";
import FindView from "@/views/FindView.vue";
import ShowDetailsView from "@/views/ShowDetailsView.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: HomeView,
    },
    {
      path: "/login",
      name: "login",
      component: LoginView,
    },
    {
      path: "/find",
      name: "find",
      component: FindView,
    },
    {
      path: "/:mediaType/:id",
      name: "showDetails",
      component: ShowDetailsView,
    },
  ],
});

export default router;
