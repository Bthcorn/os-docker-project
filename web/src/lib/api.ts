const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export interface Author {
  id: number;
  name: string;
  bio?: string;
  createdAt: string;
  updatedAt: string;
}

export interface BookTag {
  id: number;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export interface BookTagRelation {
  tag: BookTag;
}

export interface Book {
  id: number;
  title: string;
  isbn: string;
  publishedYear?: number;
  summary?: string;
  authorId: number;
  author?: Author;
  BookTag?: BookTagRelation[];
  tags?: BookTag[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateBookDto {
  title: string;
  isbn: string;
  publishedYear?: number;
  summary?: string;
  authorId: number;
  tags?: number[];
}

export interface CreateAuthorDto {
  name: string;
  bio?: string;
}

export interface CreateBookTagDto {
  name: string;
}

export interface FilterBookDto {
  authorName?: string;
  title?: string;
  publishedYear?: number;
}

// Utility function to transform book tag structure
export function transformBookTags(book: Book): Book {
  return {
    ...book,
    tags: book.BookTag?.map((bookTag) => bookTag.tag) || book.tags || [],
  };
}

class ApiService {
  private async request<T>(
    endpoint: string,
    options?: RequestInit,
  ): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    const response = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
        ...options?.headers,
      },
      ...options,
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  // Books API
  async getBooks(): Promise<Book[]> {
    const books = await this.request<Book[]>("/books");
    return books.map(transformBookTags);
  }

  async getBook(id: number): Promise<Book> {
    const book = await this.request<Book>(`/books/${id}`);
    return transformBookTags(book);
  }

  async createBook(book: CreateBookDto): Promise<Book> {
    const createdBook = await this.request<Book>("/books", {
      method: "POST",
      body: JSON.stringify(book),
    });
    // Fetch the book again to get complete data with tags
    return this.getBook(createdBook.id);
  }

  async updateBook(id: number, book: Partial<CreateBookDto>): Promise<Book> {
    await this.request<Book>(`/books/${id}`, {
      method: "PATCH",
      body: JSON.stringify(book),
    });
    // Fetch the book again to get complete data with tags
    return this.getBook(id);
  }

  async deleteBook(id: number): Promise<void> {
    return this.request<void>(`/books/${id}`, {
      method: "DELETE",
    });
  }

  async filterBooks(filters: FilterBookDto): Promise<Book[]> {
    const params = new URLSearchParams();
    if (filters.authorName) params.append("authorName", filters.authorName);
    if (filters.title) params.append("title", filters.title);
    if (filters.publishedYear)
      params.append("publishedYear", filters.publishedYear.toString());

    const books = await this.request<Book[]>(
      `/books/filter?${params.toString()}`,
    );
    return books.map(transformBookTags);
  }

  // Authors API
  async getAuthors(): Promise<Author[]> {
    return this.request<Author[]>("/authors");
  }

  async getAuthor(id: number): Promise<Author> {
    return this.request<Author>(`/authors/${id}`);
  }

  async createAuthor(author: CreateAuthorDto): Promise<Author> {
    return this.request<Author>("/authors", {
      method: "POST",
      body: JSON.stringify(author),
    });
  }

  async updateAuthor(
    id: number,
    author: Partial<CreateAuthorDto>,
  ): Promise<Author> {
    return this.request<Author>(`/authors/${id}`, {
      method: "PATCH",
      body: JSON.stringify(author),
    });
  }

  async deleteAuthor(id: number): Promise<void> {
    return this.request<void>(`/authors/${id}`, {
      method: "DELETE",
    });
  }

  // Book Tags API
  async getBookTags(): Promise<BookTag[]> {
    return this.request<BookTag[]>("/book-tags");
  }

  async getBookTag(id: number): Promise<BookTag> {
    return this.request<BookTag>(`/book-tags/${id}`);
  }

  async createBookTag(tag: CreateBookTagDto): Promise<BookTag> {
    return this.request<BookTag>("/book-tags", {
      method: "POST",
      body: JSON.stringify(tag),
    });
  }

  async updateBookTag(
    id: number,
    tag: Partial<CreateBookTagDto>,
  ): Promise<BookTag> {
    return this.request<BookTag>(`/book-tags/${id}`, {
      method: "PATCH",
      body: JSON.stringify(tag),
    });
  }

  async deleteBookTag(id: number): Promise<void> {
    return this.request<void>(`/book-tags/${id}`, {
      method: "DELETE",
    });
  }
}

export const apiService = new ApiService();
