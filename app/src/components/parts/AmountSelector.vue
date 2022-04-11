<script setup lang="ts">
import { reactive, defineProps, ref, watch, defineEmits } from "vue";
import { useStore } from "@/store";
import { Market } from "@dydxprotocol/v3-client";

const store = useStore();
const market = ref<keyof typeof Market>();
const stepButton = reactive({
  firstLevel: 0.01 as number,
  secondLevel: 0.1 as number,
  thirdLevel: 1 as number,
});

const props = defineProps({
  currencyPair: Object,
});

watch(props, (props) => {
  if (props.currencyPair) {
    const pair = props.currencyPair;
    const marketStr = pair.crypto + "_" + pair.currency;
    market.value = marketStr as keyof typeof Market;
    getMarketOrderAmount();
  }
});
const emit = defineEmits(["step"]);

const getMarketOrderAmount = () => {
  if (market.value) {
    const marketOrderAmount = store.getters["setting/marketOrderAmount"](
      Market[market.value]
    );
    stepButton.firstLevel = marketOrderAmount[0];
    stepButton.secondLevel = marketOrderAmount[1];
    stepButton.thirdLevel = marketOrderAmount[2];
  }
};
const saveMarketOrderAmount = () => {
  const amountArray = [
    stepButton.firstLevel,
    stepButton.secondLevel,
    stepButton.thirdLevel,
  ];
  if (market.value) {
    store.dispatch("setting/saveMarketOrderAmount", {
      market: Market[market.value],
      setValue: amountArray,
    });
  }
};

const countDownAmount = () => {
  if (stepButton.firstLevel >= 0.01) {
    stepButton.firstLevel = stepButton.firstLevel / 10;
    stepButton.secondLevel = stepButton.secondLevel / 10;
    stepButton.thirdLevel = stepButton.thirdLevel / 10;
    saveMarketOrderAmount();
  }
};

const countUpAmount = () => {
  if (stepButton.thirdLevel <= 100) {
    stepButton.firstLevel = stepButton.firstLevel * 10;
    stepButton.secondLevel = stepButton.secondLevel * 10;
    stepButton.thirdLevel = stepButton.thirdLevel * 10;
    saveMarketOrderAmount();
  }
};

const countArgAmount = (argStep: number) => {
  emit("step", argStep);
};
</script>

<template>
  <button @click="countDownAmount()">
    <fa icon="caret-left"></fa>
  </button>
  <button
    class="bg-modal-container w-12 py-2 rounded-l text-sm"
    @click="countArgAmount(stepButton.firstLevel)"
  >
    +{{ stepButton.firstLevel }}
  </button>
  <button
    class="bg-modal-container w-12 py-2 border-r border-l border-modal text-sm"
    @click="countArgAmount(stepButton.secondLevel)"
  >
    +{{ stepButton.secondLevel }}
  </button>
  <button
    class="bg-modal-container w-12 py-2 rounded-r text-sm"
    @click="countArgAmount(stepButton.thirdLevel)"
  >
    +{{ stepButton.thirdLevel }}
  </button>
  <button class="mr-1" @click="countUpAmount()">
    <fa icon="caret-right"></fa>
  </button>
</template>
