import {Injectable} from '@angular/core';
import {AppSettings} from "../../../AppSettings";
var SockJs = require("sockjs-client");
var Stomp = require("stompjs");
@Injectable({
  providedIn: 'root'
})
export class WebSocketService {
  constructor() { }
  public connect() {
    let socket = new SockJs(AppSettings.API_ENDPOINT +":"+ AppSettings.PORT+`/socket`);
    return Stomp.over(socket);
  }
}
