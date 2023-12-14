import { Controller, BadRequestException, Get, Session, Post, Body, HttpStatus, UsePipes, GoneException, Headers, ConflictException, UseInterceptors, UploadedFile } from "@nestjs/common";
import { CommonService } from "./common.service";
import { HttpResponse } from "src/response/response";
import { ValidationPipe } from "src/utils/pipes";
import { CommonSmsValid, CommonTokenValid } from "./common.valid";
import { SmsDTO, vTokenDTO } from "./common.dto";
import { JwtPayload } from "jsonwebtoken";
import { TokenExpireInterceptor } from "src/guard/token.interceptor";
import { FileInterceptor } from "@nestjs/platform-express";
import { Express } from 'express'

@Controller("/common")
export class CommonController {

  constructor(private readonly CommonService: CommonService) { }

  //获取图形验证码
  @Get("/sms")    
  public async getSmsCode(@Session() session: Record<string, any>) {
    const code = await this.CommonService.getSmsCode(session);
    return new HttpResponse<string>(HttpStatus.NO_CONTENT, code).send();
  }
  //提交验证码
  @Post("/sms") 
  @UsePipes(new ValidationPipe(CommonSmsValid))
  public vSmsCode(
    @Body() body: SmsDTO,
    @Session() session: Record<string, any>
  ) {
    const verify = this.CommonService.vSmsCode(body.code, session);
    if(verify) {
      return new HttpResponse<null>(HttpStatus.NO_CONTENT).send();
    } else {
      return new HttpResponse<null>(HttpStatus.FORBIDDEN).send();
    }
  }

  //验证Token有效性
  @Post("/vtoken")
  @UsePipes(new ValidationPipe(CommonTokenValid))
  public vToken(
    @Body() body: vTokenDTO
  ) {
    const [ error ] = this.CommonService.vToken(body.token);
    if(error) {
      //token超过失效
      if(error === "TokenExpiredError: jwt expired") {
        throw new GoneException(new HttpResponse<null>(HttpStatus.GONE, null,  error).send());
      } else {
        throw new ConflictException(new HttpResponse<string | JwtPayload>(HttpStatus.CONFLICT, null, error.toString() ).send());
      }
    } else {
      return new HttpResponse<string | JwtPayload>(HttpStatus.ACCEPTED, "ok").send();
    }
  }

  //刷新Token
  @Get("/rtoken")
  public async rToken(
    @Headers("Authorization") Authorization: string
  ) {
    const [ error, Token ] = this.CommonService.rToken(Authorization);
    if(error){
      throw new ConflictException(new HttpResponse(HttpStatus.CONFLICT, null,  error.message).send());
    }
    return  new HttpResponse<{ token : string }>(HttpStatus.ACCEPTED, {
      token: Token
    }).send();
  }

  /**
   * 小文件上传
   * @returns md5 url
   * @param file 小文件
   * @returns 
   */
  @Post("/upload")
  @UseInterceptors(FileInterceptor("file"))
  public async FileUpload(
    @UploadedFile() file: Express.Multer.File,
  ) {
    const [ error, url ] = await this.CommonService.FileUpload(file);
    if(error) throw new BadRequestException(new HttpResponse(HttpStatus.BAD_REQUEST, null,  error.message).send());
    return new HttpResponse<{ url : string }>(HttpStatus.ACCEPTED, { url: url }).send();
  }

  //测试接口
  @Get("/test")
  @UseInterceptors(new TokenExpireInterceptor())    //需要token认证的地方添加
  public test(){
    return new HttpResponse<string>(HttpStatus.ACCEPTED, "ok").send();
  }
}