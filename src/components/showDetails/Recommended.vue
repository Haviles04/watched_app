<script setup lang="ts">
import SmallCard from "./SmallCard.vue";

const { similar, mediaType } = defineProps(["similar", "mediaType"]);
</script>

<template>
  <section>
    <div class="container">
      <h1>More Like This...</h1>
      <div class="cardContainer">
        <SmallCard
          v-for="show in similar"
          :details="show"
          type="similar"
          :mediaType="mediaType"
        />
      </div>
    </div>
  </section>
</template>

<style scoped>
.container {
  max-width: 1000px;
  margin: 0 auto;
  text-align: center;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  background-color: #dddfe1;
  border-radius: 1rem;
  box-shadow: 10px 10px 10px #778da9;
  margin-bottom: 50px;
}

.cardContainer {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  margin-bottom: 50px;
}
</style>
