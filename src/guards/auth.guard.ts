import {
    CanActivate,
    ExecutionContext,
    Injectable,
    UnauthorizedException,
  } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
  import { JwtService } from '@nestjs/jwt';
  import { ClsService } from 'nestjs-cls';
  import { Observable } from 'rxjs';
  import { UserService } from 'src/app/users/user.service';
import { UserRole } from 'src/shared/enum/user.enum';
  
  @Injectable()
  export class AuthGard implements CanActivate {
    constructor(
      private jwtService: JwtService,
      private userService: UserService,
      private reflector: Reflector,
      private cls: ClsService,
    ) {}
  
    async canActivate(context: ExecutionContext,):  Promise<boolean>  {
      
      let req = context.switchToHttp().getRequest();
  
      let token = req.headers.authorization || '';
      token = token.split(' ')[1];
  
      if (!token) throw new UnauthorizedException();
  
      try {
        let payload = this.jwtService.verify(token);
        if (!payload.userId) throw new Error();
  
        let user = await this.userService.findOne({ where: { id: payload.userId } });
        
        if (!user) throw new Error();
  
        let roles = this.reflector.get('roles', context.getHandler());
      if (roles && !user.roles.includes(UserRole.ADMIN)) {
        let checkRoles = roles.find((role) => user.roles?.includes(role));
        if (!checkRoles) {
          throw new Error();
        }
      }

        this.cls.set('user', user);
        return true;
      } catch (err) {
        console.log(err);
        throw new UnauthorizedException();
      }
    }
  }
  