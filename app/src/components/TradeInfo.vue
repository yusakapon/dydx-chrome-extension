<script setup lang="ts">
import { computed, watch, defineProps, ref } from "vue";
import { useStore } from "@/store";
import AppAccordion from "./parts/AppAccordion.vue";
import { Market, OrderSide, OrderStatus } from "@dydxprotocol/v3-client";

const store = useStore();
const orders = computed(() => store.getters["account/orders"]);
const positions = computed(() => store.getters["account/positions"]);

const market = ref<keyof typeof Market>();
const props = defineProps({
  currencyPair: String,
});
watch(props, (props) => {
  market.value = props.currencyPair as keyof typeof Market;
  savePositions(positions);
  saveOrders();
});

// position
type position = {
  side: string;
  size: number;
  price: number;
  pl: number;
  market: Market;
};
const positionArray = ref<Array<position>>([]);
const positionCount = computed(() => {
  return positionArray.value.length;
});

const isDisplayAllMarkets = ref<boolean>(true);
watch(isDisplayAllMarkets, () => {
  savePositions(positions);
  saveOrders();
});

watch(positions, (positions) => {
  savePositions(positions);
});
const savePositions = (positions: { [x: string]: any }) => {
  positionArray.value = [];
  Object.keys(positions).forEach((symbol) => {
    if (
      isDisplayAllMarkets.value ||
      (market.value && symbol === Market[market.value])
    ) {
      const element = positions[symbol];
      const priceDicimalPoint =
        store.getters["market/priceDicimalPoint"](symbol);
      if (element && priceDicimalPoint !== undefined) {
        const short = element["SHORT"];
        const long = element["LONG"];
        const point = 10 ** priceDicimalPoint;
        if (short) {
          const position: position = {
            side: short.side,
            size: -short.size,
            price: Math.round(short.entryPrice * point) / point,
            pl: short.unrealizedPnl,
            market: short.market,
          };
          positionArray.value.push(position);
        } else if (long) {
          const position: position = {
            side: long.side,
            size: long.size,
            price: Math.round(long.entryPrice * point) / point,
            pl: long.unrealizedPnl,
            market: long.market,
          };
          positionArray.value.push(position);
        }
      }
    }
  });
};

// order
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

watch(orders, () => {
  saveOrders();
});

const saveOrders = () => {
  orderArray.value = [];
  for (const key in orders.value) {
    if (Object.prototype.hasOwnProperty.call(orders.value, key)) {
      const element = orders.value[key];
      if (
        isDisplayAllMarkets.value ||
        (market.value && element.market === Market[market.value])
      ) {
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
  }
};

// function
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

// class
const isActive = (status: OrderStatus) => {
  const isActive = status === "OPEN" ? "" : "opacity-60";
  return isActive;
};

const textSide = (side: OrderSide) => {
  let textSide;
  switch (side) {
    case OrderSide.SELL:
      textSide = "text-sell";
      break;
    case OrderSide.BUY:
      textSide = "text-buy";
      break;
    default:
      break;
  }
  return textSide;
};

const textSideString = (side: string) => {
  let textSide;
  switch (side) {
    case "SHORT":
      textSide = "text-sell";
      break;
    case "LONG":
      textSide = "text-buy";
      break;
    default:
      break;
  }
  return textSide;
};
</script>

<template>
  <div>
    <AppAccordion class="flex flex-col justify-center items-center px-2">
      <template v-slot:title>
        <span>Trade Info</span>
      </template>
      <template v-slot:content>
        <div class="text-sm p-1 my-1">
          <span>Position</span>
          <div class="float-right items-center">
            <input
              class="mr-1 leading-tight"
              name="all-market"
              id="all-market"
              v-model="isDisplayAllMarkets"
              type="checkbox"
            />
            <label for="all-market" class="text-sm ml-1">All Markets</label>
          </div>
        </div>
        <div class="text-sm">
          <table class="text-center w-full">
            <thead class="block">
              <tr>
                <th class="w-14 p-1">Market</th>
                <th class="w-14 p-1">Side</th>
                <th class="w-14 p-1">Size</th>
                <th class="w-14 p-1">Price</th>
                <th class="w-14 p-1">PL</th>
              </tr>
            </thead>
            <tbody
              class="overflow-y-scroll block"
              v-bind:class="{
                'h-position-tbody-wide': isDisplayAllMarkets,
                'h-position-tbody': !isDisplayAllMarkets,
              }"
            >
              <tr v-show="positionCount === 0" class="bg-modal-container">
                <td class="p-1 w-72">no positions</td>
              </tr>
              <tr
                class="bg-modal-container"
                v-for="position in positionArray"
                v-bind:key="position.side"
              >
                <td class="border border-modal p-1 w-14">
                  {{ position.market.split("-")[0] }}
                </td>
                <td
                  class="border border-modal p-1 w-14"
                  v-bind:class="textSideString(position.side)"
                >
                  {{ position.side }}
                </td>
                <td class="border border-modal p-1 w-14">
                  {{ position.size }}
                </td>
                <td class="border border-modal p-1 w-14">
                  {{ position.price }}
                </td>
                <td class="border border-modal p-1 w-14">
                  {{ position.pl }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="text-sm p-1 my-1">
          <span>Order</span>
          <button
            v-show="orderCount > 0"
            class="float-right bg-modal-container p-1 rounded"
            @click="cancelAllOrders"
          >
            Cancel All
          </button>
        </div>
        <div class="text-sm">
          <table class="text-center w-full">
            <thead class="block">
              <tr>
                <th class="w-14 p-1">Market</th>
                <th class="w-14 p-1">Side</th>
                <th class="w-14 p-1">Size</th>
                <th class="w-14 p-1">Price</th>
                <th class="w-14 p-1">Cancel</th>
              </tr>
            </thead>
            <tbody class="overflow-y-scroll h-order-tbody block">
              <tr v-show="orderCount === 0" class="bg-modal-container">
                <td class="p-1 w-72">no orders</td>
              </tr>
              <tr
                class="bg-modal-container"
                v-for="order in orderArray"
                v-bind:key="order.id"
                v-bind:class="isActive(order.status)"
              >
                <td class="border border-modal p-1 w-14">
                  {{ order.market.split("-")[0] }}
                </td>
                <td
                  class="border border-modal p-1 w-14"
                  v-bind:class="textSide(order.side)"
                >
                  {{ order.side }}
                </td>
                <td class="border border-modal p-1 w-14">
                  {{ order.amount }}
                </td>
                <td class="border border-modal p-1 w-14">{{ order.price }}</td>
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
      </template>
    </AppAccordion>
  </div>
</template>

<style scoped>
.h-position-tbody-wide {
  height: 100px;
  max-height: 100px;
}
.h-position-tbody {
  height: 28px;
  max-height: 28px;
}
.h-order-tbody {
  height: 100px;
  max-height: 100px;
}
</style>
