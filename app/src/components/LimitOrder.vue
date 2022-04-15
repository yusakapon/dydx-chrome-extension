<script setup lang="ts">
import { reactive, ref, watch, defineProps, computed } from "vue";
import { useStore } from "@/store";
import { Market, OrderSide } from "@dydxprotocol/v3-client";
import AppAccordion from "./parts/AppAccordion.vue";
import AmountSelector from "./parts/AmountSelector.vue";
import AmountLeverage from "./parts/AmountLeverage.vue";
import AmountClose from "./parts/AmountClose.vue";

const orderType = "limit";
const store = useStore();

const props = defineProps({
  currencyPair: String,
});

const amount = ref<number>(0);
const step = ref<number>(0.01);
const usd = ref<number>(0);
const currencyPair = reactive({ crypto: "", currency: "" });
const positions = computed(() => store.getters["account/positions"]);
const buttonDisabled = reactive({
  sell: false as boolean,
  buy: false as boolean,
});

const isPriceShow = ref<boolean>(false);

watch(props, (props) => {
  if (props.currencyPair) {
    const pair = props.currencyPair.split("_");
    currencyPair.crypto = pair[0];
    currencyPair.currency = pair[1];
    amount.value = 0;
  }
});

watch(amount, () => {
  const midPrice = getMidPrice();
  usd.value = Math.round(amount.value * midPrice * 1000) / 1000;
  buttonDisabled.sell = false;
  buttonDisabled.buy = false;
});

watch(usd, () => {
  const midPrice = getMidPrice();
  amount.value = Math.round((usd.value / midPrice) * 1000) / 1000;
});

const getMidPrice = () => {
  const bestAskPrice = store.getters["orderbook/bestAskPrice"];
  const bestBidPrice = store.getters["orderbook/bestBidPrice"];
  const midPrice = (bestAskPrice + bestBidPrice) / 2;
  return midPrice;
};

const countUpAmount = (argStep: number) => {
  step.value = argStep;
  if (amount.value !== null) {
    amount.value = Math.round(step.value * 1000 + amount.value * 1000) / 1000;
  } else {
    amount.value = step.value;
  }
};

const setLeverage = (leverage: number) => {
  console.log(leverage);
};

const setClose = () => {
  const key = (currencyPair.crypto +
    "_" +
    currencyPair.currency) as keyof typeof Market;
  const position = positions.value[Market[key]];
  const short = position.SHORT;
  const long = position.LONG;
  if (short) {
    const size = short.size;
    amount.value = -size;
    // buttonDisabled.sell = true;
  } else if (long) {
    const size = long.size;
    amount.value = size;
    // buttonDisabled.buy = true;
  }
};

const limitBuy = () => {
  const side = OrderSide.BUY;
  marketOrder(side);
};

const limitSell = () => {
  const side = OrderSide.SELL;
  marketOrder(side);
};

const marketOrder = async (orderSide: OrderSide) => {
  try {
    const key = (currencyPair.crypto +
      "_" +
      currencyPair.currency) as keyof typeof Market;
    const result = await store.dispatch("order/limitOrder", {
      market: Market[key],
      side: orderSide,
      size: amount.value,
    });
    console.log(result);
  } catch (error) {
    console.log(error);
  }
};

// const togglePrice = () => {
//   isPriceShow.value = !isPriceShow.value;
// };
</script>

<template>
  <div>
    <AppAccordion class="flex flex-col justify-center items-center px-2">
      <template v-slot:title>
        <span>LimitOrder</span>
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
          <AmountLeverage
            :currency-pair="currencyPair"
            :order-type="orderType"
            @leverage="setLeverage"
          />
          <AmountClose :currency-pair="currencyPair" @close="setClose" />
        </div>
        <div class="pt-1 pb-2 flex items-center justify-center w-full">
          <span class="px-1 text-sm">{{ currencyPair.crypto }}</span>
          <input
            type="number"
            min="0"
            max="1000000"
            :step="step"
            class="w-1/2 px-2 py-2 bg-modal-container rounded"
            v-model="amount"
          />
          <span class="px-1 text-sm">{{ currencyPair.currency }}</span>
          <input
            type="number"
            min="0"
            max="1000000"
            :step="10"
            class="w-1/2 px-2 py-2 bg-modal-container rounded"
            v-model="usd"
          />
        </div>
        <div class="inline-flex w-full text-sm my-1">
          <label>
            <input
              type="checkbox"
              name="toggle"
              id="toggle"
              class="hidden peer"
              v-model="isPriceShow"
            />
            <div
              class="w-12 py-2 text-center cursor-pointer bg-modal-container rounded border border-modal-container peer-checked:bg-transparent peer-checked:border-modal-container"
            >
              Self
            </div>
          </label>
        </div>
        <div class="pb-4 pt-2 flex justify-between">
          <button
            @click="limitSell"
            class="bg-modal-container font-semibold py-3 px-8 border border-sell text-sell rounded"
            :disabled="buttonDisabled.sell"
          >
            Limit Sell
          </button>
          <button
            @click="limitBuy"
            class="bg-modal-container font-semibold py-3 px-8 border border-buy text-buy rounded"
            :disabled="buttonDisabled.buy"
          >
            Limit Buy
          </button>
        </div>
      </template>
    </AppAccordion>
  </div>
</template>
