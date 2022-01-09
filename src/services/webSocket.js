import WebSocket from 'isomorphic-ws';

const WS_URL = "wss://bzbl6djxtc.execute-api.eu-west-1.amazonaws.com/dev" || "";

let WSService = null;

class WebSocketService {

  constructor() {    
    this.websocket = null;
    this.messageListeners = [];
    this.isOpen = false;
  }

  /**
   *  Set up WebSocket connection for a new user and
   *  basic listeners to handle events
   */
  initSocket = () => {    
    this.websocket = new WebSocket(WS_URL);
    this.websocket.onopen = this.onConnOpen;
    this.websocket.onmessage = this.onMessage;
    this.websocket.onclose = this.onConnClose;
  }

  /**
   *  Show connection status to user
   */
  onConnOpen = () => {
    this.isOpen = true;
    console.log('Websocket connected!');   
  }

  /**
   *  Log lost connection for now
   */
  onConnClose = () => {
    console.log('Websocket closed!');
  }

  /**
   *  Used by application to send message to the WebSocket API Gateway
   *  @param routeKey The route key for WebSocket API Gateway
   *  @param message String message
   *  message {
   *    room,
   *    type,
   *    msg,
   *    username,
   *    for
   *  }
   */
  sendMessage = (routeKey, message) => {    
    if(this.websocket && this.isOpen){
      this.websocket.send(JSON.stringify({
        action: routeKey,
        message: message
      }));
    }else{      
      console.log(`Websocket connection not found!!`);
    }    
  }

  /**
   *  Used by application to register different listeners for 
   *  different message types [To be used later]
   *  @param room Room name
   *  @param type Message type ['all', 'pm']
   *  @param listener Function to handle message type
   */
  addMessageListener = (action, listener) => {    
    if (!action || typeof listener !== 'function') {
      return;
    }
    this.messageListeners.push({
      action,
      listener
    });
  }

  removeMessageListener = (action) => {
    console.log("removeMessageListener before", this.messageListeners);
    this.messageListeners = this.messageListeners.filter(ml => ml.action !== action);
    console.log("removeMessageListener after", this.messageListeners);
  }

  /**
   * Handler that receives the actual messages from the WebSocket API
   * For now it simply returns the parsed message body
   * @param data Message body received from WebSocket 
   */
  onMessage = (data) => {
    if (data) {
      const message = JSON.parse(data.data); 
      console.log("data.data",message);   
      const Listener = this.messageListeners.find(listener => listener.action === message.action);

      if (Listener && typeof Listener.listener === "function") {      
        Listener.listener(message);
      } else {
        console.log('No handler found for message type');
      }
    }
  }

  static initialize(){
    if(!WSService){
      WSService = new WebSocketService();
    }
    WSService.initSocket();
  }

  static isInitialized(){
    if(!WSService){
      return false;
    }
    return true;
  }

  static initWSService() {    
    if (!WSService) {      
      WSService = new WebSocketService();
      WSService.initSocket();
      return WSService;
    }
    
    return WSService;
  }

}

/*export const WSS = {
  getWSService: WebSocketService.initWSService,
  isInitialized: WebSocketService.isInitialized,
  initialize: WebSocketService.initialize,
};*/
export const getWSService = WebSocketService.initWSService;
export const websocketInitialized = WebSocketService.isInitialized;
export const initializeWebsocket = WebSocketService.initialize;