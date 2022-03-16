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
  },
  modules: {},
};
