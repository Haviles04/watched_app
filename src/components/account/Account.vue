<script setup lang="ts">
import { ref } from "vue";
import { useUserStore } from "@/stores/users";
import { storeToRefs } from "pinia";
import blank from "@/assets/blank.jpg";
import { supabase } from "@/supabase";
import Loading from "../Loading.vue";
import Error from "../Error.vue";
const { VITE_USERPHOTO_URL } = import.meta.env;

const userStore = useUserStore();
const { user } = storeToRefs(userStore);
const userImage = ref<string>();
const dialog = ref(false);
const file = ref();
const newFirst = ref<string>();
const newLast = ref<string>();
const newHometown = ref("");
const loading = ref(false);
const error = ref(false);

userImage.value = user.value?.photo
  ? `${VITE_USERPHOTO_URL}${user.value.photo}`
  : blank;

const handleUploadChange = (e: any) => {
  if (e.target!.files[0]) {
    file.value = e.target!.files[0];
  }
};

const changeFirst = async () => {
  if (!newFirst) return;
  try {
    await supabase
      .from("users")
      .update({ first_name: newFirst.value })
      .match({ id: user.value!.id });
  } catch {
    error.value = true;
  }
};

const changeLast = async () => {
  if (!newLast) return;
  try {
    await supabase
      .from("users")
      .update({ last_name: newLast.value })
      .match({ id: user.value!.id });
  } catch {
    error.value = true;
  }
};
const changeHometown = async () => {
  if (!newHometown.value) return;
  try {
    await supabase
      .from("users")
      .update({ hometown: newHometown.value })
      .match({ id: user.value!.id });
  } catch {
    error.value = true;
  }
};

const newPhoto = async () => {
  if (!file.value) return;

  try {
    await supabase.storage.from("userphotos").remove([`${user.value?.photo}`]);

    const fileName = `${user.value!.id}/${file.value.name}`;
    const { data } = await supabase.storage
      .from("userphotos")
      .upload("public/" + fileName, file.value);

    await supabase
      .from("users")
      .update({ photo: data!.path })
      .match({ id: user.value!.id });
  } catch {
    error.value = true;
  }
};

const handleSave = async () => {
  loading.value = true;
  await changeFirst();
  await changeLast();
  await changeHometown();
  await newPhoto();
  userStore.getUser();
  loading.value = false;
};
</script>

<template>
  <div v-if="error"><Error /></div>
  <div v-else>
    <div class="userContainer">
      <h2>{{ user?.userName }}</h2>
      <img :src="userImage" />
      <p>First name: {{ user?.first_name }}</p>
      <p>Last name: {{ user?.last_name }}</p>
      <p>Hometown: {{ user?.hometown }}</p>
    </div>
    <div class="changeInfo">
      <v-row justify="center">
        <v-dialog v-model="dialog" persistent>
          <template v-slot:activator="{ props }">
            <v-btn color="#778da9" v-bind="props"> Change info </v-btn>
          </template>
          <v-card class="infoCard" v-if="!loading">
            <v-card-title>
              <span class="text-h5">User Profile</span>
            </v-card-title>
            <v-card-text>
              <v-container>
                <v-row>
                  <div class="uploadContainer">
                    <span>Profile Picture</span>
                    <input
                      class="photoUpload"
                      type="file"
                      accept=".jpeg,.png,.jpg"
                      @change="handleUploadChange"
                    />
                  </div>
                </v-row>
                <v-row>
                  <v-text-field
                    label="First name"
                    v-model="newFirst"
                  ></v-text-field>
                </v-row>
                <v-row>
                  <v-text-field
                    label="Last name"
                    v-model="newLast"
                  ></v-text-field>
                </v-row>
                <v-row>
                  <v-text-field
                    label="Hometown"
                    v-model="newHometown"
                  ></v-text-field>
                </v-row>
              </v-container>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn
                color="blue-darken-1"
                variant="text"
                @click="dialog = false"
              >
                Close
              </v-btn>
              <v-btn color="blue-darken-1" variant="text" @click="handleSave">
                Save
              </v-btn>
            </v-card-actions>
          </v-card>
          <div v-else>
            <Loading />
          </div>
        </v-dialog>
      </v-row>
    </div>
  </div>
</template>

<style scoped>
.changeInfo {
  margin-top: 50px;
}

.infoCard {
  margin: 0 auto;
  width: 100%;
  max-width: 500px;
}
.userContainer {
  max-width: 1000px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.userContainer h2 {
  margin-top: 50px;
}

.photoUpload {
  margin-bottom: 20px;
}

.uploadContainer {
  display: flex;
  flex-direction: column;
}

img {
  height: 200px;
}
</style>
