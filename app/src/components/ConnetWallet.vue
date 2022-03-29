<script setup lang="ts">
import { ref, defineEmits } from "vue";
import { useStore } from "@/store";
const store = useStore();
const isConnected = ref<boolean>(false);

const emit = defineEmits(["is-connected"]);
const connectWallet = async () => {
  await store.dispatch("initClient");
  isConnected.value = true;
  emit("is-connected", isConnected.value);
};
</script>

<template>
  <div class="py-2 flex items-center justify-center">
    <button
      class="bg-blue-500 hover:bg-blue-700 text-white py-2 px-4 rounded"
      @click="connectWallet"
    >
      Connect wallet
    </button>
  </div>
</template>
