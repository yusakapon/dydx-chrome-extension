import { Module } from "vuex";
import { OrderSide, OrderType, TimeInForce } from "@dydxprotocol/v3-client";
import { RootState, OrderState, MarketOrderParam } from "@/store/types";

export const OrderStoreModule: Module<OrderState, RootState> = {
  namespaced: true,
  state: {},
  getters: {},
  mutations: {},
  actions: {
    async marketOrder(
      { commit, rootState, rootGetters },
      { market, side, size }: MarketOrderParam
    ) {
      console.log("marketOrder");
      if (!rootState.client || !rootState.account) return;
      if (
        !rootGetters["orderbook/isConnected"] ||
        !rootGetters["market/marketInfo"]
      )
        return;
      if (size < rootGetters["market/minOrderSize"]) return;

      const priceDicimalPoint: number = rootGetters["market/priceDicimalPoint"];
      let orderPrice = "";
      if (side === OrderSide.BUY) {
        const bestPrice: number = rootGetters["orderbook/bestAskPrice"];
        orderPrice = (bestPrice + bestPrice * 0.1).toFixed(priceDicimalPoint);
      } else {
        const bestPrice: number = rootGetters["orderbook/bestBidPrice"];
        orderPrice = (bestPrice - bestPrice * 0.1).toFixed(priceDicimalPoint);
      }

      const stepSize: number = rootGetters["market/stepSize"];
      const orderSize = String(Math.trunc(size / stepSize) * stepSize);

      const param = {
        type: OrderType.MARKET,
        market: market,
        side: side,
        size: orderSize,
        price: orderPrice,
        timeInForce: TimeInForce.FOK, // dummy param
        postOnly: false, // dummy param
        limitFee: "0.05", // dummy param
        expiration: new Date(Date.now() + 600000).toISOString(), // dummy param
      };
      const res = await rootState.client.private.createOrder(
        param,
        rootState.account.positionId
      );
      console.log(res);
    },
  },
  modules: {},
};
