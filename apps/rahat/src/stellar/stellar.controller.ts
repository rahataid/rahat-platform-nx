import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { CreateStellarDto } from './dto/create-stellar.dto';
import { UpdateStellarDto } from './dto/update-stellar.dto';
import { StellarService } from './stellar.service';


@Controller('stellar')
export class StellarController {
  constructor(private readonly stellarService: StellarService) { }

  @Post()
  create(@Body() createStellarDto: CreateStellarDto) {
    return this.stellarService.create(createStellarDto);
  }

  @Get()
  findAll() {
    return this.stellarService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.stellarService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateStellarDto: UpdateStellarDto) {
    return this.stellarService.update(+id, updateStellarDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.stellarService.remove(+id);
  }
}
