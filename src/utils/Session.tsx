export namespace Session {
  export interface Info {
    sessionType: Type;
    roomId: string;
    userName: string;
  }

  export enum Type {
    HOST,
    CANDIDATE,
  }
}
