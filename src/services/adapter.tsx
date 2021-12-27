import { getWSService } from './webSocket.js';

let AdapterService: Adapter | null = null;

class Adapter {

  private socketConnection : WebSocket | null
  constructor(){
    this.socketConnection = null;
  }

  createGame = (name: string, password:string|null): boolean => { 
    const gameData = {
        name,
        password
    }  
    this.socketConnection = getWSService();

    const timeout = setTimeout(() => {
        if(this.socketConnection){
            getWSService().sendMessage("createGame", gameData);
        }
    }, 2000);
    return true;
  }

  joinGame = (name: string, password:string|null): boolean => { 
    const gameData = {
        name,
        password
    }  
    this.socketConnection = getWSService();

    const timeout = setTimeout(() => {
        if(this.socketConnection){
            getWSService().sendMessage("joinGame", gameData);
        }
    }, 2000);
    return true;
  }

  changeNickname = (nickname: string, gameID: string | null) : boolean => {
    const gameData = {
      nickname,
      gameID
    }  
    this.socketConnection = getWSService();

    const timeout = setTimeout(() => {
        if(this.socketConnection){
            getWSService().sendMessage("changeNickname", gameData);
        }
    }, 2000);
    return true;
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