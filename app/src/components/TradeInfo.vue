<script setup lang="ts">
import { computed, watch, defineProps, ref } from "vue";
import { useStore } from "@/store";
import AppAccordion from "./parts/AppAccordion.vue";
import { Market, OrderSide, OrderStatus } from "@dydxprotocol/v3-client";

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
type order = {
  id: string;
  price: number;
  amount: number;
  status: OrderStatus;
  side: OrderSide;
  market: Market;
};
const orderArray = ref<Array<order>>([]);
const orderCount = computed(() => {
  return orderArray.value.length;
});

const props = defineProps({
  currencyPair: String,
});

watch(orders, (orders) => {
  const length = Object.keys(orders).length;
  haveOrder.value = length ? true : false;
  orderArray.value = [];
  for (const key in orders) {
    if (Object.prototype.hasOwnProperty.call(orders, key)) {
      const element = orders[key];
      const order: order = {
        id: element.id,
        price: element.price,
        amount: element.size,
        status: element.status,
        side: element.side,
        market: element.market,
      };
      orderArray.value.push(order);
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

const cancelOrder = (id: string) => {
  store.dispatch("order/cancel", {
    orderId: id,
  });
};

const cancelAllOrders = () => {
  if (market.value) {
    store.dispatch("order/cancelAll", {
      market: Market[market.value],
    });
  }
};

const isActive = (status: OrderStatus) => {
  const isActive = status === "OPEN" ? "" : "opacity-60";
  return isActive;
};
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
          <table class="table-auto text-center w-full">
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
        <div class="text-sm">
          <span>Order</span>
          <span v-if="orderCount === 1" class="pl-4"
            >{{ orderCount }} order</span
          >
          <span v-else class="pl-4">{{ orderCount }} orders</span>
          <button
            v-show="orderCount > 0"
            class="float-right bg-modal-container p-1 rounded mt-1"
            @click="cancelAllOrders"
          >
            Cancel All
          </button>
        </div>
        <div v-if="haveOrder" class="text-sm">
          <table class="text-center w-full">
            <thead class="block">
              <tr>
                <th class="w-14 p-1">Side</th>
                <th class="w-14 p-1">Size</th>
                <th class="w-14 p-1">Price</th>
                <th class="w-14 p-1">Status</th>
                <th class="w-14 p-1">Cancel</th>
              </tr>
            </thead>
            <tbody class="overflow-y-scroll max-h-20 block">
              <tr
                class="bg-modal-container"
                v-for="order in orderArray"
                v-bind:key="order.id"
                v-bind:class="isActive(order.status)"
              >
                <td class="border border-modal p-1 w-14">
                  {{ order.side }}
                </td>
                <td class="border border-modal p-1 w-14">
                  {{ order.amount }}
                </td>
                <td class="border border-modal p-1 w-14">{{ order.price }}</td>
                <td class="border border-modal p-1 w-14">
                  {{ order.status }}
                </td>
                <td class="border border-modal px-4 py-0.5 w-14">
                  <button
                    class="w-full h-full hover:bg-modal-selected"
                    @click="cancelOrder(order.id)"
                  >
                    <fa icon="times"></fa>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div v-else class="text-sm pl-1">none</div>
      </template>
    </AppAccordion>
  </div>
</template>
