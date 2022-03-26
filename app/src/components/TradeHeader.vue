<script setup lang="ts">
import { ref } from "vue";
const price = ref<number>(45000);
const currencyPairs = ref([
  { name: "BTC-USD", code: 0 },
  { name: "ETH-USD", code: 1 },
]);
</script>

<template>
  <div class="flex p-2">
    <select class="bg-modal-container py-1 px-2 mr-2 rounded">
      <option v-for="currencyPair in currencyPairs" :key="currencyPair.code">
        {{ currencyPair.name }}
      </option>
    </select>
    <div>
      <p>Last Price:</p>
      <p class="text-lg text-center">{{ price }}</p>
    </div>
  </div>
</template>
