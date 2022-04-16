import { WS_HOST } from "@/store/types";
import { DydxClient } from "@dydxprotocol/v3-client";

export enum RequestMethod {
  POST = "POST",
  PUT = "PUT",
  GET = "GET",
  DELETE = "DELETE",
}

class Markets {
  client: DydxClient;
  host: WS_HOST;
  updateCallback: () => void;
  isConnected: boolean;
  markets: { [id: string]: any };

  constructor(host: WS_HOST, client: DydxClient, updateCallback: () => void) {
    this.host = host;
    this.client = client;
    this.markets = {};
    this.updateCallback = updateCallback;
    this.isConnected = false;
  }

  public async start() {
    await this.connect(this.client);
  }

  private async initMarkets(contents: any) {
    // pass
  }

  private async updateMarkets(contents: any) {
    this.isConnected = true;

    Object.keys(contents).forEach((symbol) => {
      Object.keys(contents[symbol]).forEach((param) => {
        if (!this.markets[symbol]) {
          this.markets[symbol] = contents[symbol];
        }
        this.markets[symbol][param] = contents[symbol][param];
      });
    });
  }

  private async connect(client: DydxClient) {
    const { markets } = await client.public.getMarkets();
    this.markets = markets;

    const msg = {
      type: "subscribe",
      channel: "v3_markets",
    };

    const ws = new WebSocket(this.host);

    ws.onopen = () => {
      console.log("markets ws open");
      ws.send(JSON.stringify(msg));
    };

    ws.onmessage = (message) => {
      const data = JSON.parse(message.data);
      if (data.type == "subscribed") {
        this.initMarkets(data.contents);
      } else if (data.type == "channel_data") {
        this.updateMarkets(data.contents);
      } else {
        console.log(data);
      }

      this.updateCallback();
    };

    ws.onerror = (error) => {
      console.log("markets ws error");
      console.log(error);
      ws.close();
      this.isConnected = false;
      this.updateCallback();
    };

    ws.onclose = () => {
      console.log("markets ws closed");
      this.isConnected = false;
      // 3s wait and reconnect
      setTimeout(() => {
        this.connect(this.client);
      }, 3000);
      this.updateCallback();
    };
  }
}

export { Markets };
