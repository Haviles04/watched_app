<script setup lang="ts">
import { ref } from "vue";
import Loading from "../Loading.vue";
import { supabase } from "@/supabase";
import { useUserStore } from "@/stores/users";
import { storeToRefs } from "pinia";

const userStore = useUserStore();
const { user } = storeToRefs(userStore);

const { textColor, id, mediaType, image, name } = defineProps([
  "textColor",
  "id",
  "image",
  "mediaType",
  "name",
]);

const emit = defineEmits(["setWatched"]);
const dialog = ref<boolean>(false);
const rating = ref(0);
const thoughts = ref<string>();
const loading = ref<boolean>(false);

const savePost = async () => {
  loading.value = true;

  if (!id) {
    loading.value = false;
    return;
  }

  const { data } = await supabase.from("post").insert({
    show_id: id,
    show_image: image,
    caption: thoughts.value,
    owner_id: user.value?.id,
    rating: rating.value,
    media_type: mediaType,
    created_at: new Date(),
    name,
  });

  emit("setWatched");

  loading.value = false;
  dialog.value = false;
};
</script>

<template>
  <div v-if="!loading">
    <v-row justify="center">
      <v-dialog v-model="dialog" persistent>
        <template v-slot:activator="{ props }">
          <v-btn class="btn" :color="textColor" v-bind="props">
            Add to Watched</v-btn
          >
        </template>
        <v-card class="container">
          <v-card-title>
            <span class="text-h5">Add to your watched</span>
          </v-card-title>
          <v-card-text>
            <v-container>
              <v-row>
                <v-col>
                  <v-text-field
                    class="text"
                    v-model="thoughts"
                    label="Comments..."
                    required
                  ></v-text-field>
                  <div class="text-center">
                    <h2>Rating</h2>
                    <v-rating
                      v-model="rating"
                      bg-color="orange-lighten-1"
                      color="blue"
                    ></v-rating>
                  </div>
                </v-col>
              </v-row>
            </v-container>
            <small>*indicates required field</small>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="blue-darken-1" variant="text" @click="dialog = false">
              Close
            </v-btn>
            <v-btn color="blue-darken-1" variant="text" @click="savePost">
              Save
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-row>
  </div>

  <Loading v-else />
</template>

<style scoped>
.container {
  width: 100%;
  height: fit-content !important;
  padding: 20px;
  max-width: 950px;
  margin: 0 auto;
}

.btn {
  margin-top: 25px;
  margin-left: 15px;
}
</style>
