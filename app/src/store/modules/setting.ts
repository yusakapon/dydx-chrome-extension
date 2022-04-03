import { Module } from "vuex";
import { RootState, SaveSettingParam, SettingState } from "@/store/types";
import { Market } from "@dydxprotocol/v3-client";

export const SettingStoreModule: Module<SettingState, RootState> = {
  namespaced: true,
  state: {
    settings: {},
    defaultSettings: {},
  },
  getters: {
    marketOrderAmount: (state) => (market: Market) => {
      const amount = state.settings[market]?.marketOrder?.amount;
      if (amount && amount.length) {
        return amount;
      } else {
        return state.defaultSettings[market]?.marketOrder?.amount;
      }
    },
    marketOrderLeverage: (state) => (market: Market) => {
      const leverage = state.settings[market]?.marketOrder?.leverage;
      if (leverage && leverage.length) {
        return leverage;
      } else {
        return state.defaultSettings[market]?.marketOrder?.leverage;
      }
    },
    limitOrderAmount: (state) => (market: Market) => {
      const amount = state.settings[market]?.limitOrder?.amount;
      if (amount && amount.length) {
        return amount;
      } else {
        return state.defaultSettings[market]?.limitOrder?.amount;
      }
    },
    limitOrderLeverage: (state) => (market: Market) => {
      const leverage = state.settings[market]?.limitOrder?.leverage;
      if (leverage && leverage.length) {
        return leverage;
      } else {
        return state.defaultSettings[market]?.limitOrder?.leverage;
      }
    },
    limitOrderPrice: (state) => (market: Market) => {
      const price = state.settings[market]?.limitOrder?.price;
      if (price && price.length) {
        return price;
      } else {
        return state.defaultSettings[market]?.limitOrder?.price;
      }
    },
  },
  mutations: {
    SET_SETTINGS(state, settings) {
      state.settings = settings;
    },
    SET_DEFAULT_SETTINGS(state, defaultSettings) {
      state.defaultSettings = defaultSettings;
    },
  },
  actions: {
    async init({ commit, rootGetters, rootState }) {
      console.log("setting init");
      if (!rootState.client || !rootState.account) return;

      const marketInfoAll = rootGetters["market/marketInfoAll"];
      const defaultSettings = {} as { [symbol: string]: any };
      Object.keys(marketInfoAll).forEach((market) => {
        const minOrderSize = rootGetters["market/minOrderSize"](market);
        const tickSize = rootGetters["market/tickSize"](market);
        defaultSettings[market] = {
          marketOrder: {
            amount: [minOrderSize, minOrderSize * 10, minOrderSize * 100],
            leverage: [1.0, 2.0],
          },
          limitOrder: {
            amount: [minOrderSize, minOrderSize * 10, minOrderSize * 100],
            leverage: [1.0, 2.0],
            price: [tickSize, tickSize * 10, tickSize * 100, tickSize * 1000],
          },
        };
      });

      commit("SET_DEFAULT_SETTINGS", defaultSettings);
    },
    async saveMarketOrderAmount(
      { commit, rootState, state },
      { market, setValue }: SaveSettingParam
    ) {
      if (!rootState.client || !rootState.account) return;

      const settings = { ...state.settings };
      if (market in settings) {
        settings[market].marketOrder.amount = setValue;
      } else {
        settings[market] = state.defaultSettings[market];
        settings[market].marketOrder.amount = setValue;
      }
      commit("SET_SETTINGS", settings);
    },
    async saveMarketOrderLeverage(
      { commit, rootState, state },
      { market, setValue }: SaveSettingParam
    ) {
      if (!rootState.client || !rootState.account) return;

      const settings = { ...state.settings };
      if (market in settings) {
        settings[market].marketOrder.leverage = setValue;
      } else {
        settings[market] = state.defaultSettings[market];
        settings[market].marketOrder.leverage = setValue;
      }
      commit("SET_SETTINGS", settings);
    },
    async saveLimitOrderAmount(
      { commit, rootState, state },
      { market, setValue }: SaveSettingParam
    ) {
      if (!rootState.client || !rootState.account) return;

      const settings = { ...state.settings };
      if (market in settings) {
        settings[market].limitOrder.amount = setValue;
      } else {
        settings[market] = state.defaultSettings[market];
        settings[market].limitOrder.amount = setValue;
      }
      commit("SET_SETTINGS", settings);
    },
    async saveLimitOrderLeverage(
      { commit, rootState, state },
      { market, setValue }: SaveSettingParam
    ) {
      if (!rootState.client || !rootState.account) return;

      const settings = { ...state.settings };
      if (market in settings) {
        settings[market].limitOrder.leverage = setValue;
      } else {
        settings[market] = state.defaultSettings[market];
        settings[market].limitOrder.leverage = setValue;
      }
      commit("SET_SETTINGS", settings);
    },
    async saveLimitOrderPrice(
      { commit, rootState, state },
      { market, setValue }: SaveSettingParam
    ) {
      if (!rootState.client || !rootState.account) return;

      const settings = { ...state.settings };
      if (market in settings) {
        settings[market].limitOrder.price = setValue;
      } else {
        settings[market] = state.defaultSettings[market];
        settings[market].limitOrder.price = setValue;
      }
      commit("SET_SETTINGS", settings);
    },
  },
  modules: {},
};
