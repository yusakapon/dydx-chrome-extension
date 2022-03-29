import { Module } from "vuex";
import { RootState, OrderbookState, initMarketParam } from "@/store/types";
import {
  DydxOrderBook,
  ORDER_BOOK_VALUE as DYDX_BOOK_VALUE,
} from "@/store/lib/ws/orderbook";

export const OrderbookStoreModule: Module<OrderbookState, RootState> = {
  namespaced: true,
  state: {
    dydxOrderBook: undefined,
    isConnected: false,
    symbol: undefined,
    bestAskPrice: undefined,
    bestBidPrice: undefined,
  },
  getters: {
    symbol: (state) => {
      return state.symbol;
    },
    isConnected: (state) => {
      return state.isConnected;
    },
    bestAskPrice: (state) => {
      return state.bestAskPrice;
    },
    bestBidPrice: (state) => {
      return state.bestBidPrice;
    },
  },
  mutations: {
    SET_DYDX_ORDERBOOK(state, dydxOrderBook) {
      state.dydxOrderBook = dydxOrderBook;
    },
    UPDATE_ORDERBOOK(state) {
      if (!state.dydxOrderBook) return;
      state.symbol = state.dydxOrderBook.symbol;
      state.isConnected = state.dydxOrderBook.isConnected;
      if (state.dydxOrderBook.bestPrice.ask.length) {
        state.bestAskPrice =
          state.dydxOrderBook.bestPrice.ask[DYDX_BOOK_VALUE.PRICE];
      }
      if (state.dydxOrderBook.bestPrice.bid.length) {
        state.bestBidPrice =
          state.dydxOrderBook.bestPrice.bid[DYDX_BOOK_VALUE.PRICE];
      }
    },
  },
  actions: {
    async init({ commit, rootState }, { market }: initMarketParam) {
      console.log("orderbook init");
      if (!rootState.client) return false;

      try {
        const dydxOrderBook = new DydxOrderBook(
          rootState.hostWs,
          rootState.client,
          1000,
          market,
          () => {
            commit("UPDATE_ORDERBOOK");
          }
        );
        await dydxOrderBook.start();

        commit("SET_DYDX_ORDERBOOK", dydxOrderBook);
        return true;
      } catch (error) {
        return false;
      }
    },
  },
  modules: {},
};
