import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { BookService } from './book.service';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { UseGuards } from '@nestjs/common';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { UserRole } from '../users/entities/user.entity';
import { AuthGuard } from '@nestjs/passport';
import { CurrentUser } from 'src/auth/current-user.decorator';

@Controller('book')
export class BookController {
  constructor(private readonly bookService: BookService) { }

  // PUBLIC: Anyone can see the list
  @Get()
  findAll() {
    return this.bookService.findAll();
  }

  // ADMIN ONLY: Only admins can create, update, or delete
  @Post()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.ADMIN)
  create(@Body() createBookDto: CreateBookDto) {
    return this.bookService.create(createBookDto);
  }

  @Patch(':id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.ADMIN)
  update(@Param('id') id: string, @Body() updateBookDto: UpdateBookDto) {
    return this.bookService.update(id, updateBookDto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.ADMIN)
  remove(@Param('id') id: string) {
    return this.bookService.remove(id);
  }

  // PUBLIC: Anyone can view details or like
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.bookService.findOne(id);
  }

  @UseGuards(AuthGuard('jwt')) // ต้อง Login ก่อนถึงจะ Like ได้ (ทั้ง Admin/User)
  @Patch(':id/like')
  async toggleLike(@Param('id') id: string, @CurrentUser() user: any) {
    return this.bookService.toggleLike(id, user.userId);
  }
}
