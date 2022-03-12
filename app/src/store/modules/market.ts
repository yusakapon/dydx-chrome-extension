import { Module } from "vuex";
import { RootState, MarketsState, initMarketParam } from "@/store/types";

export const MarketsStoreModule: Module<MarketsState, RootState> = {
  namespaced: true,
  state: {
    marketInfo: undefined,
  },
  getters: {
    marketInfo: (state) => {
      return state.marketInfo;
    },
    priceDicimalPoint: (state) => {
      if (!state.marketInfo) return undefined;
      const numbers = state.marketInfo.tickSize.split(".");
      return numbers[1] ? numbers[1].length : 0;
    },
    stepSize: (state) => {
      if (!state.marketInfo) return undefined;
      return Number(state.marketInfo.stepSize);
    },
    minOrderSize: (state) => {
      if (!state.marketInfo) return undefined;
      return Number(state.marketInfo.minOrderSize);
    },
  },
  mutations: {
    SET_MARKETS(state, marketInfo) {
      state.marketInfo = marketInfo;
    },
  },
  actions: {
    async init({ commit, rootState }, { market }: initMarketParam) {
      console.log("markets init");
      if (!rootState.client) return;

      const { markets } = await rootState.client.public.getMarkets(market);
      console.log(markets[market]);

      commit("SET_MARKETS", markets[market]);
    },
  },
  modules: {},
};
