import { AxiosRequestConfig, AxiosResponse } from "axios";
import HttpRequest from "./Request";

// 服务端统一返回格式
export type ServerData<T> = {
  data: T;
  message: string;
  code: number
}

// 服务端返回的数据data
export class AxiosApi {
  protected prefix?: string;
  constructor(pre: string){
    this.prefix = pre;
  }

  protected get<D = any, T = any>(url: string, params?: D, config?: AxiosRequestConfig<any>): Promise<AxiosResponse<ServerData<T>, any>> {
    config = config ?? {};
    return HttpRequest().get(this.prefix + url, Object.assign(config, { params : params }));
  }

  protected post<D = any, T = any>(url: string, data?: D, config?: AxiosRequestConfig<any>): Promise<AxiosResponse<ServerData<T>, any>> {
    return HttpRequest().post(this.prefix + url, data, config);
  }

  protected put<D = any, T = any>(url: string, data?: D, config?: AxiosRequestConfig<any>): Promise<AxiosResponse<ServerData<T>, any>> {
    return HttpRequest().put(this.prefix + url, data, config);
  }

  protected delete<D = any, T = any>(url: string, params?: D, config?: AxiosRequestConfig<any>): Promise<AxiosResponse<ServerData<T>, any>> {
    config = config ?? {};
    return HttpRequest().delete(this.prefix + url, Object.assign(config, { params : params }));
  }
}