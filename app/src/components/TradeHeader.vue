<script setup lang="ts">
import { computed, onMounted, defineEmits, ref } from "vue";
import { Market } from "@dydxprotocol/v3-client";
import { useStore } from "@/store";

const store = useStore();

const selectedPairs = ref<string>("");
const currencyPairs = computed(() => {
  return Market;
});

const emit = defineEmits(["currency-pair"]);

onMounted(() => {
  const pair = getUrl();
  if (pair) {
    selectedPairs.value = pair;
    emit("currency-pair", selectedPairs.value);
    initMarket(selectedPairs.value as keyof typeof Market);
  }
  const observer = new MutationObserver(() => {
    const pair = getUrl();
    if (pair && pair !== selectedPairs.value) {
      selectedPairs.value = pair;
      emit("currency-pair", selectedPairs.value);
      initMarket(selectedPairs.value as keyof typeof Market);
    }
  });
  observer.observe(document, { childList: true, subtree: true });
});

const changeCurrency = (event: Event) => {
  const value = (event.target as HTMLInputElement).value;
  setUrl(value);
};

const initMarket = async (market: keyof typeof Market) => {
  await store.dispatch("initMarket", {
    market: Market[market],
  });
};

const getUrl = () => {
  const url = location.pathname;
  const pair = url.split("/").slice(-1)[0].replace("-", "_");
  return pair;
};

const setUrl = (pair: string) => {
  const pairUrl = pair.replace("_", "-");
  const url = location.pathname;
  location.pathname = "/" + url.split("/")[1] + "/" + pairUrl;
};
</script>

<template>
  <div class="flex p-2">
    <select
      class="bg-modal-container py-1 px-2 mr-2 rounded"
      @change="changeCurrency"
      v-model="selectedPairs"
    >
      <option v-for="(key, value) in currencyPairs" :key="key" :value="value">
        {{ key }}
      </option>
    </select>
  </div>
</template>
