# Library Management System - Frontend Documentation

A modern web-based library management system built with Next.js 15 and TypeScript, designed to work with a NestJS backend API.

## Features

### 📚 Book Management
- **View Books**: Browse all books in a responsive card layout
- **Search & Filter**: Filter books by title, author name, or publication year
- **Add Books**: Create new book entries with complete metadata
- **Edit Books**: Update existing book information
- **Delete Books**: Remove books from the library
- **Book Details**: Title, ISBN, author, publication year, summary, and tags

### ✍️ Author Management
- **View Authors**: Browse all authors with their biographical information
- **Add Authors**: Create new author profiles
- **Edit Authors**: Update author information
- **Delete Authors**: Remove authors from the system
- **Author Details**: Name and biography

### 🏷️ Tag Management
- **View Tags**: See all available book tags
- **Add Tags**: Create new categorization tags
- **Edit Tags**: Update existing tag names
- **Delete Tags**: Remove unused tags
- **Tag Association**: Link tags to books for better categorization

## Technology Stack

- **Frontend**: Next.js 15 with React 19
- **Backend**: NestJS
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **API Communication**: Fetch API with custom service layer
- **State Management**: React Hooks (useState, useEffect)

## Project Structure

```
src/
├── app/
│   ├── layout.tsx          # Root layout with metadata
│   ├── page.tsx            # Main application page
│   └── globals.css         # Global styles
├── components/
│   └── forms/
│       ├── BookForm.tsx    # Book add/edit form
│       ├── AuthorForm.tsx  # Author add/edit form
│       └── TagForm.tsx     # Tag add/edit form
└── lib/
    └── api.ts              # API service layer and types
```

## Getting Started

### Prerequisites

- Node.js 18+
- NestJS API server running
- pnpm (package manager)

### Installation

1. **Install Dependencies**
   ```bash
   cd web
   pnpm install
   ```

2. **Configure Environment**
   ```bash
   cp .env.local.example .env.local
   ```

   Update `.env.local` with your API URL:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:3001
   ```

3. **Start Development Server**
   ```bash
   pnpm dev
   ```

4. **Open Application**
   Navigate to `http://localhost:3000`

## API Configuration

The frontend communicates with a NestJS backend API. Ensure the following endpoints are available:

### Books API
- `GET /books` - List all books
- `GET /books/:id` - Get specific book
- `POST /books` - Create new book
- `PATCH /books/:id` - Update book
- `DELETE /books/:id` - Delete book
- `GET /books/filter` - Filter books by criteria

### Authors API
- `GET /authors` - List all authors
- `GET /authors/:id` - Get specific author
- `POST /authors` - Create new author
- `PATCH /authors/:id` - Update author
- `DELETE /authors/:id` - Delete author

### Book Tags API
- `GET /book-tags` - List all tags
- `GET /book-tags/:id` - Get specific tag
- `POST /book-tags` - Create new tag
- `PATCH /book-tags/:id` - Update tag
- `DELETE /book-tags/:id` - Delete tag

## Data Models

### Book
```typescript
interface Book {
  id: number;
  title: string;
  isbn: string;
  publishedYear?: number;
  summary?: string;
  authorId: number;
  author?: Author;
  tags?: BookTag[];
  createdAt: string;
  updatedAt: string;
}
```

### Author
```typescript
interface Author {
  id: number;
  name: string;
  bio?: string;
  createdAt: string;
  updatedAt: string;
}
```

### BookTag
```typescript
interface BookTag {
  id: number;
  name: string;
  createdAt: string;
  updatedAt: string;
}
```

```bash
# Start development server
pnpm dev

# Build for production
pnpm build

# Start production server
pnpm start

# Run linting
pnpm lint
```
