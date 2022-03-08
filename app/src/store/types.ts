import {
  DydxClient,
  AccountResponseObject,
  OrderSide,
  Market,
  MarketResponseObject,
} from "@dydxprotocol/v3-client";
import { DydxOrderBook } from "@/store/lib/ws/orderbook";

export interface RootState {
  host: string;
  ethAddress: string;
  client?: DydxClient;
  account?: AccountResponseObject;
}

export interface MarketsState {
  marketInfo?: MarketResponseObject;
}

export interface initMarketParam {
  market: Market;
}

export interface OrderState {}

export interface OrderbookState {
  dydxOrderBook?: DydxOrderBook;
  isConnected: boolean;
  symbol?: Market;
  bestAskPrice?: number;
  bestBidPrice?: number;
}

export interface MarketOrderParam {
  market: Market;
  side: OrderSide;
  size: number;
}
