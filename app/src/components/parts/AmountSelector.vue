<script setup lang="ts">
import {
  reactive,
  defineProps,
  watch,
  defineEmits,
  withDefaults,
  toRefs,
} from "vue";
import { useStore } from "@/store";
import { Market } from "@dydxprotocol/v3-client";

const store = useStore();
const stepButton = reactive({
  firstLevel: 0.01 as number,
  secondLevel: 0.1 as number,
  thirdLevel: 1 as number,
});

// props
type Props = {
  currencyPair: string;
  orderType: string;
};
const props = withDefaults(defineProps<Props>(), {
  currencyPair: "",
  orderType: "",
});
const { currencyPair, orderType } = toRefs(props);

watch(props, () => {
  getOrderAmount();
});

const emit = defineEmits(["step"]);

const getOrderAmount = () => {
  const market = "setting/marketOrderAmount";
  const limit = "setting/limitOrderAmount";
  const key = orderType.value === "market" ? market : limit;
  const marketKey = currencyPair.value as keyof typeof Market;
  const orderAmount = store.getters[key](Market[marketKey]);
  stepButton.firstLevel = orderAmount[0];
  stepButton.secondLevel = orderAmount[1];
  stepButton.thirdLevel = orderAmount[2];
};

const saveOrderAmount = () => {
  const amountArray = [
    stepButton.firstLevel,
    stepButton.secondLevel,
    stepButton.thirdLevel,
  ];
  const market = "setting/saveMarketOrderAmount";
  const limit = "setting/saveLimitOrderAmount";
  const key = orderType.value === "market" ? market : limit;
  const marketKey = currencyPair.value as keyof typeof Market;
  store.dispatch(key, {
    market: Market[marketKey],
    setValue: amountArray,
  });
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
