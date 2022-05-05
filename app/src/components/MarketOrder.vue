<script setup lang="ts">
import { ref, watch, defineProps, computed, withDefaults, toRefs } from "vue";
import { useStore } from "@/store";
import { Market, OrderSide } from "@dydxprotocol/v3-client";
import AppAccordion from "./parts/AppAccordion.vue";
import AmountSelector from "./parts/AmountSelector.vue";
import AmountClose from "./parts/AmountClose.vue";

const store = useStore();

// props
type Props = {
  currencyPair: string;
};
const props = withDefaults(defineProps<Props>(), {
  currencyPair: "",
});
const { currencyPair } = toRefs(props);

const orderType = "market";
const amount = ref<number>(0);
const step = ref<number>(0.01);
const usd = ref<number>(0);
const positions = computed(() => store.getters["account/positions"]);
const bestAskPrice = computed(() => store.getters["orderbook/bestAskPrice"]);
const bestBidPrice = computed(() => store.getters["orderbook/bestBidPrice"]);
const midPrice = computed(() =>
  Math.floor((bestAskPrice.value + bestBidPrice.value) / 2)
);

watch(amount, () => {
  usd.value = Math.round(amount.value * midPrice.value * 1000) / 1000;
});

watch(usd, () => {
  amount.value = Math.round((usd.value / midPrice.value) * 1000) / 1000;
});

const countUpAmount = (argStep: number) => {
  step.value = argStep;
  if (amount.value !== null) {
    amount.value = Math.round(step.value * 1000 + amount.value * 1000) / 1000;
  } else {
    amount.value = step.value;
  }
};

const setClose = () => {
  const key = currencyPair.value as keyof typeof Market;
  const position = positions.value[Market[key]];
  const short = position.SHORT;
  const long = position.LONG;
  if (short) {
    const size = short.size;
    amount.value = -size;
  } else if (long) {
    const size = long.size;
    amount.value = size;
  }
};

const marketBuy = () => {
  const side = OrderSide.BUY;
  marketOrder(side);
};

const marketSell = () => {
  const side = OrderSide.SELL;
  marketOrder(side);
};

const marketOrder = async (orderSide: OrderSide) => {
  const key = currencyPair.value as keyof typeof Market;
  const ret = await store.dispatch("order/marketOrder", {
    market: Market[key],
    side: orderSide,
    size: amount.value,
  });
  const { result, message } = ret;
  if (!result) {
    alert(message);
  }
};
</script>

<template>
  <div>
    <AppAccordion class="flex flex-col justify-center items-center px-2">
      <template v-slot:title>
        <span>MarketOrder</span>
      </template>
      <template v-slot:content>
        <div>
          <span class="text-sm">Amount</span>
        </div>
        <div class="inline-flex w-full flex my-1">
          <AmountSelector
            :currency-pair="currencyPair"
            :order-type="orderType"
            @step="countUpAmount"
          />
          <AmountClose class="ml-3.5" @close="setClose" />
        </div>
        <div class="pt-1 pb-2 flex items-center justify-center w-full">
          <span class="px-1 text-sm">{{ currencyPair.split("_")[0] }}</span>
          <input
            type="number"
            min="0"
            max="1000000"
            :step="step"
            class="w-1/2 px-2 py-2 bg-modal-container rounded"
            v-model="amount"
          />
          <span class="px-1 text-sm">{{ currencyPair.split("_")[1] }}</span>
          <input
            type="number"
            min="0"
            max="1000000"
            :step="10"
            class="w-1/2 px-2 py-2 bg-modal-container rounded"
            v-model="usd"
          />
        </div>
        <div class="pb-4 pt-2 flex justify-between">
          <button
            @click="marketSell"
            class="bg-modal-container hover:opacity-50 active:border-none font-semibold py-3 px-6 border border-sell text-sell rounded"
          >
            Market Sell
          </button>
          <button
            @click="marketBuy"
            class="bg-modal-container hover:opacity-50 active:border-none font-semibold py-3 px-6 border border-buy text-buy rounded"
          >
            Market Buy
          </button>
        </div>
      </template>
    </AppAccordion>
  </div>
</template>

<style scoped></style>
