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

const isProduction = computed(() => store.getters["isProduction"]);
</script>

<template>
  <div class="flex items-center">
    <div v-if="isProduction" class="p-2 text-sm">
      <fa icon="globe"></fa>
      MainNet
    </div>
    <div v-else class="p-2 text-sm">
      <fa icon="flask"></fa>
      TestNet
    </div>
    <div class="flex p-2 pl-4 items-center">
      <div class="flex bg-modal-container px-2 py-1 rounded">
        <div class="px-2"><fa icon="wallet"></fa></div>
        <div class="pr-2 text-sm">
          {{ ethAddress.slice(0, 6) }} ···· {{ ethAddress.slice(-4) }}
        </div>
      </div>
      <button class="px-2" @click="logout">
        <fa icon="right-from-bracket"></fa>
      </button>
    </div>
  </div>
</template>
