<script setup lang="ts">
import placeHolder from "@/assets/placeholderImg.png";
const { showDetails } = defineProps(["showDetails"]);
const detailimage = showDetails.poster_path
  ? `https://image.tmdb.org/t/p/w400/${showDetails.poster_path}`
  : placeHolder;
const title = showDetails.name || showDetails.title;
</script>

<template>
  <div
    class="container"
    :style="{
      backgroundImage: `url(https://image.tmdb.org/t/p/original/${showDetails.backdrop_path})`,
    }"
  >
    <div class="overlay"></div>
    <img class="mainImage" :src="detailimage" alt="title" />
    <div class="title">
      <div>
        <h1>{{ title }}</h1>
        <p class="tagline">{{ showDetails.tagline }}</p>
        <div class="mainView">
          <h3>Overview</h3>
          <p>{{ showDetails.overview }}</p>
          <button>Add to watched</button>
        </div>
      </div>
    </div>
  </div>
  <div class="mobileView">
    <h3>Overview</h3>
    <p>{{ showDetails.overview }}</p>
    <button>Add to watched</button>
  </div>
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
h1 {
  color: white;
}

.container {
  max-width: 100%;
  height: 500px;
  background-size: cover;
  background-position-y: center;
  display: flex;
  justify-content: space-around;
}
.title {
  max-width: 700px;
  border-radius: 20px;
  margin-left: 20px;
  padding: 20px;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
}

.tagline {
  color: rgb(182, 173, 173);
  font-style: italic;
}

.title h1,
h3,
p {
  color: white;
}

.mainView {
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
.mainView h3 {
  margin-top: 10px;
}

.mobileView {
  display: none;
}

.mainView button {
  background-color: white;
  padding: 10px;
  border-radius: 5px;
  max-width: 200px;
}

.overlay {
  position: absolute;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.582);
}

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

@media (max-width: 600px) {
  .mainImage {
    width: 50%;
    height: auto;
  }

  .title {
    height: 50%;
  }

  .container {
    align-items: center;
  }

  .mainView {
    display: none;
  }

  .mobileView {
    display: flex;
    flex-direction: column;
    background-color: #1b263b;
    padding: 15px;
    border-radius: 0px 0px 10px 10px;
  }

  .mobileView button {
    background-color: white;
    border-radius: 10px;
    padding: 10px;
    margin: 10px auto;
  }
}
</style>
