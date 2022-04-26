import { Module } from "vuex";
import { OrderSide, OrderType, TimeInForce } from "@dydxprotocol/v3-client";
import {
  RootState,
  OrderState,
  EditOrderParam,
  MarketOrderParam,
  LimitOrderParam,
  CancelAllParam,
  CancelParam,
} from "@/store/types";
import { AxiosServerError } from "@dydxprotocol/v3-client/build/src/lib/axios/errors";

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
      if (!rootState.client || !rootState.account) {
        return { result: false, message: "Not authenticated." };
      }
      if (
        !rootGetters["orderbook/isConnected"] ||
        !rootGetters["market/marketInfo"](market)
      ) {
        return {
          result: false,
          message: "Market information has not been retrieved.",
        };
      }
      if (size < rootGetters["market/minOrderSize"](market)) {
        return {
          result: false,
          message: "Order size is below the minimum size.",
        };
      }

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

      try {
        const res = await rootState.client.private.createOrder(
          param,
          rootState.account.positionId
        );
        console.log(res);
        return {
          result: true,
          message: "success",
        };
      } catch (e) {
        if (e instanceof AxiosServerError) {
          const data: any = e.data;
          return {
            result: false,
            message: data?.errors[0]?.msg,
          };
        } else {
          return {
            result: false,
            message: "error",
          };
        }
      }
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
      if (!rootState.client || !rootState.account) {
        return { result: false, message: "Not authenticated." };
      }
      if (
        !rootGetters["orderbook/isConnected"] ||
        !rootGetters["market/marketInfo"](market)
      ) {
        return {
          result: false,
          message: "Market information has not been retrieved.",
        };
      }
      if (size < rootGetters["market/minOrderSize"](market))
        return {
          result: false,
          message: "Order size is below the minimum size.",
        };

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

      try {
        const res = await rootState.client.private.createOrder(
          param,
          rootState.account.positionId
        );
        console.log(res);
        return {
          result: true,
          message: "success",
        };
      } catch (e) {
        if (e instanceof AxiosServerError) {
          const data: any = e.data;
          return {
            result: false,
            message: data?.errors[0]?.msg,
          };
        } else {
          return {
            result: false,
            message: "error",
          };
        }
      }
    },

    async editOrder(
      { commit, rootState, rootGetters },
      { orderId, price }: EditOrderParam
    ) {
      console.log("editOrder");
      if (!rootState.client || !rootState.account) {
        return { result: false, message: "Not authenticated." };
      }

      const orders = rootGetters["account/orders"];
      if (!orders[orderId]) {
        return {
          result: false,
          message: "This order does not exist.",
        };
      }
      const targetOrder = orders[orderId];
      const market = targetOrder["market"];

      if (
        !rootGetters["orderbook/isConnected"] ||
        !rootGetters["market/marketInfo"](market)
      ) {
        return {
          result: false,
          message: "Market information has not been retrieved.",
        };
      }

      if (targetOrder["type"] !== OrderType.LIMIT) {
        return {
          result: false,
          message: "Only limit order can be edited.",
        };
      }

      const priceDicimalPoint: number =
        rootGetters["market/priceDicimalPoint"](market);
      const orderPrice = price.toFixed(priceDicimalPoint);

      const param = {
        type: OrderType.LIMIT,
        market: market,
        side: targetOrder["side"],
        size: targetOrder["size"],
        price: orderPrice,
        postOnly: targetOrder["postOnly"],
        timeInForce: targetOrder["timeInForce"],
        limitFee: "0.05",
        expiration: targetOrder["expiresAt"],
        cancelId: orderId,
      };

      try {
        const res = await rootState.client.private.createOrder(
          param,
          rootState.account.positionId
        );
        console.log(res);
        return {
          result: true,
          message: "success",
        };
      } catch (e) {
        if (e instanceof AxiosServerError) {
          const data: any = e.data;
          return {
            result: false,
            message: data?.errors[0]?.msg,
          };
        } else {
          return {
            result: false,
            message: "error",
          };
        }
      }
    },

    async cancelAll({ commit, rootState }, { market }: CancelAllParam) {
      console.log("cancelAll");
      if (!rootState.client || !rootState.account) {
        return { result: false, message: "Not authenticated." };
      }

      try {
        if (market) {
          const res = await rootState.client.private.cancelAllOrders(market);
          console.log(res);
        } else {
          const res = await rootState.client.private.cancelAllOrders();
          console.log(res);
        }
        return {
          result: true,
          message: "success",
        };
      } catch (e) {
        if (e instanceof AxiosServerError) {
          const data: any = e.data;
          return {
            result: false,
            message: data?.errors[0]?.msg,
          };
        } else {
          return {
            result: false,
            message: "error",
          };
        }
      }
    },

    async cancel({ commit, rootState }, { orderId }: CancelParam) {
      console.log("cancel");
      if (!rootState.client || !rootState.account) {
        return { result: false, message: "Not authenticated." };
      }

      try {
        const res = await rootState.client.private.cancelOrder(orderId);
        console.log(res);
        return {
          result: true,
          message: "success",
        };
      } catch (e) {
        if (e instanceof AxiosServerError) {
          const data: any = e.data;
          return {
            result: false,
            message: data?.errors[0]?.msg,
          };
        } else {
          return {
            result: false,
            message: "error",
          };
        }
      }
    },
  },
  modules: {},
};
