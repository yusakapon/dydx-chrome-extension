<script setup lang="ts">
import {
  reactive,
  defineProps,
  watch,
  defineEmits,
  withDefaults,
  toRefs,
} from "vue";
import { useStore } from "@/store";
import { Market } from "@dydxprotocol/v3-client";

const store = useStore();
const stepButton = reactive({
  firstLevel: 1 as number,
  secondLevel: 10 as number,
  thirdLevel: 100 as number,
  fourthLevel: 1000 as number,
});

// props
type Props = {
  currencyPair: string;
};
const props = withDefaults(defineProps<Props>(), {
  currencyPair: "",
});
const { currencyPair } = toRefs(props);

watch(props, () => {
  getOrderPrice();
});

const emit = defineEmits(["price"]);

const getOrderPrice = () => {
  const key = "setting/limitOrderPrice";
  const marketKey = currencyPair.value as keyof typeof Market;
  const orderPrice = store.getters[key](Market[marketKey]);
  stepButton.firstLevel = orderPrice[0];
  stepButton.secondLevel = orderPrice[1];
  stepButton.thirdLevel = orderPrice[2];
  stepButton.fourthLevel = orderPrice[3];
};

const saveOrderPrice = () => {
  const priceArray = [
    stepButton.firstLevel,
    stepButton.secondLevel,
    stepButton.thirdLevel,
    stepButton.fourthLevel,
  ];
  const key = "setting/saveLimitOrderPrice";
  const marketKey = currencyPair.value as keyof typeof Market;
  store.dispatch(key, {
    market: Market[marketKey],
    setValue: priceArray,
  });
};

const countDownPrice = () => {
  const marketKey = currencyPair.value as keyof typeof Market;
  const tickSize = store.getters["market/tickSize"](Market[marketKey]);
  if (stepButton.firstLevel > tickSize) {
    stepButton.firstLevel = stepButton.firstLevel / 10;
    stepButton.secondLevel = stepButton.secondLevel / 10;
    stepButton.thirdLevel = stepButton.thirdLevel / 10;
    stepButton.fourthLevel = stepButton.fourthLevel / 10;
    saveOrderPrice();
  }
};

const countUpPrice = () => {
  if (stepButton.fourthLevel < 10000) {
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
    <button @click="countDownPrice()" class="active:opacity-50 py-2 pl-2 pr-1">
      <fa icon="angle-left"></fa>
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
    <button class="active:opacity-50 py-2 pl-1 pr-2" @click="countUpPrice()">
      <fa icon="angle-right"></fa>
    </button>
  </div>
</template>
