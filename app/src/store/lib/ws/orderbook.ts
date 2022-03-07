import { DydxClient, Market } from "@dydxprotocol/v3-client";

const WS_HOST = "wss://api.dydx.exchange/v3/ws";

export enum RequestMethod {
  POST = "POST",
  PUT = "PUT",
  GET = "GET",
  DELETE = "DELETE",
}

enum ORDER_BOOK_VALUE {
  PRICE,
  SIZE,
  UPDATE_TIME,
}

class DydxOrderBook {
  orderbook: {
    bids: [size: number, size: number, updateTime: number][];
    asks: [size: number, size: number, updateTime: number][];
  };
  client: DydxClient;
  symbol: Market;
  updateCallback: () => void;
  isConnected: boolean;
  maxDepth: number;

  constructor(
    client: DydxClient,
    maxDepth: number,
    symbol: Market,
    updateCallback: () => void
  ) {
    this.client = client;
    this.symbol = symbol;
    this.maxDepth = maxDepth;
    this.orderbook = { bids: [], asks: [] };
    this.updateCallback = updateCallback;
    this.isConnected = false;
  }

  public async start() {
    await this.connect(this.client, this.symbol);
  }

  public get bestPrice() {
    return {
      ask: this.orderbook.asks.length ? this.orderbook.asks[0] : [],
      bid: this.orderbook.bids.length ? this.orderbook.bids[0] : [],
    };
  }

  private async initOrderBook(contents: {
    bids: [{ price: string; size: string; offset: string }];
    asks: [{ price: string; size: string; offset: string }];
  }) {
    const orderbook: {
      bids: [size: number, size: number, updateTime: number][];
      asks: [size: number, size: number, updateTime: number][];
    } = { bids: [], asks: [] };
    contents.asks.forEach((ask) => {
      if (Number(ask.size) !== 0) {
        orderbook.asks.push([
          Number(ask.price),
          Number(ask.size),
          Number(ask.offset),
        ]);
      }
    });
    contents.bids.forEach((bid) => {
      if (Number(bid.size) !== 0) {
        orderbook.asks.push([
          Number(bid.price),
          Number(bid.size),
          Number(bid.offset),
        ]);
      }
    });

    this.orderbook = orderbook;
  }

  private async updateOrderBook(contents: {
    offset: string;
    bids: [];
    asks: [];
  }) {
    const orderbook = { ...this.orderbook };
    const offset = Number(contents.offset);

    // ask
    let askMinPrice = Number.MAX_VALUE;
    contents.asks.forEach((ask) => {
      const price = Number(ask[0]);
      const size = Number(ask[1]);

      const targetIndex = orderbook.asks.findIndex(
        (ask) => ask[ORDER_BOOK_VALUE.PRICE] === price
      );

      if (size === 0) {
        // delete
        if (targetIndex !== -1) {
          if (
            orderbook.asks[targetIndex][ORDER_BOOK_VALUE.UPDATE_TIME] < offset
          ) {
            orderbook.asks.splice(targetIndex, 1);
          }
        }
      } else {
        if (targetIndex !== -1) {
          // replace
          if (
            orderbook.asks[targetIndex][ORDER_BOOK_VALUE.UPDATE_TIME] < offset
          ) {
            orderbook.asks.splice(targetIndex, 1, [price, size, offset]);
          }
        } else {
          // insert
          orderbook.asks.push([price, size, offset]);
        }
      }

      if (size !== 0 && askMinPrice > price) {
        askMinPrice = price;
      }
    });

    // bid
    let bidMaxPrice = 0;
    contents.bids.forEach((bid) => {
      const price = Number(bid[0]);
      const size = Number(bid[1]);

      const targetIndex = orderbook.bids.findIndex(
        (bid) => bid[ORDER_BOOK_VALUE.PRICE] === price
      );

      if (size === 0) {
        // delete
        if (targetIndex !== -1) {
          if (
            orderbook.bids[targetIndex][ORDER_BOOK_VALUE.UPDATE_TIME] < offset
          ) {
            orderbook.bids.splice(targetIndex, 1);
          }
        }
      } else {
        if (targetIndex !== -1) {
          // replace
          if (
            orderbook.bids[targetIndex][ORDER_BOOK_VALUE.UPDATE_TIME] < offset
          ) {
            orderbook.bids.splice(targetIndex, 1, [price, size, offset]);
          }
        } else {
          // insert
          orderbook.bids.push([price, size, offset]);
        }
      }

      if (size !== 0 && bidMaxPrice < price) {
        bidMaxPrice = price;
      }
    });

    // sort
    orderbook.asks.sort(
      (a, b) => a[ORDER_BOOK_VALUE.PRICE] - b[ORDER_BOOK_VALUE.PRICE]
    );
    orderbook.bids.sort(
      (a, b) => b[ORDER_BOOK_VALUE.PRICE] - a[ORDER_BOOK_VALUE.PRICE]
    );

    // fix
    if (orderbook.bids.length && orderbook.asks.length) {
      const askValidOrderIndex = orderbook.asks.findIndex(
        (ask) => ask[ORDER_BOOK_VALUE.PRICE] > bidMaxPrice
      );
      const bidValidOrderIndex = orderbook.bids.findIndex(
        (bid) => bid[ORDER_BOOK_VALUE.PRICE] < askMinPrice
      );
      orderbook.asks.splice(0, askValidOrderIndex);
      orderbook.bids.splice(0, bidValidOrderIndex);
    }

    // trim
    orderbook.asks.splice(this.maxDepth);
    orderbook.bids.splice(this.maxDepth);

    this.orderbook = orderbook;

    this.isConnected = true;
  }

  private async connect(client: DydxClient, symbol: Market) {
    const msg = {
      type: "subscribe",
      channel: "v3_orderbook",
      id: symbol,
      includeOffsets: true,
    };

    const ws = new WebSocket(WS_HOST);

    ws.onopen = () => {
      console.log("orderbook ws open");
      ws.send(JSON.stringify(msg));
    };

    ws.onmessage = (message) => {
      const data = JSON.parse(message.data);
      if (data.type == "subscribed") {
        this.initOrderBook(data.contents);
      } else if (data.type == "channel_data") {
        this.updateOrderBook(data.contents);
      } else {
        console.log(data);
      }
      this.updateCallback();
    };

    ws.onerror = (error) => {
      console.log("orderbook ws error");
      console.log(error);
      ws.close();
      this.isConnected = false;
      this.updateCallback();
    };

    ws.onclose = () => {
      console.log("orderbook ws closed");
      this.isConnected = false;
      // 3s wait and reconnect
      setTimeout(() => {
        this.connect(this.client, this.symbol);
      }, 3000);
      this.updateCallback();
    };
  }
}

export { ORDER_BOOK_VALUE, DydxOrderBook };
