<script setup lang="ts">
import { computed, onMounted, defineEmits, ref } from "vue";
import { Market } from "@dydxprotocol/v3-client";
import { useStore } from "@/store";

const store = useStore();

const selectedPairs = ref<string>("");
const currencyPairs = computed(() => {
  const marketInfoAll = store.getters["market/marketInfoAll"];
  const marketsFromApi = marketInfoAll ? Object.keys(marketInfoAll) : [];
  const marketsKey = Object.keys(Market).filter((key) =>
    marketsFromApi.includes(Market[key as keyof typeof Market])
  );
  const pairObj: any = {};
  marketsKey.forEach((key) => {
    pairObj[key] = Market[key as keyof typeof Market];
  });
  return pairObj;
});

const priceDicimalPoint = computed(() =>
  store.getters["market/priceDicimalPoint"](
    Market[selectedPairs.value as keyof typeof Market]
  )
);
const bestAskPrice = computed(() => {
  const price = store.getters["orderbook/bestAskPrice"];
  return price ? price.toFixed(priceDicimalPoint.value) : "";
});
const bestBidPrice = computed(() => {
  const price = store.getters["orderbook/bestBidPrice"];
  return price ? price.toFixed(priceDicimalPoint.value) : "";
});

const emit = defineEmits(["currency-pair"]);
onMounted(() => {
  const pair = getPairFromUrl();
  selectedPairs.value = pair;
  emit("currency-pair", selectedPairs.value);
  initMarket(selectedPairs.value as keyof typeof Market);
});

const changeCurrency = () => {
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
  let pair = splitUrl[2].replace("-", "_");
  pair = pair.replace("1INCH", "ONEINCH");
  return pair;
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
        <div class="px-2">
          {{ bestBidPrice }}
        </div>
      </div>
    </div>
  </div>
</template>
