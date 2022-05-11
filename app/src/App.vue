<script setup lang="ts">
import { clamp } from "lodash";
import { ref, reactive, onMounted, onBeforeMount } from "vue";
import LimitOrder from "./components/LimitOrder.vue";
import MarketOrder from "./components/MarketOrder.vue";
import TradeHeader from "./components/TradeHeader.vue";
import TradeInfo from "./components/TradeInfo.vue";
import ConnectWallet from "./components/ConnetWallet.vue";
import DisplayAddress from "./components/DisplayAddress.vue";
import ErrorMessage from "./components/ErrorMessage.vue";

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

const modalRef = ref<HTMLImageElement>();

const errorMessage = ref<string>("");
const setErrorMessage = (msg: string) => {
  errorMessage.value = msg;
};

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
  // 移動ドラッグの時
  if (isMoveDragging.value) {
    const modalWidth = modalRef.value?.clientWidth
      ? modalRef.value?.clientWidth
      : 0;
    const modalHeight = modalRef.value?.clientHeight
      ? modalRef.value?.clientHeight
      : 0;
    pos.x = clamp(
      startClientRect.x + (event.clientX - dragStartX.value),
      0,
      window.innerWidth - modalWidth
    );
    pos.y = clamp(
      startClientRect.y + (event.clientY - dragStartY.value),
      0,
      window.innerHeight - modalHeight
    );
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
    ref="modalRef"
  >
    <div
      class="h-12 text-center flex justify-center items-center border-b border-solid border-white cursor-move"
      @mousedown="onMoveDragStart"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        xmlns:xlink="http://www.w3.org/1999/xlink"
        width="250"
        height="40"
        viewBox="0 0 300 50"
      >
        <defs>
          <clipPath id="b"><rect width="300" height="50" /></clipPath>
        </defs>
        <g id="a" clip-path="url(#b)">
          <g transform="translate(26.902 4.572)">
            <g transform="translate(18.42 7.634)">
              <rect
                width="4.42"
                height="23.574"
                transform="translate(45.844 1.157)"
                fill="#fff"
              />
              <g transform="translate(24.468 1.157)">
                <path
                  d="M9.588,24.429a10.374,10.374,0,0,1-6.777-2.417A7.619,7.619,0,0,1,0,16.214c0-.129,0-.263.011-.4V0h4.42V9.369l.006,0,0,5.7c0,.085-.006.172-.006.259A5.284,5.284,0,0,0,9.6,20.708a5.278,5.278,0,0,0,5.155-5.382v0h.006V4.7h-.018V0h4.42V16.207h-.011v.007C19.154,20.744,14.863,24.429,9.588,24.429Z"
                  transform="translate(0 0)"
                  fill="#fff"
                />
              </g>
              <g transform="translate(51.737 1.158)">
                <path
                  d="M11.419,23.574A12.945,12.945,0,0,1,2.637,19.93C.863,18.14,0,15.476,0,11.787,0,8.022.838,5.355,2.637,3.4,4.5,1.365,8.025,0,11.419,0a11.06,11.06,0,0,1,4.052.764V4.334a7.8,7.8,0,0,0-3.684-.913,8.87,8.87,0,0,0-6.232,2.41c-1.277,1.39-1.871,3.283-1.871,5.955,0,2.618.612,4.508,1.871,5.779a9.188,9.188,0,0,0,6.232,2.586,7.8,7.8,0,0,0,3.684-.913V22.81A11.059,11.059,0,0,1,11.419,23.574Z"
                  transform="translate(0)"
                  fill="#fff"
                />
              </g>
              <rect
                width="4.42"
                height="23.574"
                transform="translate(69.418 1.157)"
                fill="#fff"
              />
              <path
                d="M14.683,13.544H8.735L.688,4.607,3.661,1.3l11.02,12.239ZM.192,4.056h0L0,3.843V2.24L2.488,0l.678.753L.192,4.055Z"
                transform="translate(74.575 11.188)"
                fill="#7372f2"
              />
              <g transform="translate(0)">
                <path
                  d="M12.384,11.622H6.7L0,2.733,3.627,0l8.756,11.62Z"
                  transform="translate(10.753 13.11)"
                  fill="#fff"
                />
                <path
                  d="M11.353,24.652a10.847,10.847,0,0,1-8.028-3.61A12.8,12.8,0,0,1,0,12.326,12.8,12.8,0,0,1,3.325,3.61a10.731,10.731,0,0,1,16.056,0,12.8,12.8,0,0,1,3.325,8.716,12.8,12.8,0,0,1-3.325,8.716A10.847,10.847,0,0,1,11.353,24.652Zm0-20.759c-4.114,0-7.46,3.783-7.46,8.434s3.347,8.434,7.46,8.434,7.46-3.783,7.46-8.434S15.467,3.893,11.353,3.893Z"
                  transform="translate(0 0)"
                  fill="#fff"
                />
              </g>
              <path
                d="M3.285,16.2h0L0,13.239,4.237,8.533v6.606L3.286,16.2Zm1.689-1.875V7.715L11.921,0h5.949L4.975,14.32Z"
                transform="translate(69.601 1.158)"
                fill="#fff"
              />
            </g>
          </g>
          <g transform="translate(142.58 12.207)">
            <path
              d="M275.7,0,258,25.358h5.434L281.226,0Z"
              transform="translate(-199.581)"
              fill="#fff"
            />
            <path
              d="M265.548,0l5.208,7.472-2.717,4.076L260,0Z"
              transform="translate(-201.128)"
              fill="#fff"
            />
            <path
              d="M318.774,70.227,313,61.963,315.717,58l8.491,12.227Z"
              transform="translate(-242.127 -44.867)"
              fill="#7372f2"
            />
            <path
              d="M181.265,0h4.755V25.358h-4.755v-.947a9.595,9.595,0,1,1,0-16.839Zm-4.677,21.375a5.434,5.434,0,1,0-5.459-5.434A5.447,5.447,0,0,0,176.588,21.375Z"
              transform="translate(-129.186)"
              fill="#fff"
              fill-rule="evenodd"
            />
            <path
              d="M108.682,0,91,25.358h5.543L114.208,0Z"
              transform="translate(-70.395)"
              fill="#fff"
            />
            <path
              d="M95.774,0l5.548,7.7L98.265,12,90,0Z"
              transform="translate(-69.621)"
              fill="#fff"
            />
            <path
              d="M14.265,0H19.02V25.358H14.265v-.947a9.595,9.595,0,1,1,0-16.839ZM9.588,21.375a5.434,5.434,0,1,0-5.459-5.434A5.447,5.447,0,0,0,9.588,21.375Z"
              fill="#fff"
              fill-rule="evenodd"
            />
          </g>
          <g transform="translate(-7)">
            <g transform="translate(139 -57)">
              <rect
                width="9"
                height="5"
                transform="translate(115 79) rotate(90)"
                fill="#ec605a"
              />
              <rect
                width="13"
                height="1"
                transform="translate(113 82) rotate(90)"
                fill="#ec605a"
              />
              <rect
                width="13"
                height="1"
                transform="translate(113 75) rotate(90)"
                fill="#ec605a"
              />
              <rect
                width="22"
                height="5"
                transform="translate(123 66) rotate(90)"
                fill="#63b38e"
              />
              <rect
                width="13"
                height="1"
                transform="translate(121 77) rotate(90)"
                fill="#63b38e"
              />
              <rect
                width="14"
                height="5"
                transform="translate(106 79) rotate(90)"
                fill="#63b38e"
              />
              <rect
                width="13"
                height="1"
                transform="translate(104 77) rotate(90)"
                fill="#63b38e"
              />
              <rect
                width="13"
                height="1"
                transform="translate(104 82) rotate(90)"
                fill="#63b38e"
              />
            </g>
          </g>
        </g>
      </svg>
    </div>
    <div class="modal-content" v-if="isConnected">
      <div v-show="errorMessage" class="border-b border-solid border-white">
        <ErrorMessage
          :error-message="errorMessage"
          @error-message="setErrorMessage"
        />
      </div>
      <div class="border-b border-solid border-white">
        <DisplayAddress @is-connected="connectStatus" />
      </div>
      <div class="border-b border-solid border-white">
        <TradeHeader @currency-pair="currencyPair" />
      </div>
      <div class="border-b border-solid border-white">
        <TradeInfo :currency-pair="currencyPairSelected" />
      </div>
      <div class="border-b border-solid border-white">
        <MarketOrder
          :currency-pair="currencyPairSelected"
          @error-message="setErrorMessage"
        />
      </div>
      <div>
        <LimitOrder
          :currency-pair="currencyPairSelected"
          @error-message="setErrorMessage"
        />
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
