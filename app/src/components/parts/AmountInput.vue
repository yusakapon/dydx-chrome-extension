<script setup lang="ts">
import { useStore } from "@/store";
import { Market } from "@dydxprotocol/v3-client";
import {
  defineProps,
  toRefs,
  withDefaults,
  ref,
  computed,
  watch,
  defineEmits,
} from "vue";

const store = useStore();

// props
type Props = {
  currencyPair: string;
  step: number;
  buttonStatus: boolean;
  closeAmount: number;
};
const props = withDefaults(defineProps<Props>(), {
  currencyPair: "",
  step: 0.01,
  buttonStatus: true,
  closeAmount: 0,
});
const { currencyPair, step, buttonStatus, closeAmount } = toRefs(props);

// emit
const emit = defineEmits(["amount"]);

const amount = ref<number>(0);
const usd = ref<number>(0);

const bestAskPrice = computed(() => store.getters["orderbook/bestAskPrice"]);
const bestBidPrice = computed(() => store.getters["orderbook/bestBidPrice"]);
const midPrice = computed(() =>
  roundByTickSize((bestAskPrice.value + bestBidPrice.value) / 2)
);

const stepSize = computed(() =>
  store.getters["market/stepSize"](
    Market[currencyPair.value as keyof typeof Market]
  )
);
const tickSize = computed(() =>
  store.getters["market/tickSize"](
    Market[currencyPair.value as keyof typeof Market]
  )
);
const roundByStepSize = (num: number) => {
  const roundNumCalc = Math.round(1 / stepSize.value);
  const roundNum = roundNumCalc >= 1 ? roundNumCalc : 1;
  return Math.round(num * roundNum) / roundNum;
};
const roundByTickSize = (num: number) => {
  const roundNumCalc = Math.round(1 / tickSize.value);
  const roundNum = roundNumCalc >= 1 ? roundNumCalc : 1;
  return Math.round(num * roundNum) / roundNum;
};

watch(closeAmount, (closeAmount) => {
  amount.value = closeAmount;
  usd.value = roundByStepSize(Number(amount.value) * Number(midPrice.value));
  emit("amount", amount.value);
});

watch(buttonStatus, () => {
  amount.value = roundByStepSize(Number(amount.value) + Number(step.value));
  usd.value = roundByStepSize(Number(amount.value) * Number(midPrice.value));
  emit("amount", amount.value);
});

watch(currencyPair, () => {
  amount.value = 0;
  usd.value = 0;
});

const changeAmount = (event: Event) => {
  const value = Number((event.currentTarget as HTMLInputElement).value);
  usd.value = roundByStepSize(value * Number(midPrice.value));
  emit("amount", amount.value);
};

const changeUsd = (event: Event) => {
  const value = Number((event.currentTarget as HTMLInputElement).value);
  amount.value = roundByStepSize(value / Number(midPrice.value));
  emit("amount", amount.value);
};
</script>

<template>
  <div class="pt-1 pb-2 flex items-center justify-center w-full">
    <div class="inline w-full px-1 rounded bg-modal-container relative">
      <input
        type="number"
        min="0"
        :step="step"
        class="py-2 bg-modal-container text-sm w-2/3"
        v-model="amount"
        @input="changeAmount"
      />
      <span
        class="text-xs absolute bg-modal-selected rounded align-middle px-1 position-span"
        >{{ currencyPair.split("_")[0].replace("ONEINCH", "1INCH") }}</span
      >
    </div>
    <span class="px-1 text-xl">≒</span>
    <div class="inline w-full px-1 rounded bg-modal-container relative">
      <input
        type="number"
        min="0"
        :step="10"
        class="py-2 bg-modal-container text-sm w-2/3"
        v-model="usd"
        @input="changeUsd"
      />
      <span
        class="text-xs absolute bg-modal-selected rounded align-middle px-1 position-span"
        >{{ currencyPair.split("_")[1] }}</span
      >
    </div>
  </div>
</template>

<style scoped>
.position-span {
  top: 50%;
  left: 82%;
  transform: translate(-50%, -50%);
  -webkit-transform: translate(-50%, -50%);
  -ms-transform: translate(-50%, -50%);
}
</style>
