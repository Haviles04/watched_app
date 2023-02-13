<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useUserStore } from "@/stores/users";
import { storeToRefs } from "pinia";
import blank from "@/assets/blank.jpg";
import { supabase } from "@/supabase";

const { VITE_USERPHOTO_URL } = import.meta.env;
const { post } = defineProps(["post"]);
const emit = defineEmits(["refreshComments"]);

const userStore = useUserStore();
const { user } = storeToRefs(userStore);

const newComment = ref("");
const liked = ref();
const likedAmt = ref();
const error = ref(false);

const userImage = user.value?.photo
  ? `${VITE_USERPHOTO_URL}${user.value.photo}`
  : blank;

const handleAddComment = async () => {
  try {
    const response = await supabase.from("posts_comments").insert({
      post_id: post.id,
      commenter_id: user.value!.id,
      comment: newComment.value,
      commenter_photo: user.value!.photo,
      commenter_username: user.value!.userName,
    });

    newComment.value = "";
    emit("refreshComments");
  } catch {
    error.value = true;
  }
};

const handleLike = async () => {
  try {
    await supabase
      .from("post_likes")
      .insert({ post_id: post.id, likedby_id: user.value!.id });
    likedAmt.value++;
  } catch {
    error.value = true;
  } finally {
    liked.value = true;
  }
};

const handleRemoveLike = async () => {
  try {
    await supabase
      .from("post_likes")
      .delete()
      .eq("post_id", post.id)
      .eq("likedby_id", user.value!.id);
    likedAmt.value--;
  } catch {
    error.value = true;
  } finally {
    liked.value = false;
  }
};

const checkIfLiked = async () => {
  try {
    const { data } = await supabase
      .from("post_likes")
      .select()
      .eq("post_id", post.id)
      .eq("likedby_id", user.value!.id);

    if (data!.length > 0) liked.value = true;
    getAmtOfLikes();
  } catch {
    error.value = true;
    liked.value = false;
  }
};

const getAmtOfLikes = async () => {
  try {
    const { data } = await supabase
      .from("post_likes")
      .select()
      .eq("post_id", post.id);
    likedAmt.value = data!.length;
  } catch {
    error.value = true;
    liked.value = false;
  }
};

onMounted(() => {
  checkIfLiked();
});
</script>

<template>
  <div class="likeComments">
    <div class="likeBar">
      <p class="error" v-if="error">
        Oops something went wrong, please try again later
      </p>
      <div v-else class="likes">
        <p>{{ likedAmt }}</p>
        <v-icon v-if="!liked" @click="handleLike" color="#778da9"
          >mdi-thumb-up-outline</v-icon
        ><v-icon v-else @click="handleRemoveLike" color="#778da9"
          >mdi-thumb-up</v-icon
        >
      </div>
    </div>
    <div class="addComment">
      <img :src="userImage" />
      <form @submit.prevent="handleAddComment">
        <input
          v-model="newComment"
          type="text"
          placeholder="Add a comment..."
        />
      </form>
    </div>
  </div>
</template>

<style scoped>
.likeComments {
  margin: 0 auto;
  width: 100%;
  border-radius: 5px;
  padding: 5px;
}

.likeBar {
  margin: 10px;
  padding: 2px;
  display: flex;
}

.likes {
  display: flex;
}

.likes p {
  margin-right: 10px;
}

.likeBar .error {
  color: red;
}

.likeBar i {
  cursor: pointer;
}

.addComment {
  display: flex;
  align-items: center;
}

.addComment form {
  width: 100%;
}

.addComment input {
  display: flex;
  flex-grow: 1;
  margin-left: 10px;
  padding: 10px;
  width: 80%;
  background-color: #dddfe1;
  border-radius: 10px;
  outline: none;
}

.addComment img {
  width: 50px;
  height: 50px;
  object-fit: cover;
  border-radius: 50%;
}
</style>
