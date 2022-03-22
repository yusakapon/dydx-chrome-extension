<script setup lang="ts">
import { ref } from "vue";
import AppAccordion from "./parts/AppAccordion.vue";

const amount = ref<number>(0);
const step = ref<number>(0.01);
const countDownAmount = () => {
  if (amount.value !== null) {
    amount.value =
      amount.value - step.value < 0
        ? 0
        : Math.round(amount.value * 100 - step.value * 100) / 100;
  } else {
    amount.value = step.value;
  }
};
const countUpAmount = () => {
  if (amount.value !== null) {
    amount.value = Math.round(step.value * 100 + amount.value * 100) / 100;
  } else {
    amount.value = step.value;
  }
};
const countArgAmount = (argStep: number) => {
  step.value = argStep;
  if (amount.value !== null) {
    amount.value = Math.round(step.value * 100 + amount.value * 100) / 100;
  } else {
    amount.value = step.value;
  }
};
const setLeverageAmount = (leverage: number) => {
  console.log(leverage);
  // amount.value = 0;
};
const clearAmount = () => {
  amount.value = 0;
};
const marketBuy = () => {
  console.log("market buy:" + amount.value);
  alert("market buy:" + amount.value);
};
const marketSell = () => {
  console.log("market sell:" + amount.value);
  alert("market sell:" + amount.value);
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
        <div class="pt-1 pb-2 flex items-center">
          <input
            type="number"
            min="0"
            max="1000000"
            :step="step"
            class="w-64p px-2 py-2 bg-modal-container rounded"
            v-model="amount"
          />
          <span class="absolute mr-28 right-0">
            <button
              class="bg-gray-700 mr-1 px-2 py-1 rounded"
              @click="countDownAmount"
            >
              <fa icon="minus"></fa>
            </button>
            <button
              class="bg-gray-700 px-2 py-1 rounded"
              @click="countUpAmount"
            >
              <fa icon="plus"></fa>
            </button>
          </span>
          <button
            class="bg-modal-container w-3/12 ml-2 py-2 rounded"
            @click="clearAmount"
          >
            Clear
          </button>
        </div>
        <div class="inline-flex w-full flex">
          <button
            class="bg-modal-container w-1/6 py-2 rounded-l"
            @click="countArgAmount(0.01)"
          >
            +0.01
          </button>
          <button
            class="bg-modal-container w-1/6 py-2 border-r border-l border-modal"
            @click="countArgAmount(0.1)"
          >
            +0.1
          </button>
          <button
            class="bg-modal-container w-1/6 py-2 rounded-r"
            @click="countArgAmount(1)"
          >
            +1
          </button>
          <button
            class="bg-modal-container w-1/6 ml-4 py-2 rounded-l border-r border-modal"
            @click="setLeverageAmount(1)"
          >
            1×
          </button>
          <button
            class="bg-modal-container w-1/6 py-2 rounded-r"
            @click="setLeverageAmount(2)"
          >
            2×
          </button>
        </div>
        <div class="py-4 flex justify-between">
          <button
            @click="marketSell"
            class="bg-modal-container font-semibold py-3 px-6 border border-sell text-sell rounded"
          >
            Market Sell
          </button>
          <button
            @click="marketBuy"
            class="bg-modal-container font-semibold py-3 px-6 border border-buy text-buy rounded"
          >
            Market Buy
          </button>
        </div>
      </template>
    </AppAccordion>
  </div>
</template>

<style scoped>
/* hide default button */
input[type="number"]::-webkit-outer-spin-button,
input[type="number"]::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
.w-64p {
  width: 64%;
}
</style>
