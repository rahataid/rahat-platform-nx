import { Injectable } from '@nestjs/common';
import { CreateStellarDto } from './dto/create-stellar.dto';
import { UpdateStellarDto } from './dto/update-stellar.dto';

@Injectable()
export class StellarService {
  create(createStellarDto: CreateStellarDto) {
    return 'This action adds a new stellar';
  }

  findAll() {
    return `This action returns all stellar`;
  }

  findOne(id: number) {
    return `This action returns a #${id} stellar`;
  }

  update(id: number, updateStellarDto: UpdateStellarDto) {
    return `This action updates a #${id} stellar`;
  }

  remove(id: number) {
    return `This action removes a #${id} stellar`;
  }
}
