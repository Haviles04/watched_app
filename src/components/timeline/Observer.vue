<script setup lang="ts">
import { ref, onMounted } from "vue";

const observer = ref();
const root = ref(null);
const emit = defineEmits(["intersect"]);

onMounted(() => {
  observer.value = new IntersectionObserver(([entry]) => {
    if (entry && entry.isIntersecting) {
      emit("intersect");
    }
  });

  observer.value.observe(root.value);
});
</script>

<template>
  <div class="observer" ref="root"></div>
</template>

<style scoped>
.observer {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 50px;
  min-width: 100%;
}
</style>
