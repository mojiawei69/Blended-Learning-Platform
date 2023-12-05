import { StuInfo } from "src/Entity/stu_info.entity";
import { DataSource, DeleteResult, InsertResult, SelectQueryBuilder, UpdateResult } from "typeorm";
import { PaginationQuery } from "../index.type";
import { StuCreateDTO, StuQueryDTO, StuUpdateDTO } from "./stu.dto";
import { ToOrder } from "src/common/common";

export class StuDAO {
  constructor(protected DataSource: DataSource){}

  public StuRepository = this.DataSource.getRepository(StuInfo);

  public async StuListsPagination(StuQuery: PaginationQuery<StuQueryDTO>): Promise<StuInfo[]> {

    const Order = ToOrder(StuQuery);
    const SelectQueryBuilder: SelectQueryBuilder<StuInfo> = this.StuRepository.createQueryBuilder().select();

    if(StuQuery.class_id) {
      SelectQueryBuilder
                        .andWhere("class_id = :class_id")
                        .setParameter("class_id", StuQuery.class_id)
    }

    return await SelectQueryBuilder
                                   .orderBy(StuQuery.prop, Order)
                                   .skip(StuQuery.limit * (StuQuery.offset - 1))
                                   .take(StuQuery.limit)
                                   .getMany();
  }

  public async CreateStu(CreateStu: StuCreateDTO): Promise<InsertResult> {

    const result = await this.StuRepository
                             .createQueryBuilder()
                             .insert()
                             .into(StuInfo)
                             .values({
                                remark: CreateStu.remark,
                                student: CreateStu.student,
                                school: CreateStu.school,
                                name: CreateStu.name,
                                age: CreateStu.age,
                                avatar: CreateStu.avatar,
                                year: CreateStu.year,
                                class: {
                                  id: CreateStu.class_id
                                },
                                gender: CreateStu.gender,
                                native: CreateStu.native
                             })
                             .execute();
    return result;
  }

  public async UpdateStuById(UpdateStu: StuUpdateDTO): Promise<UpdateResult> {

    const result = await this.StuRepository
                             .createQueryBuilder()
                             .update()
                             .set({
                                remark: UpdateStu.data.remark,
                                student: UpdateStu.data.student,
                                school: UpdateStu.data.school,
                                name: UpdateStu.data.name,
                                age: UpdateStu.data.age,
                                avatar: UpdateStu.data.avatar,
                                year: UpdateStu.data.year,
                                class: {
                                  id: UpdateStu.data.class_id
                                },
                                gender: UpdateStu.data.gender,
                                native: UpdateStu.data.native
                             })
                             .where("id = :id")
                             .setParameter("id", UpdateStu.id)
                             .execute();
    return result;
  }

  public async DeleteStuById(id: number) : Promise<DeleteResult> {

    const result = await this.StuRepository
                             .createQueryBuilder()
                             .delete()
                             .where("id = :id")
                             .setParameter("id", id)
                             .execute();
    return result;
  }



  public async Total() : Promise<number> {
    return await this.StuRepository
                                     .createQueryBuilder()
                                     .select()
                                     .getCount();
  }
}
