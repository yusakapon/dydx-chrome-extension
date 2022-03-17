<script setup lang="ts">
import { ref } from "vue";
const isOpen = ref<boolean>(true);

const toggleAccordion = () => {
  isOpen.value = !isOpen.value;
};
</script>

<template>
  <div>
    <button
      @click="toggleAccordion()"
      class="w-full flex justify-center items-center p-1"
      :aria-expanded="isOpen"
    >
      <slot name="title" />
      <svg
        class="w-3 transition-all duration-200 transform absolute right-0 mr-1"
        :class="{
          'rotate-180': isOpen,
          'rotate-0': !isOpen,
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

    <div v-show="isOpen" class="w-full">
      <slot name="content" />
    </div>
  </div>
</template>
