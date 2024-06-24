import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  SetMetadata,
  UseGuards,
} from '@nestjs/common';
import { MatchService } from './match.service';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { MatchRequestDto } from './dto/match-request.dto';
import { Role } from '@prisma/client';
import { MatchRequestGuard } from './guards/match-request.guard.ts';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { AuthGuard } from '@nestjs/passport';

@Controller('match')
export class MatchController {
  constructor(private readonly matchService: MatchService) {}

  @Get('/all-matches')
  async getAllMatches() {
    return this.matchService.getAllMatches();
  }
  @Post('/create')
  @SetMetadata('roles', [Role.TRAINER])
  @UseGuards(AuthGuard('jwt'), MatchRequestGuard)
  async matchRequest(
    @CurrentUser('id') requesterId: number,
    @Body() dto: MatchRequestDto,
  ) {
    return this.matchService.createMatchRequest(requesterId, dto);
  }
  @Post('/accept/:id')
  @SetMetadata('roles', [Role.TRAINER])
  @UseGuards(AuthGuard('jwt'), MatchRequestGuard)
  async acceptRequest(
    @CurrentUser('id') userId: number,
    @Param('id') requestId: number,
  ) {
    return await this.matchService.acceptRequets(+requestId, +userId);
  }

  @Delete('/delete/:id')
  @SetMetadata('roles', [Role.TRAINER])
  @UseGuards(AuthGuard('jwt'), MatchRequestGuard)
  async deleteRequest(
    @Param('id') requestId: number,
    @CurrentUser('id') userId: number,
  ) {
    console.log('userid', userId);
    return await this.matchService.deleteRequest(+requestId, userId);
  }
}
