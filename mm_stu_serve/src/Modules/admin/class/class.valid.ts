import * as Joi from "joi";
import { ClassCreateDTO, ClassUpdateDTO, UpdateClassTableDTO } from "./class.dto";
import { NotAcceptableException } from "@nestjs/common";


export const ClassCreateValid = Joi.object<ClassCreateDTO>({
  name: Joi.string().required().error(new NotAcceptableException("班级名称不能为空")),
  college_id: Joi.number().required().error(new NotAcceptableException("学院id不能为空")),
  remark: Joi.string(),
  code: Joi.string().required().error(new NotAcceptableException("班级编码不能为空")),
})

export const ClassUpdateValid = Joi.object<ClassUpdateDTO>({
  id: Joi.number().required().error(new NotAcceptableException("id不能为空")),
  data: ClassCreateValid
})

export const ClassTableValid = Joi.object<{ id: number }>({
  id: Joi.number().required().error(new NotAcceptableException("id不能为空"))
})

export const UpdateClassTableValid = Joi.object<UpdateClassTableDTO>({
  json: Joi.string(),
  teacher_id: Joi.number().required().error(new NotAcceptableException("teacher_id不能为空")),
  course_id: Joi.number().required().error(new NotAcceptableException("course_id不能为空")),
  class_id: Joi.number().required().error(new NotAcceptableException("class_id不能为空")),
})