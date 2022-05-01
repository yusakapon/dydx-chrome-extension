<script setup lang="ts">
import { reactive, ref, watch, defineProps, computed } from "vue";
import { useStore } from "@/store";
import { Market, OrderSide, TimeInForce } from "@dydxprotocol/v3-client";
import AppAccordion from "./parts/AppAccordion.vue";
import AmountSelector from "./parts/AmountSelector.vue";
import AmountClose from "./parts/AmountClose.vue";
import OrderPrice from "./parts/OrderPrice.vue";

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

const price = ref<number>(0);
const setPrice = ref<number>(0);
const priceStep = ref<number>(1);
const isPriceShow = ref<boolean>(true);

const postOnly = ref<boolean>(false);

const bestAskPrice = computed(() => store.getters["orderbook/bestAskPrice"]);
const bestBidPrice = computed(() => store.getters["orderbook/bestBidPrice"]);
const midPrice = computed(() =>
  Math.floor((bestAskPrice.value + bestBidPrice.value) / 2)
);

watch(props, (props) => {
  if (props.currencyPair) {
    const pair = props.currencyPair.split("_");
    currencyPair.crypto = pair[0];
    currencyPair.currency = pair[1];
    amount.value = 0;
  }
});

watch(amount, () => {
  usd.value = Math.round(amount.value * midPrice.value * 1000) / 1000;
  buttonDisabled.sell = false;
  buttonDisabled.buy = false;
});

watch(usd, () => {
  amount.value = Math.round((usd.value / midPrice.value) * 1000) / 1000;
});

watch(midPrice, () => {
  if (price.value === 0) {
    setMidPrice();
  }
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
  const key = (currencyPair.crypto +
    "_" +
    currencyPair.currency) as keyof typeof Market;
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

const selectPrice = (price: number) => {
  if (price === 0) {
    isPriceShow.value = true;
  } else {
    isPriceShow.value = false;
    setPrice.value = price;
  }
};

const setMidPrice = () => {
  price.value = midPrice.value;
};

const countDownStep = () => {
  if (priceStep.value > 1) {
    priceStep.value /= 10;
  }
};

const countUpStep = () => {
  if (priceStep.value < 1000) {
    priceStep.value *= 10;
  }
};

const limitBuy = () => {
  const side = OrderSide.BUY;
  const priceSet = isPriceShow.value
    ? price.value
    : midPrice.value - setPrice.value;
  marketOrder(side, priceSet);
};

const limitSell = () => {
  const side = OrderSide.SELL;
  const priceSet = isPriceShow.value
    ? price.value
    : midPrice.value + setPrice.value;
  marketOrder(side, priceSet);
};

const marketOrder = async (orderSide: OrderSide, price: number) => {
  try {
    const key = (currencyPair.crypto +
      "_" +
      currencyPair.currency) as keyof typeof Market;
    const result = await store.dispatch("order/limitOrder", {
      market: Market[key],
      side: orderSide,
      size: amount.value,
      price: price,
      postOnly: postOnly.value,
      timeInForce: TimeInForce.GTT,
      expireSecond: 100,
    });
    console.log(result);
  } catch (error) {
    console.log(error);
  }
};
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
          <AmountClose
            class="ml-3.5"
            :currency-pair="currencyPair"
            @close="setClose"
          />
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
        <div>
          <span class="text-sm">Price</span>
        </div>
        <div class="inline-flex w-full text-sm my-1">
          <OrderPrice :currency-pair="currencyPair" @price="selectPrice" />
        </div>
        <div class="inline-flex w-full text-sm my-1" v-show="isPriceShow">
          <div class="py-1 flex items-center justify-center w-full">
            <button class="px-1 mr-1 font-bold text-lg" @click="setMidPrice">
              <fa icon="refresh"></fa>
            </button>
            <input
              type="number"
              min="0"
              max="1000000"
              :step="priceStep"
              class="w-1/2 px-2 py-2 bg-modal-container rounded"
              v-model="price"
            />
            <button
              class="active:opacity-50 py-2 pl-2 pr-1 ml-1 bg-modal-container rounded-l"
              @click="countDownStep"
            >
              <fa icon="minus"></fa>
            </button>
            <input
              type="number"
              min="0"
              max="10000"
              :step="1"
              readonly
              class="w-12 px-2 py-2 bg-modal-container text-center no-count border border-modal"
              v-model="priceStep"
            />
            <button
              class="active:opacity-50 py-2 pl-1 pr-2 bg-modal-container rounded-r"
              @click="countUpStep"
            >
              <fa icon="plus"></fa>
            </button>
          </div>
        </div>
        <div class="py-1 inline-flex items-center">
          <input
            type="checkbox"
            name="post-only"
            id="post-only"
            class="form-checkbox h-4 w-4"
            v-model="postOnly"
          />
          <label for="post-only" class="text-sm ml-1">Post Only</label>
        </div>
        <div class="pb-4 pt-2 flex justify-between">
          <button
            @click="limitSell"
            class="bg-modal-container hover:opacity-50 active:border-none font-semibold py-3 px-8 border border-sell text-sell rounded"
            :disabled="buttonDisabled.sell"
          >
            Limit Sell
          </button>
          <button
            @click="limitBuy"
            class="bg-modal-container hover:opacity-50 active:border-none font-semibold py-3 px-8 border border-buy text-buy rounded"
            :disabled="buttonDisabled.buy"
          >
            Limit Buy
          </button>
        </div>
      </template>
    </AppAccordion>
  </div>
</template>

<style scoped>
.no-count::-webkit-outer-spin-button,
.no-count::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
</style>
