import { createRouter, createWebHistory } from "vue-router";
import HomeView from "@/views/HomeView.vue";
import LoginView from "@/views/LoginView.vue";
import FindView from "@/views/FindView.vue";
import ShowDetailsView from "@/views/ShowDetailsView.vue";
import ProfileView from "@/views/ProfileView.vue";
import AccountView from "@/views/AccountView.vue";
import PeopleSearchView from "@/views/PeopleSearchView.vue";
import NotFoundView from "@/views/NotFoundView.vue";

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
    {
      path: "/users/:userName",
      name: "profile",
      component: ProfileView,
    },
    {
      path: "/account",
      name: "account",
      component: AccountView,
    },
    {
      path: "/users/search/:searchTerm",
      name: "peopleSearch",
      component: PeopleSearchView,
    },
    {
      path: "/users/search/",
      name: "peopleSearchBlank",
      component: PeopleSearchView,
    },
    {
      path: "/:pathMatch(.*)*",
      name: "notFound",
      component: NotFoundView,
    },
  ],
});

export default router;
