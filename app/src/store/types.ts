import {
  DydxClient,
  AccountResponseObject,
  OrderSide,
  Market,
} from "@dydxprotocol/v3-client";
import {
  DydxOrderBook,
  ORDER_BOOK_VALUE as DYDX_BOOK_VALUE,
} from "@/store/lib/ws/orderbook";

export interface RootState {
  host: string;
  ethAddress: string;
  client?: DydxClient;
  account?: AccountResponseObject;
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
  size: string;
}

export interface initOrderbookParam {
  market: Market;
}
