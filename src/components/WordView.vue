<template>
  <v-container
    text-xs-center
    mt-5
    pt-5
  >
    <p
      class="text-xs-right"
      v-if="viewWords.length > 0"
    > Number of Words: {{viewWords.length}}</p>
    <v-list
      v-if="viewWords.length > 0"
      two-line
      @dblclick.native="testMode = !testMode"
    >
      <template v-for="(viewWord, index) in viewWords">
        <v-list-tile
          :key="`${viewWord.id} - ${viewWord.word}`"
          avatar
          ripple
        >
          <v-list-tile-content>
            <v-list-tile-title>{{ viewWord.word }}</v-list-tile-title>
            <v-list-tile-sub-title>{{ viewWord.translation }}</v-list-tile-sub-title>
          </v-list-tile-content>
          <v-list-tile-action v-if="testMode">
            <v-btn
              icon
              ripple
              @click="deleteWordPair(viewWord.id)"
            >
              <v-icon
                class="text-xs-right"
                ml-a
              >clear</v-icon>
            </v-btn>
          </v-list-tile-action>
        </v-list-tile>
        <v-divider
          v-if="index + 1 < viewWords.length"
          :key="viewWord.id"
        ></v-divider>
      </template>
    </v-list>
  </v-container>

</template>

<script>
import { mapGetters } from "vuex";

export default {
  name: "home",
  data() {
    return {
      testMode: false
    };
  },
  created() {
    console.log("CRATED WordView");
    this.viewWords.length === 0 && this.$store.dispatch("WordView");
  },
  computed: {
    ...mapGetters(["loading", "posts", "events", "viewWords"])
  },
  methods: {
    deleteWordPair(viewWordId) {
      console.log("wordPairId", viewWordId);
      this.$store.dispatch("deleteWordPair", {
        id: viewWordId,
        view: true
      });
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
