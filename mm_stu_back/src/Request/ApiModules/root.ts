import { AxiosApi } from "../AxiosApis";

export interface RootRegistDTO {
  username : string;
  password: string;
  bpassword: string;
  phone: string;
}

export interface RootLoginDTO {
  username : string;
  password : string;
}

export interface RootRole {
  id: number;
  name: string;
  routers: any[] | any;
}

export interface UserInfo {
  username: string,
  avatar: string,
  label: string,
  role: RootRole
}

export interface LoginResponseData {
  token: string;
  user: UserInfo
}

export interface RootInfoEdit {
  avatar: string;
  label: string;
  username: string;
}

export class root extends AxiosApi {
  constructor(){
    super("/api/root");
  }

  public regist(data : RootRegistDTO){
    return this.post("/regist", data);
  }

  public login(data : RootLoginDTO) {
    return this.post<RootLoginDTO,LoginResponseData>("/login", data);
  }
}

export default new root();