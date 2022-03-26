<script setup lang="ts">
import { ref } from "vue";
import AppAccordion from "./parts/AppAccordion.vue";

const amount = ref<number>(0);
const amountStep = ref<number>(0.01);
const price = ref<number>(0);
const priceStep = ref<number>(1);

const countDownAmount = () => {
  if (amount.value !== null) {
    amount.value =
      amount.value - amountStep.value < 0
        ? 0
        : Math.round(amount.value * 100 - amountStep.value * 100) / 100;
  } else {
    amount.value = amountStep.value;
  }
};

const countUpAmount = () => {
  if (amount.value !== null) {
    amount.value =
      Math.round(amountStep.value * 100 + amount.value * 100) / 100;
  } else {
    amount.value = amountStep.value;
  }
};

const countUpPrice = () => {
  if (price.value !== null) {
    price.value = Math.round(priceStep.value * 100 + price.value * 100) / 100;
  } else {
    price.value = priceStep.value;
  }
};
const countDownPrice = () => {
  if (price.value !== null) {
    price.value =
      price.value - priceStep.value < 0
        ? 0
        : Math.round(price.value * 100 - priceStep.value * 100) / 100;
  } else {
    price.value = priceStep.value;
  }
};

const countArgAmount = (argStep: number) => {
  amountStep.value = argStep;
  if (amount.value !== null) {
    amount.value =
      Math.round(amountStep.value * 100 + amount.value * 100) / 100;
  } else {
    amount.value = amountStep.value;
  }
};

const countArgPrice = (argStep: number) => {
  priceStep.value = argStep;
  if (price.value !== null) {
    price.value = Math.round(priceStep.value * 100 + price.value * 100) / 100;
  } else {
    price.value = priceStep.value;
  }
};

const setLeverageAmount = (leverage: number) => {
  console.log(leverage);
  // amount.value = 0;
};

const clearAmount = () => {
  amount.value = 0;
};
const clearPrice = () => {
  price.value = 0;
};

const limitBuy = () => {
  console.log("limit buy:" + amount.value);
  alert("limit buy:" + amount.value);
};
const limitSell = () => {
  console.log("limit sell:" + amount.value);
  alert("limit sell:" + amount.value);
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
        <div class="pt-1 pb-2 flex items-center">
          <input
            type="number"
            min="0"
            max="1000000"
            :step="amountStep"
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
        <div class="mt-2">
          <span class="text-sm">Price</span>
        </div>
        <div class="pt-1 pb-2 flex items-center">
          <input
            type="number"
            min="0"
            max="1000000"
            :step="priceStep"
            class="w-64p px-2 py-2 bg-modal-container rounded"
            v-model="price"
          />
          <span class="absolute mr-28 right-0">
            <button
              class="bg-gray-700 mr-1 px-2 py-1 rounded"
              @click="countDownPrice"
            >
              <fa icon="minus"></fa>
            </button>
            <button class="bg-gray-700 px-2 py-1 rounded" @click="countUpPrice">
              <fa icon="plus"></fa>
            </button>
          </span>
          <button
            class="bg-modal-container w-3/12 ml-2 rounded"
            @click="clearPrice"
          >
            <fa icon="rotate"></fa>
          </button>
        </div>
        <div class="inline-flex w-full flex">
          <button
            class="bg-modal-container w-1/5 py-2 rounded-l"
            @click="countArgPrice(0)"
          >
            Self
          </button>
          <button
            class="bg-modal-container w-1/5 py-2 border-r border-l border-modal"
            @click="countArgPrice(1)"
          >
            ±1
          </button>
          <button
            class="bg-modal-container w-1/5 py-2"
            @click="countArgPrice(10)"
          >
            ±10
          </button>
          <button
            class="bg-modal-container w-1/5 py-2 border-r border-l border-modal"
            @click="countArgPrice(100)"
          >
            ±100
          </button>
          <button
            class="bg-modal-container w-1/5 py-2 rounded-r"
            @click="countArgPrice(1000)"
          >
            ±1000
          </button>
        </div>
        <div class="mt-2 py-2 inline-flex items-center">
          <input
            type="checkbox"
            name="post-only"
            id="post-only"
            class="form-checkbox h-4 w-4"
          />
          <label for="post-only" class="text-sm ml-1">Post Only</label>
        </div>
        <div class="pt-2 pb-4 flex justify-between">
          <button
            @click="limitSell"
            class="bg-modal-container font-semibold py-3 px-8 border border-sell text-sell rounded"
          >
            Limit Sell
          </button>
          <button
            @click="limitBuy"
            class="bg-modal-container font-semibold py-3 px-8 border border-buy text-buy rounded"
          >
            Limit Buy
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
