<script setup lang="ts">
import { computed, watch, defineProps, ref } from "vue";
import { useStore } from "@/store";
import AppAccordion from "./parts/AppAccordion.vue";
import { Market } from "@dydxprotocol/v3-client";

const store = useStore();
const orders = computed(() => store.getters["account/orders"]);
const positions = computed(() => store.getters["account/positions"]);
const market = ref<keyof typeof Market>();

const havePosition = ref<boolean>(false);
const positionSide = ref<string>();
const positionSize = ref<number>(0);
const positionPrice = ref<number>(0);
const positionPl = ref<number>(0);

const haveOrder = ref<boolean>(false);
const orderSide = ref<string>();
const orderSize = ref<number>(0);
const orderPrice = ref<number>(0);
const orderStatus = ref<number>(0);

const props = defineProps({
  currencyPair: String,
});

watch(orders, (orders) => {
  if (market.value) {
    const order = orders[Market[market.value]];
    if (order) {
      haveOrder.value = true;
      orderSide.value = order.side;
      orderSize.value = order.size;
      orderPrice.value = order.price;
      orderStatus.value = order.status;
    } else {
      haveOrder.value = false;
    }
  }
});

watch(positions, (positions) => {
  if (market.value) {
    const position = positions[Market[market.value]];
    if (position) {
      havePosition.value = true;
      const short = position["SHORT"];
      const long = position["LONG"];
      if (short) {
        positionSide.value = short.side;
        positionSize.value = -short.size;
        positionPrice.value = short.entryPrice;
        positionPl.value = short.unrealizedPnl;
      } else if (long) {
        positionSide.value = long.side;
        positionSize.value = long.size;
        positionPrice.value = long.entryPrice;
        positionPl.value = long.unrealizedPnl;
      } else {
        havePosition.value = false;
      }
    } else {
      havePosition.value = false;
    }
  }
});

watch(props, (props) => {
  market.value = props.currencyPair as keyof typeof Market;
});
</script>

<template>
  <div>
    <AppAccordion class="flex flex-col justify-center items-center px-2">
      <template v-slot:title>
        <span>Trade Info</span>
      </template>
      <template v-slot:content>
        <div class="text-sm">Position</div>
        <div v-if="havePosition" class="text-sm">
          <table class="table-auto text-center">
            <thead>
              <tr>
                <th class="w-1/4 p-1">Side</th>
                <th class="w-1/4 p-1">Size</th>
                <th class="w-1/4 p-1">Price</th>
                <th class="w-1/4 p-1">PL</th>
              </tr>
            </thead>
            <tbody>
              <tr class="bg-modal-container">
                <td class="border border-modal p-1 rounded-l">
                  {{ positionSide }}
                </td>
                <td class="border border-modal p-1">{{ positionSize }}</td>
                <td class="border border-modal p-1">{{ positionPrice }}</td>
                <td class="border border-modal p-1 rounded-r">
                  {{ positionPl }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div v-else class="text-sm pl-1">none</div>
        <div class="text-sm">Order</div>
        <div class="text-sm pl-1">none</div>
      </template>
    </AppAccordion>
  </div>
</template>
