import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { MatchRequestDto } from './dto/match-request.dto';
import { PrismaService } from 'src/prisma.service';
import { Role } from '@prisma/client';
import { th } from '@faker-js/faker';

@Injectable()
export class MatchService {
  constructor(private readonly prisma: PrismaService) {}
  async getAllMatches() {
    return this.prisma.matchRequest.findMany({
      where: { NOT: { status: 'deleted' } },
    });
  }
  async createMatchRequest(requesterId: number, data: MatchRequestDto) {
    const trainer = await this.prisma.user.findFirst({
      where: { id: requesterId, role: Role.TRAINER },
    });
    if (!trainer) {
      throw new NotFoundException('Trainer not found');
    }
    return await this.prisma.matchRequest.create({
      data: {
        date: new Date(data.date),
        location: data.location,
        requester: { connect: { id: requesterId } },
      },
    });
  }
  async acceptRequets(requestId: number, accepterId: number) {
    console.log('match id', requestId);
    console.log('mimgebi', accepterId);
    const match = await this.prisma.matchRequest.findUnique({
      where: { id: requestId },
    });
    if (!match) throw new NotFoundException('match not found');
    console.log('requester from match req', match.requesterId);
    if (match.requesterId == accepterId) {
      throw new ForbiddenException('You cannot accept your own match request');
    }

    return await this.prisma.matchRequest.update({
      where: { id: requestId },
      data: {
        accepterId,
        status: 'accepted',
      },
    });
  }
  async deleteRequest(requestId: number, userId: number) {
    const matchRequest = await this.prisma.matchRequest.findFirst({
      where: { id: requestId },
    });
    console.log('useri', userId);
    console.log('matchRequest.requesterId', matchRequest.requesterId);
    if (matchRequest.requesterId !== userId)
      throw new ForbiddenException(
        'You can only delete your own match requests',
      );
    return await this.prisma.matchRequest.update({
      where: { id: requestId },
      data: {
        status: 'deleted',
      },
    });
  }
}
