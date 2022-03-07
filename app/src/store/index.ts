import { createStore } from "vuex";
import Web3 from "web3";
import { DydxClient, Market, SigningMethod } from "@dydxprotocol/v3-client";
import { RootState, initMarketParam } from "@/store/types";
import { MarketsStoreModule } from "@/store/modules/market";
import { OrderbookStoreModule } from "@/store/modules/orderbook";

declare global {
  interface Window {
    ethereum: any;
  }
}

export default createStore<RootState>({
  state: {
    host: "https://api.dydx.exchange",
    ethAddress: "",
    client: undefined,
    account: undefined,
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
  },
  mutations: {
    SET_ETH_ADDRESS(state, ethAddress) {
      state.ethAddress = ethAddress;
    },
    SET_CLIENT(state, client) {
      state.client = client;
    },
    SET_ACCOUNT(state, account) {
      state.account = account;
    },
  },
  actions: {
    async initClient({ commit, state }) {
      console.log("initClient");

      if (window.ethereum) {
        await window.ethereum.enable();
        const web3 = new Web3(window.ethereum);

        // eth address set
        const addressList = await web3.eth.getAccounts();

        // dydx client set
        // TODO @ts-ignore because the dependent web3 library for v3-client is out of date
        const clientByWeb3 = new DydxClient(state.host, {
          // @ts-ignore
          web3,
        });

        // signature & api key set
        try {
          const starkPrivateKey = await clientByWeb3.onboarding.deriveStarkKey(
            addressList[0],
            SigningMethod.MetaMask
          );
          const apiKeyCredentials =
            await clientByWeb3.onboarding.recoverDefaultApiCredentials(
              addressList[0],
              SigningMethod.MetaMask
            );

          if (!apiKeyCredentials || !starkPrivateKey) return;
          const clientByApiKey = new DydxClient(state.host, {
            apiKeyCredentials,
            starkPrivateKey,
          });

          const { account } = await clientByApiKey.private.getAccount(
            addressList[0]
          );

          commit("SET_ETH_ADDRESS", addressList[0]);
          commit("SET_CLIENT", clientByApiKey);
          commit("SET_ACCOUNT", account);
        } catch (error) {
          console.log(error);
        }
      }
    },
    async initMarket({ commit, dispatch, state }, { market }: initMarketParam) {
      console.log("initMarket");
      if (!state.client) return;

      dispatch("market/init", { market: market });
      dispatch("orderbook/init", { market: market });
    },
  },
  modules: {
    market: MarketsStoreModule,
    orderbook: OrderbookStoreModule,
  },
});
