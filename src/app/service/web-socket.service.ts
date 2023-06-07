import {Injectable} from '@angular/core';
import {AppSettings} from "../../../AppSettings";
var SockJs = require("sockjs-client");
var Stomp = require("stompjs");
@Injectable({
  providedIn: 'root'
})
export class WebSocketService {
  public stompClient: any;
  constructor() { }
  public connect() {
    let socket = new SockJs(AppSettings.API_ENDPOINT +":"+ AppSettings.PORT+`/socket`);
    this.stompClient = Stomp.over(socket);
    return this.stompClient;
  }
  public disconnect(){
    if (this.stompClient) {
      this.stompClient.disconnect();
    }
  }
  errorCallBack() {
    setTimeout(() => {
      this.connect();
    }, 5000);
  }
  send(message:any) {
    this.stompClient.send("/app/hello", {}, JSON.stringify(message));
  }

  onMessageReceived() {
  }
}
