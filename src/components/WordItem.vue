<template>
  <v-list-tile
    avatar
    ripple
  >
    <v-list-tile-content>
      <v-list-tile-title>{{ viewWord.word }}

      </v-list-tile-title>
      <v-list-tile-sub-title>
        <span v-if="!showTranslation">
          <v-btn
            class="ma-0 font-italic font-weight-light text-lowercase"
            outline
            small
            color="primary"
            @click="showTranslation = !showTranslation"
          >Translation</v-btn>
        </span>
        <span v-else>
          {{ viewWord.translation }}
        </span>
      </v-list-tile-sub-title>
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
</template>

<script>
export default {
  name: "WordItem",
  data() {
    return {
      showTranslation: false
    };
  },
  props: ["viewWord", "testMode", "deleteWordPair"]
};
</script>

<style>
</style>
