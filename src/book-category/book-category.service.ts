import { Injectable } from '@nestjs/common';
import { CreateBookCategoryDto } from './dto/create-book-category.dto';
import { UpdateBookCategoryDto } from './dto/update-book-category.dto';
import { BookCategory } from './entities/book-category.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class BookCategoryService {
  constructor(
    @InjectRepository(BookCategory)
    private readonly repo: Repository<BookCategory>,
  ) {}

  async onModuleInit() {
    const count = await this.repo.count();
    if (count === 0) {
      console.log('Seeding Book Categories...');
      await this.repo.save([
        { name: 'Fiction', description: 'Stories and novels' },
        { name: 'Technology', description: 'Computers and engineering' },
        { name: 'History', description: 'Past events' }
      ]);
    }
  }
  create(createBookCategoryDto: CreateBookCategoryDto) {
    return 'This action adds a new bookCategory';
  }

  findAll() {
    return `This action returns all bookCategory`;
  }

  findOne(id: number) {
    return `This action returns a #${id} bookCategory`;
  }

  update(id: number, updateBookCategoryDto: UpdateBookCategoryDto) {
    return `This action updates a #${id} bookCategory`;
  }

  remove(id: number) {
    return `This action removes a #${id} bookCategory`;
  }
}
