import { createStore } from "vuex";
import Web3 from "web3";
import { DydxClient, SigningMethod } from "@dydxprotocol/v3-client";

declare global {
  interface Window {
    ethereum: any;
  }
}

export interface State {
  host: string;
  ethAddress: string;
  client?: DydxClient;
}

export default createStore<State>({
  state: {
    host: "https://api.dydx.exchange",
    ethAddress: "",
    client: undefined,
  },
  getters: {
    ethAddress: (state) => {
      return state.ethAddress;
    },
    client: (state) => {
      return state.client;
    },
  },
  mutations: {
    SET_ETH_ADDRESS(state, ethAddress) {
      state.ethAddress = ethAddress;
    },
    SET_CLIENT(state, client) {
      state.client = client;
    },
  },
  actions: {
    async initClient({ commit, state }) {
      console.log("initClient");

      if (window.ethereum) {
        await window.ethereum.enable();
        const web3 = new Web3(window.ethereum);

        // eth address set
        const accounts = await web3.eth.getAccounts();

        // dydx client set
        // TODO @ts-ignore because the dependent web3 library for v3-client is out of date
        const clientByWeb3 = new DydxClient(state.host, {
          // @ts-ignore
          web3,
        });

        // signature & api key set
        try {
          const starkPrivateKey = await clientByWeb3.onboarding.deriveStarkKey(
            accounts[0],
            SigningMethod.MetaMask
          );
          const apiKeyCredentials =
            await clientByWeb3.onboarding.recoverDefaultApiCredentials(
              accounts[0],
              SigningMethod.MetaMask
            );

          if (!apiKeyCredentials || !starkPrivateKey) return;
          const clientByApiKey = new DydxClient(state.host, {
            apiKeyCredentials,
            starkPrivateKey,
          });

          commit("SET_ETH_ADDRESS", accounts[0]);
          commit("SET_CLIENT", clientByApiKey);
        } catch (error) {
          console.log(error);
        }
      }
    },
  },
  modules: {},
});
