<template>
  <details>
    <summary>
      <span>Trade info</span>
    </summary>
    <div>Position</div>
    <div>Order</div>
  </details>
</template>

<script lang="ts">
export default {
  name: "TradeInfo",
  data() {
    return {
      eid: 0,
    };
  },
};
</script>

<style scoped>
summary {
  margin-bottom: 10px;
  cursor: pointer;
}
</style>
