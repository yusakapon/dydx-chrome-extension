<script setup lang="ts">
import { ref, defineEmits, watch } from "vue";

const emit = defineEmits(["expireSecond"]);

const expiration = ref<number>(1);
const expireSecond = ref<number>(1);
const isExpirationOpen = ref<boolean>(false);
const toggleExpiration = () => {
  isExpirationOpen.value = !isExpirationOpen.value;
};

const countDownExpiration = () => {
  if (selectedUnit.value === "second") {
    if (expiration.value > 61) {
      expiration.value -= 1;
    }
  } else if (selectedUnit.value === "minute") {
    if (expiration.value > 2) {
      expiration.value -= 1;
    }
  } else {
    if (expiration.value > 1) {
      expiration.value -= 1;
    }
  }
};
const countUpExpiration = () => {
  expiration.value += 1;
};

watch(expiration, (second) => {
  expiration.value = second;
  const selected = dateUnit.find(
    (element) => element.key === selectedUnit.value
  );
  if (selected) {
    expireSecond.value = expiration.value * selected.value;
    emit("expireSecond", expireSecond.value);
  }
});

const dateUnit = [
  { key: "second", value: 1 },
  { key: "minute", value: 60 },
  { key: "hour", value: 3600 },
  { key: "day", value: 86400 },
  { key: "month", value: 2592000 },
];

const selectedUnit = ref<string>("month");

watch(selectedUnit, () => {
  const selected = dateUnit.find(
    (element) => element.key === selectedUnit.value
  );
  if (selected) {
    if (selected.key === "second") {
      expiration.value = 61;
    } else if (selected.key === "minute") {
      expiration.value = 2;
    } else {
      expiration.value = 1;
    }
    expireSecond.value = expiration.value * selected.value;
    emit("expireSecond", expireSecond.value);
  }
});
</script>

<template>
  <div class="mt-2">
    <button
      class="text-sm"
      @click="toggleExpiration"
      :aria-expanded="isExpirationOpen"
    >
      Expiration
      <svg
        class="w-3 ml-1 transition-all duration-200 transform inline"
        :class="{
          'rotate-180': isExpirationOpen,
          'rotate-0': !isExpirationOpen,
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
    v-show="isExpirationOpen"
    class="inline-flex w-full text-sm my-1 transition-all duration-200"
  >
    <button
      class="active:opacity-50 py-1 pl-2 pr-1 bg-modal-container rounded-l"
      @click="countDownExpiration"
    >
      <fa icon="minus"></fa>
    </button>
    <input
      type="number"
      min="15"
      :step="1"
      class="w-8 py-1 bg-modal-container text-center no-count border border-modal"
      v-model="expiration"
      readonly
    />
    <button
      class="active:opacity-50 py-1 pl-1 pr-2 bg-modal-container rounded-r"
      @click="countUpExpiration"
    >
      <fa icon="plus"></fa>
    </button>
    <div class="inline ml-1">
      <select
        class="bg-modal-container py-2 px-2 rounded"
        v-model="selectedUnit"
      >
        <option v-for="date in dateUnit" :key="date.key" :value="date.key">
          {{ date.key }}
        </option>
      </select>
    </div>
  </div>
</template>
<style scoped>
.no-count::-webkit-outer-spin-button,
.no-count::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
</style>
