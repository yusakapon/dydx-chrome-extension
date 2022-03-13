<script setup lang="ts">
import { ref, reactive, onMounted, onBeforeMount } from "vue";
import LimitOrder from "./components/LimitOrder.vue";
import MarketOrder from "./components/MarketOrder.vue";
import TradeHeader from "./components/TradeHeader.vue";
import TradeInfo from "./components/TradeInfo.vue";

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

const onMoveDragStart = (event: Event) => {
  event.preventDefault();
  event.stopPropagation();

  isMoveDragging.value = true;
  dragStartX.value = event.clientX;
  dragStartY.value = event.clientY;
  startClientRect.x = pos.x;
  startClientRect.y = pos.y;
};

const onDrag = (event: Event) => {
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
    <div class="modal-content">
      <div class="border-b border-solid border-white">
        <TradeHeader />
      </div>
      <div class="border-b border-solid border-white">
        <TradeInfo />
      </div>
      <div class="border-b border-solid border-white">
        <MarketOrder />
      </div>
      <div>
        <LimitOrder />
      </div>
    </div>
  </div>
</template>

<style scoped>
.bg-modal {
  background-color: #1c1c28;
}

.w-modal {
  width: 300px;
}
</style>
