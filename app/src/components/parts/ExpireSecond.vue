<script setup lang="ts">
import { ref, defineEmits, watch } from "vue";

const emit = defineEmits(["expireSecond"]);

const expireSecond = ref<number>(2592000);
const isExpireSecondOpen = ref<boolean>(false);
const toggleExpireSecond = () => {
  isExpireSecondOpen.value = !isExpireSecondOpen.value;
};

const countDownExpireSecond = () => {
  if (expireSecond.value > 15) {
    expireSecond.value -= 1;
  }
};

const countUpExpireSecond = () => {
  expireSecond.value += 1;
};

watch(expireSecond, (second) => {
  expireSecond.value = second;
  emit("expireSecond", expireSecond);
});
</script>

<template>
  <div class="mt-2">
    <button
      class="text-sm"
      @click="toggleExpireSecond"
      :aria-expanded="isExpireSecondOpen"
    >
      ExpireSecond
      <svg
        class="w-3 ml-1 transition-all duration-200 transform inline"
        :class="{
          'rotate-180': isExpireSecondOpen,
          'rotate-0': !isExpireSecondOpen,
        }"
        fill="none"
        stroke="currentColor"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 16 10"
        aria-hidden="true"
      >
        <path
          d="M15 1.2l-7 7-7-7"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
    </button>
  </div>
  <div
    v-show="isExpireSecondOpen"
    class="inline-flex w-full text-sm my-1 transition-all duration-200"
  >
    <button
      class="active:opacity-50 py-2 pl-2 pr-1 ml-1 bg-modal-container rounded-l"
      @click="countDownExpireSecond"
    >
      <fa icon="minus"></fa>
    </button>
    <input
      type="number"
      min="15"
      :step="1"
      class="w-20 py-2 bg-modal-container text-center no-count border border-modal"
      v-model="expireSecond"
    />
    <button
      class="active:opacity-50 py-2 pl-1 pr-2 bg-modal-container rounded-r"
      @click="countUpExpireSecond"
    >
      <fa icon="plus"></fa>
    </button>
  </div>
</template>
<style scoped>
.no-count::-webkit-outer-spin-button,
.no-count::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
</style>
