<script setup lang="ts">
import { useStore } from "@/store";
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
  Math.floor((bestAskPrice.value + bestBidPrice.value) / 2)
);

watch(closeAmount, (closeAmount) => {
  amount.value = closeAmount;
  usd.value = Math.round(amount.value * midPrice.value * 1000) / 1000;
  emit("amount", amount.value);
});

watch(buttonStatus, () => {
  amount.value = Math.round((amount.value + step.value) * 1000) / 1000;
  usd.value = Math.round(amount.value * midPrice.value * 1000) / 1000;
  emit("amount", amount.value);
});

const changeAmount = (event: Event) => {
  const value = Number((event.currentTarget as HTMLInputElement).value);
  usd.value = Math.round(value * midPrice.value * 1000) / 1000;
  emit("amount", amount.value);
};

const changeUsd = (event: Event) => {
  const value = Number((event.currentTarget as HTMLInputElement).value);
  amount.value = Math.round((value / midPrice.value) * 1000) / 1000;
  emit("amount", amount.value);
};
</script>

<template>
  <div class="pt-1 pb-2 flex items-center justify-center w-full">
    <div class="inline w-full px-1 rounded bg-modal-container relative mr-1">
      <input
        type="number"
        min="0"
        max="1000000"
        :step="step"
        class="w-2/3 p-2 bg-modal-container"
        v-model="amount"
        @input="changeAmount"
      />
      <span
        class="text-xs absolute bg-modal-selected rounded align-middle px-1 position-span"
        >{{ currencyPair.split("_")[0].replace("ONEINCH", "1INCH") }}</span
      >
    </div>
    <div class="inline w-full px-1 rounded bg-modal-container relative">
      <input
        type="number"
        min="0"
        max="1000000"
        :step="10"
        class="w-2/3 p-2 bg-modal-container"
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
