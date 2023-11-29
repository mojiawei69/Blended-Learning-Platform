import { AxiosApi } from "../AxiosApis";

export interface RoleEdit {
  name?: string;
  menus: number[];
}

export interface RoleQuery {
  name?: string;
}

export class role extends AxiosApi {
  constructor(){
    super("/api/role");
  }
}

export default new role();