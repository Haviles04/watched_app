<script setup lang="ts">
const { postComments } = defineProps(["postComments"]);

const { VITE_USERPHOTO_URL } = import.meta.env;
</script>

<template>
  <div class="commentContainer">
    <div v-for="comment in postComments" class="comment">
      <img :src="`${VITE_USERPHOTO_URL}/${comment.commenter_photo}`" />
      <div>
        <h3>{{ comment.commenter_username }}</h3>
        <p class="commentWords">"{{ comment.comment }}"</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.commentContainer {
  margin-top: 10px;
  border-top: 1px solid #778da9;
  padding-top: 10px;
}
.comment {
  width: 100%;

  padding: 5px;
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
}
</style>
