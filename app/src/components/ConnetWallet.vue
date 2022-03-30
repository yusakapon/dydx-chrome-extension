<script setup lang="ts">
import { ref, defineEmits } from "vue";
import { useStore } from "@/store";

const store = useStore();
const isConnected = ref<boolean>(false);
const isError = ref<boolean>(false);
const errorMsg = ref<string>("");

const emit = defineEmits(["is-connected"]);

const connectWallet = async () => {
  const connect = await store.dispatch("initClient");
  if (connect === true) {
    isConnected.value = true;
    emit("is-connected", isConnected.value);
  } else {
    isError.value = true;
    errorMsg.value = store.getters.errorMsg;
  }
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
  <div class="text-center pb-2 text-red-700" v-show="isError">
    <fa icon="exclamation-triangle"></fa>
    <span class="ml-1">{{ errorMsg }}</span>
  </div>
</template>
