import { Module } from "vuex";
import { RootState, MarketsState, initMarketParam } from "@/store/types";
import { Market } from "@dydxprotocol/v3-client";

export const MarketsStoreModule: Module<MarketsState, RootState> = {
  namespaced: true,
  state: {
    marketInfoAll: undefined,
  },
  getters: {
    marketInfoAll: (state) => {
      return state.marketInfoAll;
    },
    marketInfo: (state) => (market: Market) => {
      if (!state.marketInfoAll) return undefined;
      return state.marketInfoAll[market];
    },
    priceDicimalPoint: (state) => (market: Market) => {
      if (!state.marketInfoAll || !state.marketInfoAll[market])
        return undefined;
      const numbers = state.marketInfoAll[market].tickSize.split(".");
      return numbers[1] ? numbers[1].length : 0;
    },
    stepSize: (state) => (market: Market) => {
      if (!state.marketInfoAll || !state.marketInfoAll[market])
        return undefined;
      return Number(state.marketInfoAll[market].stepSize);
    },
    tickSize: (state) => (market: Market) => {
      if (!state.marketInfoAll || !state.marketInfoAll[market])
        return undefined;
      return Number(state.marketInfoAll[market].tickSize);
    },
    minOrderSize: (state) => (market: Market) => {
      if (!state.marketInfoAll || !state.marketInfoAll[market])
        return undefined;
      return Number(state.marketInfoAll[market].minOrderSize);
    },
  },
  mutations: {
    SET_MARKETS_ALL(state, marketInfoAll) {
      state.marketInfoAll = marketInfoAll;
    },
  },
  actions: {
    async init({ commit, rootState }) {
      console.log("markets init");
      if (!rootState.client) return false;

      try {
        const { markets } = await rootState.client.public.getMarkets();
        commit("SET_MARKETS_ALL", markets);
        return true;
      } catch (error) {
        return false;
      }
    },
  },
  modules: {},
};
