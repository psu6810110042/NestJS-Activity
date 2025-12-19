import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Book } from './entities/book.entity';
import { Repository } from 'typeorm';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class BookService {
  constructor(
    @InjectRepository(Book)
    private readonly repo: Repository<Book>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
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

  async toggleLike(bookId: string, userId: string) {
    // 1. Find book with likedBy relation
    const book = await this.repo.findOne({
      where: { id: bookId },
      relations: ['likedBy'],
    });

    if (!book) {
      throw new NotFoundException(`Book with ID ${bookId} not found`);
    }

    // 2. Check if user already liked this book
    const userIndex = book.likedBy.findIndex((user) => user.id === userId);

    if (userIndex > -1) {
      // User already liked -> UNLIKE
      book.likedBy.splice(userIndex, 1);
      book.likeCount = Math.max(0, book.likeCount - 1);
    } else {
      // User hasn't liked -> LIKE
      const user = await this.userRepo.findOneBy({ id: userId });
      if (!user) throw new NotFoundException('User not found');

      book.likedBy.push(user);
      book.likeCount += 1;
    }

    // 3. Save the book (TypeORM updates the junction table automatically)
    return this.repo.save(book);
  }
}