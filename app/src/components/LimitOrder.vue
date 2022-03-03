<template>
  <details>
    <summary>
      <span>Limit Order</span>
    </summary>
    <div>Position</div>
    <div>Order</div>
  </details>
</template>

<script lang="ts">
export default {
  name: "LimitOrder",
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
