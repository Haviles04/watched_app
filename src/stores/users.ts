import { ref, reactive } from "vue";
import { defineStore } from "pinia";
import { supabase } from "../supabase";
import { useRouter } from "vue-router";

export const useUserStore = defineStore("users", () => {
  interface UserSignupLogin {
    id?: number;
    email: string;
    password: string;
    userName?: string;
  }

  interface User {
    id?: number;
    email?: string;
    userName?: string;
    photo?: string;
    first_name?: string;
    last_name?: string;
    hometown?: string;
  }

  const router = useRouter();
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

  const validUserName = (name: string) => {
    let patt = /^([a-zA-Z0-9_-]+)$/;
    return patt.test(name);
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
    if (!validUserName(userName!)) {
      return (errorMessage.value = "Username may only by numbers and letters");
    }

    loading.value = true;

    const { data: userNameTaken } = await supabase
      .from("users")
      .select()
      .eq("username", userName)
      .single();

    if (userNameTaken) {
      loading.value = false;
      return (errorMessage.value = "Username already taken");
    }

    const { data, error } = await supabase.auth.signUp({ email, password });

    if (error) {
      loading.value = false;
      return (errorMessage.value = error.message);
    }

    await supabase
      .from("users")
      .insert({ id: data.user!.id, username: userName?.toLowerCase(), email });

    const { data: newUser } = await supabase
      .from("users")
      .select()
      .eq("email", email)
      .single();

    user.value = {
      id: newUser.id,
      email: newUser.email,
      userName: newUser.username,
    };

    loading.value = false;
    errorMessage.value = "";
    router.push("/");
  };

  const handleLogin = async (credentials: UserSignupLogin) => {
    const { email, password, userName } = credentials;

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
      return;
    }

    const { data: exisitingUser } = await supabase
      .from("users")
      .select()
      .eq("email", email)
      .single();

    user.value = {
      id: exisitingUser.id,
      email: exisitingUser.email,
      userName: exisitingUser.username,
      photo: exisitingUser.photo,
      first_name: exisitingUser.first_name,
      last_name: exisitingUser.last_name,
      hometown: exisitingUser.hometown,
    };

    loading.value = false;
    errorMessage.value = "";
    router.push("/");
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
      userName: userWithEmail.username,
      email: userWithEmail.email,
      photo: userWithEmail.photo,
      first_name: userWithEmail.first_name,
      last_name: userWithEmail.last_name,
      hometown: userWithEmail.hometown,
    };
    loading.value = false;
    return true;
  };

  const handleLogout = async () => {
    loading.value = true;
    user.value = undefined;
    await supabase.auth.signOut();
    router.push("/login");
    loading.value = false;
  };

  return {
    handleSignup,
    handleLogin,
    handleLogout,
    getUser,
    loading,
    errorMessage,
    user,
  };

  console.log(user.value);
});
