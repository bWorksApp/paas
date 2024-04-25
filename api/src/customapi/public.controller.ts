import { UserService } from '../user/user.service';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Response,
  Query,
} from '@nestjs/common';
import { Public } from '../flatworks/roles/public.api.decorator';

@Public()
@Controller('public')
export class PublicController {
  constructor() {}
}
