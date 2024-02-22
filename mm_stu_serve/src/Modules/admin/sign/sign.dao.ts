import { DataSource, DeleteResult, InsertResult, SelectQueryBuilder, UpdateResult } from "typeorm";
import { PaginationQuery } from "../../index.type";
import { Sign, SignCreateDTO, SignQueryDTO, SignUpdateDTO } from "./sign.dto";
import { ToOrder } from "src/common/common";
import { StuSign } from "src/Entity/stu_sign.entity";
import * as moment from "moment";
import { UserSign } from "src/Entity/relation_user_sign.entity";

export class SignDAO {
  constructor(protected DataSource: DataSource){}

  public SignRepository = this.DataSource.getRepository(StuSign);

  public UserSignRepository = this.DataSource.getRepository(UserSign);

  public async SignListsPagination(SignQuery: PaginationQuery<SignQueryDTO>): Promise<StuSign[]> {

    const Order = ToOrder(SignQuery);
    const SelectQueryBuilder: SelectQueryBuilder<StuSign> = this.SignRepository.createQueryBuilder().select();

    return await SelectQueryBuilder
                                   .orderBy(SignQuery.prop, Order)
                                   .skip(SignQuery.limit * (SignQuery.offset - 1))
                                   .take(SignQuery.limit)
                                   .getMany();
  }

  public async CreateSign(CreateSign: SignCreateDTO): Promise<InsertResult> {
    const now = Date.now();
    const end = now + CreateSign.SignDuration * 60 * 1000;
    const result = await this.SignRepository
                             .createQueryBuilder()
                             .insert()
                             .into(StuSign)
                             .values({
                                name: CreateSign.SignTitle,
                                type: CreateSign.SignType,
                                cipher: CreateSign.SignType === Sign.Gestures ? CreateSign.SignCipher : '',
                                class: { id: CreateSign.classId },
                                course: { id: CreateSign.courseId },
                                teacher: { id: CreateSign.teacherId },
                                start: moment(now).format("YYYY-MM-DD hh:mm:ss"),
                                end: moment(end).format("YYYY-MM-DD hh:mm:ss")
                             }).execute();
    return result;
  }

  public async UpdateSignById(UpdateSign: SignUpdateDTO): Promise<UpdateResult> {

    const result = await this.SignRepository
                             .createQueryBuilder()
                             .update()
                             .set({
                            
                             })
                             .where("id = :id")
                             .setParameter("id", UpdateSign.id)
                             .execute();
    return result;
  }

  public async DeleteSignById(id: number) : Promise<DeleteResult> {

    const result = await this.SignRepository
                             .createQueryBuilder()
                             .delete()
                             .where("id = :id")
                             .setParameter("id", id)
                             .execute();
    return result;
  }

  public async Total() : Promise<number> {
    return await this.SignRepository
                                     .createQueryBuilder()
                                     .select()
                                     .getCount();
  }

  // 添加签到关联记录
  public async addUserSignRecord(student_id: number[], sign_id: number) {
    
    return await this.UserSignRepository
                     .createQueryBuilder()
                     .insert()
                     .values(
                       student_id.map( id => {
                         return {
                           successful: false,
                           sign: { id: sign_id },
                           student: { id: id }
                         }
                       })
                     )
                     .execute();
  }
}
