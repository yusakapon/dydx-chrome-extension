<script setup lang="ts">
import { ref, reactive, onMounted, onBeforeMount } from "vue";
import LimitOrder from "./components/LimitOrder.vue";
import MarketOrder from "./components/MarketOrder.vue";
import TradeHeader from "./components/TradeHeader.vue";
import TradeInfo from "./components/TradeInfo.vue";
import ConnectWallet from "./components/ConnetWallet.vue";

const isConnected = ref<boolean>(false);
const currencyPairSelected = ref<string>();
const isMoveDragging = ref<boolean>(false);
const pos = reactive({
  x: 0 as number,
  y: 0 as number,
});

const dragStartX = ref<number>(0);
const dragStartY = ref<number>(0);
const startClientRect = reactive({
  x: 0 as number,
  y: 0 as number,
});

onMounted(() => {
  document.addEventListener("mousemove", onDrag);
  document.addEventListener("mouseup", onDragEnd);
});

onBeforeMount(() => {
  document.removeEventListener("mousemove", onDrag);
  document.removeEventListener("mouseup", onDragEnd);
});

const onMoveDragStart = (event: MouseEvent) => {
  event.preventDefault();
  event.stopPropagation();

  isMoveDragging.value = true;
  dragStartX.value = event.clientX;
  dragStartY.value = event.clientY;
  startClientRect.x = pos.x;
  startClientRect.y = pos.y;
};

const onDrag = (event: MouseEvent) => {
  if (isMoveDragging.value) {
    pos.x = startClientRect.x + (event.clientX - dragStartX.value);
    pos.y = startClientRect.y + (event.clientY - dragStartY.value);
  }
};

const onDragEnd = () => {
  isMoveDragging.value = false;
  dragStartX.value = 0;
  dragStartY.value = 0;
  startClientRect.x = 0;
  startClientRect.y = 0;
};

const connectStatus = (status: boolean) => {
  isConnected.value = status;
};

const currencyPair = (pair: string) => {
  currencyPairSelected.value = pair;
};
</script>

<template>
  <div
    class="absolute bg-modal z-50 border border-solid border-white rounded-md h-auto w-modal"
    :style="{
      transform: `translate3d(${pos.x}px, ${pos.y}px, 0)`,
    }"
  >
    <div
      class="h-12 text-center flex justify-center items-center border-b border-solid border-white cursor-move"
      @mousedown="onMoveDragStart"
    >
      <span class="text-lg font-bold">dYdX Trade Support Extension</span>
    </div>
    <div class="modal-content" v-if="isConnected">
      <div class="border-b border-solid border-white">
        <TradeHeader @currency-pair="currencyPair" />
      </div>
      <div class="border-b border-solid border-white">
        <TradeInfo :currency-pair="currencyPairSelected" />
      </div>
      <div class="border-b border-solid border-white">
        <MarketOrder :currency-pair="currencyPairSelected" />
      </div>
      <div>
        <LimitOrder :currency-pair="currencyPairSelected" />
      </div>
    </div>
    <div class="authorize" v-else>
      <ConnectWallet @is-connected="connectStatus" />
    </div>
  </div>
</template>

<style scoped>
.w-modal {
  width: 300px;
}
</style>
