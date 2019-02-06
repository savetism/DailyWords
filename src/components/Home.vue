<template>
  <v-container class="mt-4">
    <v-form
      v-model="isFormValid"
      lazy-validation
      ref="form"
      @submit.prevent="handleSubmit"
    >

      <!-- Title Input -->
      <v-layout row>
        <v-flex xs6>
          <v-text-field
            @keyup.enter="handleSubmit"
            ref="wordInput"
            :rules="wordRules"
            @blur="resetFormValidation"
            v-model="word"
            label="Word"
            type="text"
            required
          ></v-text-field>
        </v-flex>
      </v-layout>

      <!-- Image Url Input -->
      <v-layout row>
        <v-flex xs6>
          <v-text-field
            @keyup.enter="handleSubmit"
            :rules="translationRules"
            @blur="resetFormValidation"
            v-model="translation"
            label="Translation"
            type="text"
            required
          ></v-text-field>
        </v-flex>
      </v-layout>

      <!-- <v-btn
        class="ml-0"
        ripple
        color="accent"
        @click="handleSubmit"
        :loading="loading"
        :disabled="!isFormValid || loading"
      >
        Add Words
      </v-btn> -->

    </v-form>
    <v-list
      v-if="wordPairs.length > 0"
      mt-8
    >
      <template v-for="(wordPair, index) in wordPairs">
        <v-list-tile
          :key="`${wordPair.id} - ${wordPair.word}`"
          avatar
          ripple
        >
          <v-list-tile-content>
            <v-list-tile-title>{{ wordPair.word }} — {{ wordPair.translation }}</v-list-tile-title>
          </v-list-tile-content>
          <v-list-tile-action>
            <v-btn
              icon
              ripple
              @click="deleteWordPair(wordPair.id)"
            >
              <v-icon
                class="text-xs-right"
                ml-a
              >clear</v-icon>
            </v-btn>
          </v-list-tile-action>
        </v-list-tile>
        <v-divider
          v-if="index + 1 < wordPairs.length"
          :key="wordPair.id"
        ></v-divider>
      </template>
    </v-list>
    <v-layout
      align-end
      justify-end
    >
      <v-btn
        v-if="wordPairs.length > 0"
        ripple
        color="success"
        @click="saveList"
        :loading="loading"
        :disabled="loading"
        dark
      >
        Save List
      </v-btn>
    </v-layout>
  </v-container>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  name: "home",
  created() {
    this.$store.dispatch("WordBucket");
  },
  data() {
    return {
      isFormValid: true,
      word: "",
      translation: "",
      wordRules: [word => !!word || "Word is required"],
      translationRules: [
        translation => !!translation || "Translation is required"
      ]
    };
  },
  computed: {
    ...mapGetters(["loading", "posts", "events", "wordPairs"])
  },
  methods: {
    handleGetCarouselPosts() {
      this.$store.dispatch("allEvents");
    },
    goToPost(postId) {
      this.$router.push(`/posts/${postId}`);
    },
    deleteWordPair(wordPairId) {
      console.log("wordPairId", wordPairId);
      this.$store.dispatch("deleteWordPair", {
        id: wordPairId
      });
    },
    resetFormValidation() {
      console.log("resetValidation");
      this.$refs.form.resetValidation();
    },
    handleSubmit() {
      if (this.$refs.form.validate()) {
        this.$store
          .dispatch("createWordPair", {
            word: this.word,
            translation: this.translation
          })
          .then(() => {
            this.$refs.form.reset();
            this.$refs.wordInput.focus();
          });
      }
    },
    saveList() {
      this.$store.dispatch("updateAllWordPairs");
    }
  }
};
</script>

<style>
#carousel__title {
  position: absolute;
  cursor: pointer;
  background-color: rgba(0, 0, 0, 0.5);
  color: white;
  border-radius: 5px 5px 0 0;
  padding: 0.5em;
  margin: 0 auto;
  bottom: 50px;
  left: 0;
  right: 0;
}
</style>
