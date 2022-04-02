<script setup lang="ts">
import { ref, onMounted, defineEmits } from "vue";
import { Market } from "@dydxprotocol/v3-client";

type currency = {
  name: string;
  displayName: string;
};

const currencyPairs = ref<currency[]>([]);
const emit = defineEmits(["currency-pair"]);

onMounted(() => {
  const pairArray = Object.keys(Market);
  pairArray.forEach((element) => {
    const displayName = element.replace("_", "-");
    currencyPairs.value.push({ name: element, displayName: displayName });
  });
  emit("currency-pair", currencyPairs.value[0].name);
});

const changeCurrency = (event: Event) => {
  const value = (event.target as HTMLInputElement).value;
  emit("currency-pair", value);
};
</script>

<template>
  <div class="flex p-2">
    <select
      class="bg-modal-container py-1 px-2 mr-2 rounded"
      @change="changeCurrency"
    >
      <option
        v-for="currencyPair in currencyPairs"
        :key="currencyPair.name"
        :value="currencyPair.name"
      >
        {{ currencyPair.displayName }}
      </option>
    </select>
  </div>
</template>
