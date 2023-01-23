import { ref, reactive } from "vue";
import { defineStore } from "pinia";
import { supabase } from "../supabase";

export const useUserStore = defineStore("users", () => {
  interface UserSignupLogin {
    id?: number;
    email: string;
    password: string;
    userName: string;
  }

  interface User {
    id?: number;
    email?: string;
    userName?: string;
  }

  const user = ref<User>();
  const errorMessage = ref<string>("");
  const loading = ref(false);

  const validateEmail = (email: string) => {
    return String(email)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      );
  };

  const handleSignup = async (credentials: UserSignupLogin) => {
    const { email, password, userName } = credentials;

    if (!validateEmail(email)) {
      return (errorMessage.value = "Please enter a valid Email");
    }
    if (password.length < 6) {
      return (errorMessage.value = "Password must be at least 6 characters");
    }
    if (userName && userName.length < 8) {
      return (errorMessage.value = "Username must be at least 8 characters");
    }

    loading.value = true;

    const { data: userNameTaken } = await supabase
      .from("users")
      .select()
      .eq("userName", userName)
      .single();

    if (userNameTaken) {
      loading.value = false;
      return (errorMessage.value = "Username already taken");
    }

    const { error } = await supabase.auth.signUp({ email, password });

    if (error) {
      loading.value = false;
      return (errorMessage.value = error.message);
    }

    await supabase.from("users").insert({ userName, email });

    const { data: newUser } = await supabase
      .from("users")
      .select()
      .eq("email", email)
      .single();

    user.value = {
      id: newUser.id,
      email: newUser.email,
      userName: newUser.userName,
    };

    loading.value = false;
  };

  const handleLogin = async (
    email: string,
    password: string,
    userName: string
  ) => {
    if (!validateEmail(email)) {
      return (errorMessage.value = "Please enter a valid Email");
    }
    if (password.length < 6) {
      return (errorMessage.value = "Password must be at least 6 characters");
    }

    loading.value = true;

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      loading.value = false;
      errorMessage.value = error.message;
    }

    const { data: exisitingUser } = await supabase
      .from("users")
      .select()
      .eq("userName", userName)
      .single();

    user.value = {
      id: exisitingUser.id,
      email: exisitingUser.email,
      userName: exisitingUser.userName,
    };

    loading.value = false;
    errorMessage.value = "";
  };

  const getUser = async () => {
    loading.value = true;
    const { data: loggedInUser } = await supabase.auth.getUser();

    if (!loggedInUser.user) {
      loading.value = false;
      return (user.value = undefined);
    }

    const { data: userWithEmail } = await supabase
      .from("users")
      .select()
      .eq("email", loggedInUser.user?.email)
      .single();

    user.value = {
      id: userWithEmail.id,
      userName: userWithEmail.userName,
      email: userWithEmail.email,
    };
  };

  return {
    handleSignup,
    handleLogin,
    getUser,
    loading,
    errorMessage,
    user,
  };
});
