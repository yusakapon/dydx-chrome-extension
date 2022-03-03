<template>
  <div>
    <select>
      <option v-for="currencyPair in currencyPairs" :key="currencyPair.code">{{ currencyPair.name }}</option>
    </select>
    <p>Last Price:</p>
    <p>{{ price }}</p>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
export default defineComponent({
  name: "TradeHeader",
  data() {
    return {
      price: 450000 as number,
      currencyPairs: [
        { name: "BTC-USD", code: 0 },
        { name: "ETH-USD", code: 1 },
      ],
    };
  },
});
</script>

<style scoped>
select {
  background-color: #000000;
}
</style>
