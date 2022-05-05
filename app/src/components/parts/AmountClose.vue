<script setup lang="ts">
import { defineEmits } from "vue";
const emit = defineEmits(["close"]);

const setClose = () => {
  emit("close", true);
};
</script>

<template>
  <button
    class="bg-modal-container p-2 rounded text-sm active:opacity-50"
    @click="setClose()"
  >
    Close
  </button>
</template>
