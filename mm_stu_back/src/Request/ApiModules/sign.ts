import { Sign } from "@/views/teacher";
import { AxiosApi } from "../AxiosApis";

export interface SignCreate extends SignBase {
  SignType: Sign,
  SignDuration: number;
  SignTitle: string;
  SignCipher: string | null;
}

export interface SignBase {
  classId: number,
  courseId: number;
  teacherId: number;
}

export class sign extends AxiosApi {
  constructor(){
    super("/api/sign");
  }

  public async create(data: SignCreate) {
    return this.post("/create", data);
  }

  public async getTTL(data: SignBase) {
    return this.post("/ttl",  data);
  }

}

export default new sign();