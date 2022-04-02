import { Module } from "vuex";
import { OrderSide, OrderType, TimeInForce } from "@dydxprotocol/v3-client";
import {
  RootState,
  OrderState,
  MarketOrderParam,
  LimitOrderParam,
  CancelAllParam,
  CancelParam,
} from "@/store/types";

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
        !rootGetters["market/marketInfo"](market)
      )
        return;
      if (size < rootGetters["market/minOrderSize"](market)) return;

      const priceDicimalPoint: number =
        rootGetters["market/priceDicimalPoint"](market);
      let orderPrice = "";
      if (side === OrderSide.BUY) {
        const bestPrice: number = rootGetters["orderbook/bestAskPrice"];
        orderPrice = (bestPrice + bestPrice * 0.1).toFixed(priceDicimalPoint);
      } else {
        const bestPrice: number = rootGetters["orderbook/bestBidPrice"];
        orderPrice = (bestPrice - bestPrice * 0.1).toFixed(priceDicimalPoint);
      }

      const stepSize: number = rootGetters["market/stepSize"](market);
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

    async limitOrder(
      { commit, rootState, rootGetters },
      {
        market,
        side,
        size,
        price,
        postOnly,
        timeInForce,
        expireSecond,
      }: LimitOrderParam
    ) {
      console.log("limitOrder");
      if (!rootState.client || !rootState.account) return;
      if (
        !rootGetters["orderbook/isConnected"] ||
        !rootGetters["market/marketInfo"](market)
      )
        return;
      if (size < rootGetters["market/minOrderSize"](market)) return;

      const priceDicimalPoint: number =
        rootGetters["market/priceDicimalPoint"](market);
      const orderPrice = price.toFixed(priceDicimalPoint);

      const stepSize: number = rootGetters["market/stepSize"](market);
      const orderSize = String(Math.trunc(size / stepSize) * stepSize);

      const param = {
        type: OrderType.LIMIT,
        market: market,
        side: side,
        size: orderSize,
        price: orderPrice,
        postOnly: postOnly,
        timeInForce: timeInForce,
        limitFee: "0.05",
        expiration: new Date(Date.now() + expireSecond * 1000).toISOString(),
      };
      const res = await rootState.client.private.createOrder(
        param,
        rootState.account.positionId
      );
      console.log(res);
    },

    async cancelAll({ commit, rootState }, { market }: CancelAllParam) {
      console.log("cancelAll");
      if (!rootState.client || !rootState.account) return;

      if (market) {
        const res = await rootState.client.private.cancelAllOrders(market);
        console.log(res);
      } else {
        const res = await rootState.client.private.cancelAllOrders();
        console.log(res);
      }
    },

    async cancel({ commit, rootState }, { orderId }: CancelParam) {
      console.log("cancel");
      if (!rootState.client || !rootState.account) return;

      const res = await rootState.client.private.cancelOrder(orderId);
      console.log(res);
    },
  },
  modules: {},
};
