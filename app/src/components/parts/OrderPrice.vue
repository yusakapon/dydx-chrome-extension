<script setup lang="ts">
import { reactive, defineProps, ref, watch, defineEmits } from "vue";
import { useStore } from "@/store";
import { Market } from "@dydxprotocol/v3-client";

const store = useStore();
const market = ref<keyof typeof Market>();
const stepButton = reactive({
  firstLevel: 1 as number,
  secondLevel: 10 as number,
  thirdLevel: 100 as number,
  fourthLevel: 1000 as number,
});

const props = defineProps({
  currencyPair: Object,
});

watch(props, (props) => {
  if (props.currencyPair) {
    const pair = props.currencyPair;
    const marketStr = pair.crypto + "_" + pair.currency;
    market.value = marketStr as keyof typeof Market;
    getOrderPrice();
  }
});
const emit = defineEmits(["price"]);

const getOrderPrice = () => {
  if (market.value) {
    const key = "setting/limitOrderPrice";
    const orderPrice = store.getters[key](Market[market.value]);
    stepButton.firstLevel = orderPrice[0];
    stepButton.secondLevel = orderPrice[1];
    stepButton.thirdLevel = orderPrice[2];
    stepButton.fourthLevel = orderPrice[3];
  }
};
const saveOrderPrice = () => {
  const priceArray = [
    stepButton.firstLevel,
    stepButton.secondLevel,
    stepButton.thirdLevel,
    stepButton.fourthLevel,
  ];
  if (market.value) {
    const key = "setting/limitOrderPrice";
    store.dispatch(key, {
      market: Market[market.value],
      setValue: priceArray,
    });
  }
};

const countDownPrice = () => {
  if (stepButton.firstLevel >= 0.01) {
    stepButton.firstLevel = stepButton.firstLevel / 10;
    stepButton.secondLevel = stepButton.secondLevel / 10;
    stepButton.thirdLevel = stepButton.thirdLevel / 10;
    stepButton.fourthLevel = stepButton.fourthLevel / 10;
    saveOrderPrice();
  }
};

const countUpPrice = () => {
  if (stepButton.thirdLevel <= 100) {
    stepButton.firstLevel = stepButton.firstLevel * 10;
    stepButton.secondLevel = stepButton.secondLevel * 10;
    stepButton.thirdLevel = stepButton.thirdLevel * 10;
    stepButton.fourthLevel = stepButton.fourthLevel * 10;
    saveOrderPrice();
  }
};

const setArgPrice = (argPrice: number) => {
  emit("price", argPrice);
};
</script>

<template>
  <div class="inline-flex w-full text-sm">
    <label>
      <input
        type="radio"
        name="toggle"
        id="toggle"
        class="hidden peer"
        v-on:change="setArgPrice(0)"
        checked
      />
      <div
        class="w-12 py-2 mr-2 text-center cursor-pointer bg-modal-container rounded border border-modal-container peer-checked:bg-modal-selected"
      >
        Self
      </div>
    </label>
    <button @click="countDownPrice()" class="ml-2">
      <fa icon="caret-left"></fa>
    </button>
    <label>
      <input
        type="radio"
        name="toggle"
        id="toggle"
        class="hidden peer"
        v-on:change="setArgPrice(stepButton.firstLevel)"
      />
      <div
        class="w-12 py-2 text-center cursor-pointer bg-modal-container rounded-l border border-modal-container peer-checked:bg-modal-selected"
      >
        ±{{ stepButton.firstLevel }}
      </div>
    </label>
    <label>
      <input
        type="radio"
        name="toggle"
        id="toggle"
        class="hidden peer"
        v-on:change="setArgPrice(stepButton.secondLevel)"
      />
      <div
        class="w-12 py-2 text-center cursor-pointer bg-modal-container border border-modal-container peer-checked:bg-modal-selected"
      >
        ±{{ stepButton.secondLevel }}
      </div>
    </label>
    <label>
      <input
        type="radio"
        name="toggle"
        id="toggle"
        class="hidden peer"
        v-on:change="setArgPrice(stepButton.thirdLevel)"
      />
      <div
        class="w-12 py-2 text-center cursor-pointer bg-modal-container border border-modal-container peer-checked:bg-modal-selected"
      >
        ±{{ stepButton.thirdLevel }}
      </div>
    </label>
    <label>
      <input
        type="radio"
        name="toggle"
        id="toggle"
        class="hidden peer"
        v-on:change="setArgPrice(stepButton.fourthLevel)"
      />
      <div
        class="w-12 py-2 text-center cursor-pointer bg-modal-container rounded-r border border-modal-container peer-checked:bg-modal-selected"
      >
        ±{{ stepButton.fourthLevel }}
      </div>
    </label>
    <button @click="countUpPrice()">
      <fa icon="caret-right"></fa>
    </button>
  </div>
</template>
