<script setup lang="ts">
import { computed, defineEmits } from "vue";
import { useStore } from "@/store";

const store = useStore();
const emit = defineEmits(["is-connected"]);

const ethAddress = computed(() => store.getters["ethAddress"]);
const logout = async () => {
  store.dispatch("logout");
  emit("is-connected", false);
};
</script>

<template>
  <div class="flex flex-row-reverse p-2 items-center">
    <button class="px-2" @click="logout">
      <fa icon="right-from-bracket"></fa>
    </button>
    <div class="flex bg-modal-container px-2 py-1 rounded">
      <div class="px-2"><fa icon="wallet"></fa></div>
      <div class="pr-2 text-sm">
        {{ ethAddress.slice(0, 6) }} ···· {{ ethAddress.slice(-4) }}
      </div>
    </div>
  </div>
</template>
