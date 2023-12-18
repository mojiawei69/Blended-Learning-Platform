export class WXClientShopQueryDTO {
  id?: number;
  classify_id?: number;
}

export class OrderCreateDTO {
  shops: {
    id: number,
    prices: number,
    count: number
  }[]
  status: string;
  openid: string;
}