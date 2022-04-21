<script setup lang="ts">
import { computed, onMounted, defineEmits, ref } from "vue";
import { Market } from "@dydxprotocol/v3-client";
import { useStore } from "@/store";

const store = useStore();

const selectedPairs = ref<string>("");
const currencyPairs = computed(() => {
  return Market;
});
const bestAskPrice = computed(() => store.getters["orderbook/bestAskPrice"]);
const bestBidPrice = computed(() => store.getters["orderbook/bestBidPrice"]);

const emit = defineEmits(["currency-pair"]);

onMounted(() => {
  const pair = getPairFromUrl();
  selectedPairs.value = pair;
  emit("currency-pair", selectedPairs.value);
  initMarket(selectedPairs.value as keyof typeof Market);
});

const changeCurrency = (event: Event) => {
  emit("currency-pair", selectedPairs.value);
  initMarket(selectedPairs.value as keyof typeof Market);
};

const initMarket = async (market: keyof typeof Market) => {
  await store.dispatch("initMarket", {
    market: Market[market],
  });
};

const getPairFromUrl = () => {
  const url = location.pathname;
  const splitUrl = url.split("/");
  if (splitUrl[1] !== "trade") return "BTC_USD";
  const pair = splitUrl[2].replace("-", "_");
  return pair;
};

const setUrl = (pair: string) => {
  const pairUrl = pair.replace("_", "-");
  const url = location.pathname;
  location.pathname = "/" + url.split("/")[1] + "/" + pairUrl;
};
</script>

<template>
  <div class="flex p-2 items-center">
    <select
      class="bg-modal-container py-1 px-2 mr-2 rounded"
      @change="changeCurrency"
      v-model="selectedPairs"
    >
      <option v-for="(key, value) in currencyPairs" :key="key" :value="value">
        {{ key }}
      </option>
    </select>
    <div class="flex items-center">
      <div class="p-4">Price</div>
      <div>
        <div class="px-2 pb-2">
          {{ bestAskPrice }}
        </div>
        <div class="px-2">{{ bestBidPrice }}</div>
      </div>
    </div>
  </div>
</template>
