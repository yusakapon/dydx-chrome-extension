<script setup lang="ts">
import { defineProps, watch, ref } from "vue";

const errorMessage = ref<string>();
const props = defineProps({
  errorMessage: String,
});

watch(props, (props) => {
  console.log(props);
});
</script>

<template>
  <div class="text-center p-2 items-center text-red-700">
    {{ errorMessage }}
  </div>
</template>
