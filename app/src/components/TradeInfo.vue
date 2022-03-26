<script setup lang="ts">
import AppAccordion from "./parts/AppAccordion.vue";
</script>

<template>
  <div>
    <AppAccordion class="flex flex-col justify-center items-center px-2">
      <template v-slot:title>
        <span>Trade Info</span>
      </template>
      <template v-slot:content>
        <div>Position</div>
        <div>Order</div>
      </template>
    </AppAccordion>
  </div>
</template>
