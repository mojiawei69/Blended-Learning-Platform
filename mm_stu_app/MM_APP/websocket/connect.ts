import SocketIO, { Socket } from "socket.io-client";
import { url } from "../request/env.";

export interface SocketConnectData {
  type: "student" | "teacher";
  id: number;
  devices_id: string | null;
}

export interface EmitEvent {
  // App端学生进行签到事件
  APP_STUDENT_SIGN: { 
    signId: number;
    studentId: number;
    classId: number;
  }
}

export interface OnEvent {

}

export class SocketManager {

  private baseUrl = `ws://${url}:8082`;

  public SocketInstance: Socket;

  constructor( data: SocketConnectData) {

    this.SocketInstance = SocketIO(`${this.baseUrl}?data=${JSON.stringify(data)}`);
    
  }

  public emit<T extends keyof EmitEvent>(event: T, data: EmitEvent[T]) {
    this.SocketInstance.emit(event, data);
  }

  public on<T extends keyof OnEvent>(event: T, callBack: 
                                                        T extends "connect" | "connect_error" | "disconnect" ? 
                                                          never : 
                                                          T extends string ? (data: OnEvent[T]) => void : never) {
    this.SocketInstance.on(event, callBack);
  }
}

