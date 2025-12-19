import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { BookCategoryService } from './book-category.service';
import { CreateBookCategoryDto } from './dto/create-book-category.dto';
import { UpdateBookCategoryDto } from './dto/update-book-category.dto';
import { UseGuards } from '@nestjs/common';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { UserRole } from '../users/entities/user.entity';
import { AuthGuard } from '@nestjs/passport';

@Controller('book-category')
export class BookCategoryController {
  constructor(private readonly bookCategoryService: BookCategoryService) {}

  // ADMIN ONLY: Only admins can create new categories
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.ADMIN)
  @Post()
  create(@Body() createBookCategoryDto: CreateBookCategoryDto) {
    return this.bookCategoryService.create(createBookCategoryDto);
  }

  // PUBLIC: Everyone can see the list of categories
  @Get()
  findAll() {
    return this.bookCategoryService.findAll();
  }

  // PUBLIC: Everyone can see a specific category
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.bookCategoryService.findOne(id);
  }

  // ADMIN ONLY: Only admins can update categories
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.ADMIN)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateBookCategoryDto: UpdateBookCategoryDto) {
    return this.bookCategoryService.update(id, updateBookCategoryDto);
  }

  // ADMIN ONLY: Only admins can delete categories
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.ADMIN)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.bookCategoryService.remove(id);
  }
}
