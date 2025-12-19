import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Book } from './entities/book.entity';
import { Repository } from 'typeorm';

@Injectable()
export class BookService {
  constructor(
    @InjectRepository(Book)
    private readonly repo: Repository<Book>,
  ) { }

  create(createBookDto: CreateBookDto) {
    return this.repo.save(createBookDto);
  }

  findAll() {
    return this.repo.find();
  }

  async findOne(id: string): Promise<Book> {
    const book = await this.repo.findOne({
      where: { id },
      relations: ['category'],
    });
    if (!book) {
      throw new NotFoundException(`Book with ID ${id} not found`);
    }
    return book;
  }

  update(id: string, updateBookDto: UpdateBookDto) {
    return this.repo.update(id, updateBookDto);
  }

  remove(id: string) {
    return this.repo.delete(id);
  }

  async incrementLikes(id: string) {
    const book = await this.findOne(id);
    book.likeCount += 1;
    return this.repo.save(book);
  }
}