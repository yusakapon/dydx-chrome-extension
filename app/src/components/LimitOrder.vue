<script setup lang="ts">
import {
  ref,
  watch,
  defineProps,
  computed,
  withDefaults,
  toRefs,
  defineEmits,
} from "vue";
import { useStore } from "@/store";
import { Market, OrderSide, TimeInForce } from "@dydxprotocol/v3-client";
import AppAccordion from "./parts/AppAccordion.vue";
import AmountSelector from "./parts/AmountSelector.vue";
import AmountClose from "./parts/AmountClose.vue";
import OrderPrice from "./parts/OrderPrice.vue";
import ExpireSecond from "./parts/ExpireSecond.vue";

const store = useStore();

// props
type Props = {
  currencyPair: string;
};
const props = withDefaults(defineProps<Props>(), {
  currencyPair: "",
});
const { currencyPair } = toRefs(props);

// emit
const emit = defineEmits(["error-message"]);

const orderType = "limit";
const amount = ref<number>(0);
const step = ref<number>(0.01);
const usd = ref<number>(0);
const positions = computed(() => store.getters["account/positions"]);
const price = ref<number>(0);
const setPrice = ref<number>(0);
const priceStep = ref<number>(1);
const isPriceShow = ref<boolean>(true);
const postOnly = ref<boolean>(false);
const expireSecond = ref<number>(2592000);
const bestAskPrice = computed(() => store.getters["orderbook/bestAskPrice"]);
const bestBidPrice = computed(() => store.getters["orderbook/bestBidPrice"]);
const midPrice = computed(() =>
  Math.floor((bestAskPrice.value + bestBidPrice.value) / 2)
);
const stepSize = computed(() =>
  store.getters["market/stepSize"](
    Market[currencyPair.value as keyof typeof Market]
  )
);

const roundByStepSize = (num: number) => {
  const roundNum = Math.round(1 / stepSize.value);
  return Math.round(num * roundNum) / roundNum;
};

watch(amount, () => {
  usd.value = roundByStepSize(amount.value * midPrice.value);
});

watch(usd, () => {
  amount.value = roundByStepSize(usd.value / midPrice.value);
});

watch(midPrice, () => {
  if (price.value === 0) {
    setMidPrice();
  }
});

const countUpAmount = (argStep: number) => {
  step.value = argStep;
  if (amount.value !== null) {
    amount.value = roundByStepSize(step.value + amount.value);
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

const setExpireSecond = (setExpireSecond: number) => {
  expireSecond.value = setExpireSecond;
};

const limitBuy = () => {
  const side = OrderSide.BUY;
  const priceSet = isPriceShow.value
    ? price.value
    : bestBidPrice.value - setPrice.value;
  marketOrder(side, priceSet);
};

const limitSell = () => {
  const side = OrderSide.SELL;
  const priceSet = isPriceShow.value
    ? price.value
    : bestAskPrice.value + setPrice.value;
  marketOrder(side, priceSet);
};

const marketOrder = async (orderSide: OrderSide, price: number) => {
  const key = currencyPair.value as keyof typeof Market;
  const ret = await store.dispatch("order/limitOrder", {
    market: Market[key],
    side: orderSide,
    size: amount.value,
    price: price,
    postOnly: postOnly.value,
    timeInForce: TimeInForce.GTT,
    expireSecond: expireSecond.value,
  });
  const { result, message } = ret;
  if (!result) {
    emit("error-message", message);
  } else {
    emit("error-message", "");
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
          <AmountClose @close="setClose" />
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
              class="w-12 py-2 bg-modal-container text-center no-count border border-modal"
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
        <ExpireSecond @expireSecond="setExpireSecond" />
        <div class="pb-4 pt-2 flex justify-between">
          <button
            @click="limitSell"
            class="bg-modal-container hover:opacity-50 active:border-none font-semibold py-3 px-8 border border-sell text-sell rounded"
          >
            Limit Sell
          </button>
          <button
            @click="limitBuy"
            class="bg-modal-container hover:opacity-50 active:border-none font-semibold py-3 px-8 border border-buy text-buy rounded"
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
