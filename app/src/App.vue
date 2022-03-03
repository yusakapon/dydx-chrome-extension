<template>
  <div class="trade-modal">
    <TradeHeader />
    <TradeInfo />
    <MarketOrder />
    <LimitOrder />
  </div>
</template>

<script lang="ts">
import TradeHeader from "./components/TradeHeader.vue";
import TradeInfo from "./components/TradeInfo.vue";
import MarketOrder from "./components/MarketOrder.vue";
import LimitOrder from "./components/LimitOrder.vue";

export default {
  name: "app",
  components: {
    TradeHeader,
    TradeInfo,
    MarketOrder,
    LimitOrder,
  },
};
</script>

<style scoped>
.trade-modal {
  background-color: #000000;
  color: #ffffff;
  position: absolute;
  width: 300px;
  height: 800px;
}
</style>
