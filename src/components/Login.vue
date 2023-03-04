<script setup lang="ts">
import { ref, reactive } from "vue";
import loginVideo from "@/assets/loginVideo.mp4";
import watchedLogo from "@/assets/watchedLogo.png";
import { useUserStore } from "@/stores/users";
import { storeToRefs } from "pinia";

const userStore = useUserStore();
const { loading, errorMessage } = storeToRefs(userStore);
const isSignup = ref(false);

interface userCredentials {
  email: string;
  password: string;
  userName?: string;
}

const userCredentials = reactive<userCredentials>({
  email: "",
  password: "",
  userName: "",
});

const displaySignUp = (): void => {
  isSignup.value = !isSignup.value;
};

const handleSubmit = async (e: Event) => {
  e.preventDefault();

  if (!isSignup.value) {
    await userStore.handleLogin({
      email: userCredentials.email.toLowerCase(),
      password: userCredentials.password,
    });
    return;
  }

  await userStore.handleSignup({
    email: userCredentials.email.toLowerCase(),
    password: userCredentials.password,
    userName: userCredentials.userName,
  });
};
</script>

<template>
  <main>
    <div class="container">
      <video
        :src="loginVideo"
        type="video/mp4"
        autoplay
        loop
        muted
        playsinline
      />
      <div class="loginForm">
        <img :src="watchedLogo" />
        <div v-if="!loading">
          <form @submit="handleSubmit">
            <input
              v-model="userCredentials.email"
              type="text"
              placeholder="Email"
            />
            <input
              v-model="userCredentials.userName"
              v-if="isSignup"
              type="text"
              placeholder="Username"
            />
            <input
              v-model="userCredentials.password"
              type="password"
              placeholder="Password"
            />
            <button type="submit">
              {{ !isSignup ? "Log in" : "Sign up" }}
            </button>
          </form>
          <p class="error">{{ errorMessage }}</p>
          <div class="signUpLogin">
            <p v-if="!isSignup">
              Don't have an account?
              <a @click="displaySignUp">Sign-up</a>
            </p>
            <p v-else>
              Already have an account?
              <a @click="displaySignUp">Log-in</a>
            </p>
          </div>
        </div>
        <div v-else class="loadingSpinner">
          <v-progress-circular
            indeterminate
            color="#1b263b"
          ></v-progress-circular>
        </div>
      </div>
    </div>
  </main>
</template>

<style scoped>
.container {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  height: 100vh;
}

.error {
  color: red;
}

.loginForm {
  border-radius: 10px;
  border: 1px lightgrey solid;
  position: absolute;
  background-color: white;
  padding: 4rem;
  display: flex;
  flex-direction: column;
  opacity: 85%;
}

.loginForm form {
  display: flex;
  flex-direction: column;
}

.loginForm input {
  height: 30px;
  margin-top: 0.5rem;
  padding-left: 10px;
  color: #1b263b;
}
.signUpLogin {
  margin-top: 1rem;
  color: #1b263b;
}

.signUpLogin a {
  color: #778da9;
  text-decoration: none;
  cursor: pointer;
}

.signUpLogin a:visited {
  color: #778da9;
}

.loginForm button {
  margin-top: 0.5rem;
  height: 30px;
  background-color: #1b263b;
  color: white;
  border-radius: 5px;
  border: none;
  cursor: pointer;
}

video {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.loadingSpinner {
  display: flex;
  justify-content: center;
}

@media (max-width: 660px) {
  .loginForm {
    padding: 2rem;
  }
}
</style>
