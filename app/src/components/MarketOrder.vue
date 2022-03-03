<template>
  <details>
    <summary>
      <span>Market Order</span>
    </summary>
    <div>Position</div>
    <div>Order</div>
  </details>
</template>

<script lang="ts">
export default {
  name: "MarketOrder",
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
