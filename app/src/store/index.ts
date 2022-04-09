import { InjectionKey } from "vue";
import { createStore, useStore as baseUseStore, Store } from "vuex";
import createPersistedState from "vuex-persistedstate";
import Web3 from "web3";
import { DydxClient, Market, SigningMethod } from "@dydxprotocol/v3-client";
import {
  RootState,
  initMarketParam,
  API_HOST,
  WS_HOST,
  NETWORK_ID,
} from "@/store/types";
import { MarketsStoreModule } from "@/store/modules/market";
import { OrderStoreModule } from "@/store/modules/order";
import { OrderbookStoreModule } from "@/store/modules/orderbook";
import { AccountStoreModule } from "@/store/modules/account";
import { SettingStoreModule } from "@/store/modules/setting";

declare global {
  interface Window {
    ethereum: any;
  }
}

export const key: InjectionKey<Store<RootState>> = Symbol();

export const store = createStore<RootState>({
  state: {
    host: API_HOST.PRODUCTION,
    hostWs: WS_HOST.PRODUCTION,
    ethAddress: "",
    client: undefined,
    account: undefined,
    errorMsg: "",
  },
  getters: {
    ethAddress: (state) => {
      return state.ethAddress;
    },
    client: (state) => {
      return state.client;
    },
    account: (state) => {
      return state.account;
    },
    errorMsg: (state) => {
      return state.errorMsg;
    },
  },
  mutations: {
    SET_HOST(state) {
      state.host = location.host.includes("stage")
        ? API_HOST.STAGING
        : API_HOST.PRODUCTION;
      state.hostWs = location.host.includes("stage")
        ? WS_HOST.STAGING
        : WS_HOST.PRODUCTION;
    },
    SET_ETH_ADDRESS(state, ethAddress) {
      state.ethAddress = ethAddress;
    },
    SET_CLIENT(state, client) {
      state.client = client;
    },
    SET_ACCOUNT(state, account) {
      state.account = account;
    },
    SET_ERROR_MSG(state, msg) {
      state.errorMsg = msg;
    },
  },
  actions: {
    async initClient({ commit, dispatch, state }) {
      console.log("initClient");

      commit("SET_HOST");

      if (window.ethereum) {
        await window.ethereum.enable();
        const ethereum = { ...window.ethereum };
        const web3 = new Web3(ethereum);

        // eth address set
        const address = ethereum.selectedAddress;
        const networkId = parseInt(ethereum.chainId, 16);

        if (
          state.host === API_HOST.PRODUCTION &&
          networkId !== NETWORK_ID.PRODUCTION
        ) {
          console.error("Please select the ethereum mainnet in the MetaMask");
          commit(
            "SET_ERROR_MSG",
            "Please select the ethereum mainnet in the MetaMask"
          );
          return false;
        } else if (
          state.host === API_HOST.STAGING &&
          networkId !== NETWORK_ID.STAGING
        ) {
          console.error("Please select the Ropsten testnet in the MetaMask");
          commit(
            "SET_ERROR_MSG",
            "Please select the Ropsten testnet in the MetaMask"
          );
          return false;
        }

        // dydx client set
        // TODO @ts-ignore because the dependent web3 library for v3-client is out of date
        const clientByWeb3 = new DydxClient(state.host, {
          // @ts-ignore
          web3,
          networkId,
        });

        // signature & api key set
        try {
          const starkPrivateKey = await clientByWeb3.onboarding.deriveStarkKey(
            address,
            SigningMethod.MetaMask
          );
          const apiKeyCredentials =
            await clientByWeb3.onboarding.recoverDefaultApiCredentials(
              address,
              SigningMethod.MetaMask
            );

          if (!apiKeyCredentials || !starkPrivateKey) return;
          const clientByApiKey = new DydxClient(state.host, {
            apiKeyCredentials,
            starkPrivateKey,
            networkId,
          });

          const { account } = await clientByApiKey.private.getAccount(address);

          commit("SET_ETH_ADDRESS", address);
          commit("SET_CLIENT", clientByApiKey);
          commit("SET_ACCOUNT", account);

          // order and position ws
          await dispatch("account/init");
          // market info
          await dispatch("market/init");
          // setting info
          await dispatch("setting/init");
        } catch (error) {
          console.log(error);
          commit("SET_ERROR_MSG", "Please install MetaMask");
          return false;
        }
      } else {
        commit("SET_ERROR_MSG", "Authentication failed");
        return false;
      }
      return true;
    },
    async initMarket({ commit, dispatch, state }, { market }: initMarketParam) {
      console.log("initMarket");
      if (!state.client) {
        return false;
      }

      const orderbookInitResult = await dispatch("orderbook/init", {
        market: market,
      });

      if (orderbookInitResult) {
        return true;
      } else {
        commit("SET_ERROR_MSG", "Failed to initialize marketInfo");
        return false;
      }
    },
  },
  modules: {
    market: MarketsStoreModule,
    order: OrderStoreModule,
    orderbook: OrderbookStoreModule,
    account: AccountStoreModule,
    setting: SettingStoreModule,
  },
  plugins: [
    createPersistedState({
      key: "dydx-extension-setting",
      paths: ["setting"],
      storage: window.localStorage,
    }),
  ],
});

export function useStore() {
  return baseUseStore(key);
}
