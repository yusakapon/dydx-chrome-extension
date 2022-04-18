import { Module } from "vuex";
import { RootState, AccountState } from "@/store/types";
import { Account } from "@/store/lib/ws/account";

export const AccountStoreModule: Module<AccountState, RootState> = {
  namespaced: true,
  state: {
    account: undefined,
    orders: {},
    positions: {},
    isConnected: false,
  },
  getters: {
    isConnected: (state) => {
      return state.isConnected;
    },
    orders: (state) => {
      return state.orders;
    },
    positions: (state) => {
      return state.positions;
    },
  },
  mutations: {
    SET_ACCOUNT(state, account) {
      state.account = account;
    },
    UPDATE_ACCOUNT(state) {
      if (!state.account) return;
      state.isConnected = state.account.isConnected;
      state.orders = { ...state.account.orders };
      state.positions = { ...state.account.positions };
    },
    UPDATE_UNREALIZED_PL(state, { symbol, side, unrealizedPl }) {
      if (!state.account) return;
      const positions = { ...state.positions };
      positions[symbol][side]["unrealizedPnl"] = String(unrealizedPl);
      state.positions = positions;
    },
  },
  actions: {
    async init({ commit, rootState }) {
      console.log("account init");
      if (!rootState.client || !rootState.account) return;
      const account = new Account(
        rootState.hostWs,
        rootState.client,
        rootState.account,
        () => {
          commit("UPDATE_ACCOUNT");
        }
      );
      await account.start();

      commit("SET_ACCOUNT", account);
    },
    async updateUnrealizedPL({ commit, rootState, state, rootGetters }) {
      if (!rootState.client || !rootState.account) return;

      const positions = { ...state.positions };
      const marketInfoAll = rootGetters["market/marketInfoAll"];

      // 四捨五入
      function roundDecimal(value: number, n: number) {
        return Math.round(value * Math.pow(10, n)) / Math.pow(10, n);
      }

      Object.keys(positions).forEach((symbol) => {
        const indexPrice = Number(marketInfoAll[symbol]["indexPrice"]);
        const short = positions[symbol]["SHORT"];
        const long = positions[symbol]["LONG"];
        if (short) {
          const pl = roundDecimal(
            -((indexPrice - short.entryPrice) * -short.size),
            2
          );
          commit("UPDATE_UNREALIZED_PL", {
            symbol: symbol,
            side: "SHORT",
            unrealizedPl: pl,
          });
        } else if (long) {
          const pl = roundDecimal(
            (indexPrice - long.entryPrice) * long.size,
            2
          );
          commit("UPDATE_UNREALIZED_PL", {
            symbol: symbol,
            side: "LONG",
            unrealizedPl: pl,
          });
        }
      });
    },
  },
  modules: {},
};
