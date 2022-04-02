import {
  DydxClient,
  AccountResponseObject,
  OrderSide,
  Market,
  MarketResponseObject,
  TimeInForce,
  MarketsResponseObject,
} from "@dydxprotocol/v3-client";
import { Account } from "@/store/lib/ws/account";
import { DydxOrderBook } from "@/store/lib/ws/orderbook";

export enum API_HOST {
  PRODUCTION = "https://api.dydx.exchange",
  STAGING = "https://api.stage.dydx.exchange",
}

export enum WS_HOST {
  PRODUCTION = "wss://api.dydx.exchange/v3/ws",
  STAGING = "wss://api.stage.dydx.exchange/v3/ws",
}

export enum NETWORK_ID {
  PRODUCTION = 1,
  STAGING = 3,
}

export interface RootState {
  host: API_HOST;
  hostWs: WS_HOST;
  ethAddress: string;
  client?: DydxClient;
  account?: AccountResponseObject;
  errorMsg: string;
}

export interface MarketsState {
  marketInfoAll?: MarketsResponseObject;
}

export interface initMarketParam {
  market: Market;
}

// eslint-disable-next-line
export interface OrderState {}

export interface OrderbookState {
  dydxOrderBook?: DydxOrderBook;
  isConnected: boolean;
  symbol?: Market;
  bestAskPrice?: number;
  bestBidPrice?: number;
}

export interface AccountState {
  account?: Account;
  orders: { [id: string]: any };
  positions: { [id: string]: any };
  isConnected: boolean;
}

export interface SettingState {
  settings: { [symbol: string]: any };
  defaultSettings: { [symbol: string]: any };
}

export interface MarketOrderParam {
  market: Market;
  side: OrderSide;
  size: number;
}

export interface LimitOrderParam {
  market: Market;
  side: OrderSide;
  size: number;
  price: number;
  postOnly: boolean;
  timeInForce: TimeInForce;
  expireSecond: number;
}

export interface CancelAllParam {
  market?: Market;
}

export interface CancelParam {
  orderId: string;
}

export interface SaveSettingParam {
  market: Market;
  setValue: number[];
}
