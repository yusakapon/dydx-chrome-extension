<script setup lang="ts">
import { reactive, defineProps, ref, watch, defineEmits } from "vue";
import { useStore } from "@/store";
import { Market } from "@dydxprotocol/v3-client";
import { stringify } from "querystring";

const store = useStore();
const market = ref<keyof typeof Market>();
const stepButton = reactive({
  firstLevel: 0.01 as number,
  secondLevel: 0.1 as number,
  thirdLevel: 1 as number,
});

const props = defineProps({
  currencyPair: Object,
  orderType: stringify,
});

watch(props, (props) => {
  if (props.currencyPair) {
    const pair = props.currencyPair;
    const marketStr = pair.crypto + "_" + pair.currency;
    market.value = marketStr as keyof typeof Market;
    getOrderAmount();
  }
});
const emit = defineEmits(["step"]);

const getOrderAmount = () => {
  if (market.value) {
    const marketOrderAmount = "setting/marketOrderAmount";
    const limitOrderAmount = "setting/limitOrderAmount";
    const key =
      props.orderType == "market" ? marketOrderAmount : limitOrderAmount;
    const orderAmount = store.getters[key](Market[market.value]);
    stepButton.firstLevel = orderAmount[0];
    stepButton.secondLevel = orderAmount[1];
    stepButton.thirdLevel = orderAmount[2];
  }
};
const saveOrderAmount = () => {
  const amountArray = [
    stepButton.firstLevel,
    stepButton.secondLevel,
    stepButton.thirdLevel,
  ];
  if (market.value) {
    const marketOrderAmount = "setting/saveMarketOrderAmount";
    const limitOrderAmount = "setting/saveLimitOrderAmount";
    const key =
      props.orderType == "market" ? marketOrderAmount : limitOrderAmount;
    store.dispatch(key, {
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
    saveOrderAmount();
  }
};

const countUpAmount = () => {
  if (stepButton.thirdLevel <= 100) {
    stepButton.firstLevel = stepButton.firstLevel * 10;
    stepButton.secondLevel = stepButton.secondLevel * 10;
    stepButton.thirdLevel = stepButton.thirdLevel * 10;
    saveOrderAmount();
  }
};

const countArgAmount = (argStep: number) => {
  emit("step", argStep);
};
</script>

<template>
  <button class="active:opacity-50 py-2 pl-2 pr-1" @click="countDownAmount()">
    <fa icon="angle-left"></fa>
  </button>
  <button
    class="bg-modal-container w-12 py-2 rounded-l text-sm active:opacity-50"
    @click="countArgAmount(stepButton.firstLevel)"
  >
    +{{ stepButton.firstLevel }}
  </button>
  <button
    class="bg-modal-container w-12 py-2 border-r border-l border-modal text-sm active:opacity-50"
    @click="countArgAmount(stepButton.secondLevel)"
  >
    +{{ stepButton.secondLevel }}
  </button>
  <button
    class="bg-modal-container w-12 py-2 rounded-r text-sm active:opacity-50"
    @click="countArgAmount(stepButton.thirdLevel)"
  >
    +{{ stepButton.thirdLevel }}
  </button>
  <button
    class="mr-1 active:opacity-50 py-2 pl-1 pr-2"
    @click="countUpAmount()"
  >
    <fa icon="angle-right"></fa>
  </button>
</template>
