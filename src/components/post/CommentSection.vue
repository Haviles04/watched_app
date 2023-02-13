<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useUserStore } from "@/stores/users";
import { storeToRefs } from "pinia";
import blank from "@/assets/blank.jpg";
import { supabase } from "@/supabase";
import { useRouter } from "vue-router";

const { post, showAddComment } = defineProps(["post", "showAddComment"]);
const emit = defineEmits(["refreshComments"]);

const userStore = useUserStore();
const { user } = storeToRefs(userStore);

const { VITE_USERPHOTO_URL } = import.meta.env;

const postComments = ref();
const newComment = ref("");
const error = ref(false);
const loading = ref(false);

const router = useRouter();

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
    fetchComments();
  } catch {
    error.value = true;
  }
};

const fetchComments = async () => {
  loading.value = true;
  try {
    const response = await supabase
      .from("posts_comments")
      .select()
      .eq("post_id", post.id);
    postComments.value = response.data;
  } catch {
    error.value = true;
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchComments();
});
</script>

<template>
  <p class="error" v-if="error">
    Oops something went wrong, please try again later
  </p>
  <div v-else class="commentSectionContainer">
    <div class="addComment" v-if="showAddComment">
      <img :src="userImage" />
      <form @submit.prevent="handleAddComment">
        <input
          v-model="newComment"
          type="text"
          placeholder="Add a comment..."
        />
      </form>
    </div>
    <div class="commentContainer">
      <div v-for="comment in postComments" class="comment" :key="comment.id">
        <img
          :src="`${VITE_USERPHOTO_URL}/${comment.commenter_photo}`"
          @click="router.push(`/users/${comment.commenter_username}`)"
        />
        <div>
          <h3>{{ comment.commenter_username }}</h3>
          <p class="commentWords">"{{ comment.comment }}"</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.commentSectionContainer {
  margin-top: 10px;
  padding-top: 10px;
}
.comment {
  width: 100%;
  padding: 10px;
  display: flex;
}

.commentWords {
  background-color: #dddfe1;
  border-radius: 10px;
  padding: 0 10px;
  word-break: break-all;
  white-space: normal;
}

h3 {
  text-decoration: underline;
}

img {
  height: 50px;
  width: 50px;
  border-radius: 50%;
  object-fit: cover;
  margin-right: 10px;
  cursor: pointer;
}

.addComment {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}

.addComment form {
  width: 100%;
}

.addComment input {
  resize: none;
  margin-left: 10px;
  padding: 10px;
  width: 100%;
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
