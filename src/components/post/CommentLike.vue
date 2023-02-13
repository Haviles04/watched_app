<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useUserStore } from "@/stores/users";
import { storeToRefs } from "pinia";
import { supabase } from "@/supabase";

const { post, showAddComment } = defineProps(["post", "showAddComment"]);
const emit = defineEmits(["toggleshowAddComment"]);

const userStore = useUserStore();
const { user } = storeToRefs(userStore);

const liked = ref();
const likedAmt = ref();
const error = ref(false);

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
        <v-icon
          v-if="!showAddComment"
          @click="emit('toggleshowAddComment')"
          color="#778da9"
          >mdi-comment-plus-outline</v-icon
        >
        <v-icon v-else @click="emit('toggleshowAddComment')" color="#778da9"
          >mdi-comment-minus-outline</v-icon
        >
      </div>
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
  margin-right: 10px;
}
</style>
