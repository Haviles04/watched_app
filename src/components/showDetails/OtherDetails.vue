<script setup lang="ts">
const { showDetails } = defineProps(["showDetails"]);
</script>

<template>
  <div class="detailContainer">
    <div class="detailItem" v-if="showDetails.networks">
      <h3>Where to watch</h3>
      <p v-for="network in showDetails.networks">{{ network.name }}</p>
    </div>
    <div class="detailItem" v-if="showDetails.created_by">
      <h3>Created By:</h3>
      <p v-for="person in showDetails.created_by">{{ person.name }}</p>
    </div>

    <div class="detailItem">
      <h3>Voted</h3>
      <p>
        {{ `${showDetails.vote_average} / ${showDetails.vote_count} votes` }}
      </p>
    </div>

    <div class="detailItem" v-if="showDetails.homepage">
      <h3>HomePage</h3>
      <a :href="showDetails.homepage">{{ showDetails.homepage }}</a>
    </div>
  </div>
</template>

<style scoped>
.detailContainer {
  max-width: 900px;
  margin: 20px auto;
  background-color: #0d1b2a;
  padding: 1rem;
  border-radius: 1rem;
  box-shadow: 5px 5px 10px #778da9;
}

.detailContainer h3 {
  color: white;
}

.detailItem {
  margin: 0 auto;
  width: 80%;
  padding: 10px;
  border-bottom: 1px #e0e1dd solid;
}

.detailItem p {
  color: #e0e1dd;
}

.detailItem a {
  color: #778da9;
  cursor: pointer;
}

.detailItem a:visited {
  color: #778da9;
}
</style>
