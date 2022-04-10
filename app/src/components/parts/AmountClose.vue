<script setup lang="ts">
import { defineProps, ref, watch, defineEmits } from "vue";
import { Market } from "@dydxprotocol/v3-client";

const market = ref<keyof typeof Market>();

const props = defineProps({
  currencyPair: Object,
});

watch(props, (props) => {
  if (props.currencyPair) {
    const pair = props.currencyPair;
    const marketStr = pair.crypto + "_" + pair.currency;
    market.value = marketStr as keyof typeof Market;
  }
});
const emit = defineEmits(["close"]);

const setClose = () => {
  emit("close", true);
};
</script>

<template>
  <button
    class="bg-modal-container w-12 py-2 rounded text-sm"
    @click="setClose()"
  >
    Close
  </button>
</template>
