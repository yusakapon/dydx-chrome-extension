<script setup lang="ts">
import { ref, reactive, onMounted, onBeforeMount } from "vue";
import LimitOrder from "./components/LimitOrder.vue";
import MarketOrder from "./components/MarketOrder.vue";
import TradeHeader from "./components/TradeHeader.vue";
import TradeInfo from "./components/TradeInfo.vue";

const initialWidth = 300;
const initialHeight = 800;
const width = ref<number>(initialWidth);
const height = ref<number>(initialHeight);
const pos = reactive({
  x: 0 as number,
  y: 0 as number,
});
const isMoveDragging = ref<boolean>(false);

const dragStartX = ref<number>(0);
const dragStartY = ref<number>(0);
const startClientRect = reactive({
  x: 0 as number,
  y: 0 as number,
});

const isMinimized = ref<boolean>(false);

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
  // 移動ドラッグの時
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
    class="modal"
    :style="{
      background: '#1c1c28',
      width: `${width}px`,
      height: `${height}px`,
      transform: `translate3d(${pos.x}px, ${pos.y}px, 0)`,
      border: '1px solid #FFF',
      borderRadius: '5px',
    }"
  >
    <div
      class="modal-header"
      :style="{
        height: `40px`,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        borderBottom: '1px solid #FFF',
        fontWeight: 'bold',
      }"
      @mousedown="onMoveDragStart"
    >
      <span>dYdX Trade Support Extension</span>
    </div>
    <div class="modal-content" v-show="!isMinimized">
      <div
        :style="{
          borderBottom: '1px solid #FFF',
        }"
      >
        <TradeHeader />
      </div>
      <div
        :style="{
          borderBottom: '1px solid #FFF',
        }"
      >
        <TradeInfo />
      </div>
      <div
        :style="{
          borderBottom: '1px solid #FFF',
        }"
      >
        <MarketOrder />
      </div>
      <div>
        <LimitOrder />
      </div>
    </div>
  </div>
</template>

<style></style>
