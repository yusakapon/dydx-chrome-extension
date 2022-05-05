<script setup lang="ts">
import { defineProps, withDefaults, toRefs, defineEmits } from "vue";

// props
type Props = {
  errorMessage: string;
};
const props = withDefaults(defineProps<Props>(), {
  errorMessage: "",
});
const { errorMessage } = toRefs(props);

// emit
const emit = defineEmits(["error-message"]);

const closeMessage = () => {
  emit("error-message", "");
};
</script>

<template>
  <div
    class="text-center p-2 items-center bg-warning border-warning text-sm rounded m-1"
  >
    <span class="mr-2 text-white">{{ errorMessage }}</span>
    <button @click="closeMessage" class="text-white hover:opacity-50">
      <fa icon="times-circle"></fa>
    </button>
  </div>
</template>

<style scoped>
.bg-warning {
  background-color: rgba(255, 182, 72, 0.2);
}
.border-warning {
  border-left: 4px solid #ffb648;
}
</style>
