<script setup lang="ts">
import {
  ref,
  defineProps,
  computed,
  withDefaults,
  toRefs,
  defineEmits,
} from "vue";
import { useStore } from "@/store";
import { Market, OrderSide } from "@dydxprotocol/v3-client";
import AppAccordion from "./parts/AppAccordion.vue";
import AmountSelector from "./parts/AmountSelector.vue";
import AmountClose from "./parts/AmountClose.vue";
import AmountInput from "./parts/AmountInput.vue";

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

const orderType = "market";
const amount = ref<number>(0);
const closeAmount = ref<number>(0);
const step = ref<number>(0.01);
const positions = computed(() => store.getters["account/positions"]);
const buttonStatus = ref<boolean>(false);

const countUpAmount = (argStep: number) => {
  step.value = argStep;
  buttonStatus.value = !buttonStatus.value;
};

const setClose = () => {
  const key = currencyPair.value as keyof typeof Market;
  const position = positions.value[Market[key]];
  if (position) {
    const short = position.SHORT;
    const long = position.LONG;
    if (short) {
      const size = short.size;
      closeAmount.value = -size;
    } else if (long) {
      const size = long.size;
      closeAmount.value = size;
    }
  }
};

const setAmount = (setAmount: number) => {
  amount.value = setAmount;
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
          <AmountClose @close="setClose" />
        </div>
        <div>
          <AmountInput
            :currency-pair="currencyPair"
            :step="step"
            :button-status="buttonStatus"
            :close-amount="closeAmount"
            @amount="setAmount"
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
