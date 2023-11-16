import { Check, Column, Entity, JoinColumn, JoinTable, ManyToMany, OneToMany, OneToOne } from "typeorm";
import { BaseAttrColumn } from "./BaseAttrColumn";
import { StuInfo } from "./stu_info.entity";
import { StuTeacher } from "./stu_teacer.entity";
import { UserSign } from "./user_sign.entity";
import { StuExam } from "./stu_exam.entity";
import { ClassCourseTeacher } from "./teacher_course_class.entity";

@Entity("mm_stu_app_user")
@Check(`("type" = 'student' AND "student_id" IS NOT NULL AND "teacher_id" IS NULL) OR ("type" = 'teacher' AND "teacher_id" IS NOT NULL AND "student_id" IS NULL)`)
export class AppUser extends BaseAttrColumn {

  @Column({type: "char", length: 255, comment: "用户名"})
  username: string;

  @Column({type: "char", length: 255, comment: "密码"})
  password: string;

  @Column({type: "char", length: 255, comment: "头像"})
  avatar: string;

  @Column({type: "char", length: 255, comment: "标签"})
  label: string;

  @Column({ type: 'enum', enum: ['student', 'teacher'], comment: "用户类型" })
  type: 'student' | 'teacher';

  @OneToOne(type => StuInfo, { nullable: true })
  @JoinColumn({ name: "student" ,referencedColumnName: "student"})
  student: StuInfo;

  @OneToOne(type => StuTeacher, { nullable: true })
  @JoinColumn({ name: "teacher"})
  teacher: StuTeacher;

  @OneToMany(type => UserSign, UserSign => UserSign.id)
  signs: UserSign[];

  @ManyToMany(type => StuExam, StuExam => StuExam.id)
  @JoinTable({
    name: "mm_stu_user_exam",
    joinColumn: {
      name: "user_id",
      referencedColumnName: "id"
    },
    inverseJoinColumn: {
      name: "exam_id",
      referencedColumnName: "id"
    }
  })
  exames: StuExam[]
}