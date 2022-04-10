<script setup lang="ts">
import { reactive, defineProps, ref, watch, defineEmits } from "vue";
import { useStore } from "@/store";
import { Market } from "@dydxprotocol/v3-client";

const store = useStore();
const market = ref<keyof typeof Market>();
const leverageButton = reactive({
  firstLevel: 1 as number,
  secondLevel: 2 as number,
});
const leverageArray = [1, 2, 3, 5, 10];

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
const emit = defineEmits(["leverage"]);

const getMarketOrderAmount = () => {
  if (market.value) {
    const marketOrderLevarage = store.getters["setting/marketOrderLeverage"](
      Market[market.value]
    );
    leverageButton.firstLevel = marketOrderLevarage[0];
    leverageButton.secondLevel = marketOrderLevarage[1];
  }
};
const saveMarketOrderAmount = () => {
  const amountLevarage = [
    leverageButton.firstLevel,
    leverageButton.secondLevel,
  ];
  if (market.value) {
    store.dispatch("setting/saveMarketOrderLeverage", {
      market: Market[market.value],
      setValue: amountLevarage,
    });
  }
};

const countDownLeverage = () => {
  if (leverageButton.firstLevel > 1) {
    const number = leverageArray.indexOf(leverageButton.firstLevel);
    leverageButton.firstLevel = leverageArray[number - 1];
    leverageButton.secondLevel = leverageArray[number];
    saveMarketOrderAmount();
  }
};

const countUpLeverage = () => {
  if (leverageButton.secondLevel < 10) {
    const number = leverageArray.indexOf(leverageButton.secondLevel);
    leverageButton.firstLevel = leverageArray[number];
    leverageButton.secondLevel = leverageArray[number + 1];
    saveMarketOrderAmount();
  }
};

const countArgLeverage = (argLeverage: number) => {
  emit("leverage", argLeverage);
};
</script>

<template>
  <button @click="countDownLeverage()">
    <fa icon="caret-left"></fa>
  </button>
  <button
    class="bg-modal-container w-12 ml-1 py-2 rounded-l text-sm"
    @click="countArgLeverage(leverageButton.firstLevel)"
  >
    {{ leverageButton.firstLevel }}×
  </button>
  <button
    class="bg-modal-container w-12 py-2 border-l border-modal rounded-r text-sm"
    @click="countArgLeverage(leverageButton.secondLevel)"
  >
    {{ leverageButton.secondLevel }}×
  </button>
  <button class="mr-1" @click="countUpLeverage()">
    <fa icon="caret-right"></fa>
  </button>
</template>
