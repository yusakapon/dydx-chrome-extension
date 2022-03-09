<script setup lang="ts">
import { ref } from "vue";
const price = ref<number>(45000);
const currencyPairs = ref([
  { name: "BTC-USD", code: 0 },
  { name: "ETH-USD", code: 1 },
]);
</script>

<template>
  <div>
    <select>
      <option v-for="currencyPair in currencyPairs" :key="currencyPair.code">
        {{ currencyPair.name }}
      </option>
    </select>
    <p>Last Price:</p>
    <p>{{ price }}</p>
  </div>
</template>

<style scoped>
select {
  background-color: #000000;
}
</style>
