<script setup lang="ts">
import blank from "@/assets/blank.jpg";
const { cast } = defineProps(["cast"]);
</script>

<template>
  <section>
    <div class="castContainer">
      <h1>Cast</h1>
      <div class="memberContainer">
        <div class="castMember" v-for="member in cast">
          <p>{{ member.name }}</p>
          <img
            :src="
              member.profile_path
                ? `https://image.tmdb.org/t/p/w200/${member.profile_path}`
                : blank
            "
            :alt="member.name"
          />
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.castContainer {
  max-width: 1000px;
  display: flex;
  align-items: center;
  flex-direction: column;
  margin: 20px auto;
  background-color: #374a63;
  padding: 1rem;
  border-radius: 1rem;
  box-shadow: 10px 10px 10px #778da9;
  color: white;
}

.memberContainer {
  display: flex;
  justify-content: center;
  flex-direction: row;
  flex-wrap: wrap;
}
.castMember {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 15px;
  align-self: flex-end;
  text-align: center;
}

.castMember img {
  width: 100px;
  min-height: 150px;
}
</style>
