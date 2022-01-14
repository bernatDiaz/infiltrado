import { getWSService, initializeWebsocket, websocketInitialized } from './webSocket';

let AdapterService: Adapter | null = null;

class Adapter {

  private socketConnection : WebSocket | null
  constructor(){
    this.socketConnection = null;
  }

  createGame = (name: string, password:string|null) => { 
    const data = {
        name,
        password
    } 
    this.sendMessage("createGame", data); 
  }

  joinGame = (name: string, password:string|null) => { 
    const data = {
        name,
        password
    }  
    this.sendMessage("joinGame", data);
  }

  changeNickname = (nickname: string, gameID: string | null) => {
    const data = {
      nickname,
      gameID
    }  
    this.sendMessage("changeNickname", data);
  }

  startPlaying = (gameID: string | null) =>{
    const data = {
      gameID
    }

    this.sendMessage("requestWords", data);
  }

  choseRolesAndWord = (gameID: string | null) =>{
    const data = {
      gameID
    }

    this.sendMessage("choseRolesAndWord", data);
  }

  sendWords = (words: string[], gameID: string) =>{
    const data = {
      words,
      gameID
    }

    this.sendMessage("addWords", data);
  }

  sayWord = (word: string, gameID: string) => {
    const data = {
      word,
      gameID
    }

    this.sendMessage("sayWord", data);
  }

  sendMessage = (route: string, data: object) => {
    if(!websocketInitialized()){
      initializeWebsocket();
      const interval = setInterval(()=>{
        if(websocketInitialized()){
          clearInterval(interval);
          getWSService().sendMessage(route, data);
        }
      }, 200);
    }
    else{
      getWSService().sendMessage(route, data);
    }
  }
  

  static initAdapterService = (): Adapter => {
    if(!AdapterService){
      AdapterService = new Adapter();
      return AdapterService;
    }    
    return AdapterService;
  }
}

export const getAdapterService = Adapter.initAdapterService;