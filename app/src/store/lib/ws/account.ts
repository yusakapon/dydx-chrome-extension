import { WS_HOST } from "@/store/types";
import {
  DydxClient,
  PositionStatus,
  OrderStatus,
  AccountResponseObject,
} from "@dydxprotocol/v3-client";

export enum RequestMethod {
  POST = "POST",
  PUT = "PUT",
  GET = "GET",
  DELETE = "DELETE",
}

class Account {
  client: DydxClient;
  host: WS_HOST;
  account: AccountResponseObject;
  updateCallback: () => void;
  isConnected: boolean;
  positions: { [id: string]: any };
  orders: { [id: string]: any };
  positionId: string;

  constructor(
    host: WS_HOST,
    client: DydxClient,
    account: AccountResponseObject,
    updateCallback: () => void
  ) {
    this.host = host;
    this.client = client;
    this.account = account;
    this.orders = {};
    this.positions = {};
    this.positionId = "";
    this.updateCallback = updateCallback;
    this.isConnected = false;
  }

  public async start() {
    await this.connect(this.client);
  }

  private async initAccount(contents: {
    orders?: [any];
    account?: {
      starkKey?: string;
      positionId?: string;
      equity?: string;
      freeCollateral?: string;
      pendingDeposits?: string;
      pendingWithdrawals?: string;
      openPositions?: any;
      accountNumber?: string;
      id?: string;
      quoteBalance?: string;
      createdAt?: string;
    };
    transfers?: [any];
    fundingPayments?: [any];
  }) {
    // orders
    if (contents.orders) {
      contents.orders.forEach((order) => {
        this.orders[order.id] = order;
      });
    }
    // position
    if (contents.account?.openPositions) {
      Object.values(contents.account.openPositions).forEach((position: any) => {
        if (this.positions[position.market]) {
          this.positions[position.market][position.side] = position;
        } else {
          this.positions[position.market] = { [position.side]: position };
        }
      });
    }

    // positionId
    if (contents.account?.positionId) {
      this.positionId = contents.account.positionId;
    }

    this.isConnected = true;
  }

  private async updateAccount(contents: {
    fills?: [any];
    positions?: [any];
    orders?: [any];
    accounts?: [any];
    transfers?: [any];
    fundingPayments?: [any];
  }) {
    this.isConnected = true;

    if (contents.orders) {
      contents.orders.forEach((order) => {
        if (order.status == OrderStatus.CANCELED) {
          delete this.orders[order.id];
        } else if (order.status == OrderStatus.FILLED) {
          delete this.orders[order.id];
        } else if (order.status == OrderStatus.OPEN) {
          this.orders[order.id] = order;
        } else if (order.status == OrderStatus.PENDING) {
          this.orders[order.id] = order;
        } else if (order.status == OrderStatus.UNTRIGGERED) {
          this.orders[order.id] = order;
        }
      });
    }

    if (contents.positions && contents.positions.length) {
      contents.positions.forEach((position) => {
        if (position.status == PositionStatus.CLOSED) {
          if (this.positions[position.market]) {
            delete this.positions[position.market][position.side];
          }
        } else if (position.status == PositionStatus.LIQUIDATED) {
          if (this.positions[position.market]) {
            delete this.positions[position.market][position.side];
          }
        } else {
          if (this.positions[position.market]) {
            this.positions[position.market][position.side] = position;
          } else {
            this.positions[position.market] = { [position.side]: position };
          }
        }
      });
    }
  }

  private async connect(client: DydxClient) {
    const timestamp = new Date().toISOString();
    const signature = client.private.sign({
      requestPath: "/ws/accounts",
      method: RequestMethod.GET,
      isoTimestamp: timestamp,
    });
    const msg = {
      type: "subscribe",
      channel: "v3_accounts",
      accountNumber: this.account.accountNumber,
      apiKey: client.apiKeyCredentials?.key,
      signature,
      timestamp,
      passphrase: client.apiKeyCredentials?.passphrase,
    };

    const ws = new WebSocket(this.host);

    ws.onopen = () => {
      console.log("account ws open");
      ws.send(JSON.stringify(msg));
    };

    ws.onmessage = (message) => {
      const data = JSON.parse(message.data);
      if (data.type == "subscribed") {
        this.initAccount(data.contents);
      } else if (data.type == "channel_data") {
        this.updateAccount(data.contents);
      } else {
        console.log(data);
      }
      this.updateCallback();
    };

    ws.onerror = (error) => {
      console.log("account ws error");
      console.log(error);
      ws.close();
      this.isConnected = false;
      this.updateCallback();
    };

    ws.onclose = () => {
      console.log("account ws closed");
      this.isConnected = false;
      // 3s wait and reconnect
      setTimeout(() => {
        this.connect(this.client);
      }, 3000);
      this.updateCallback();
    };
  }
}

export { Account };
