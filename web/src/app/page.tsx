"use client";

import { useState, useEffect } from "react";
import {
  Book,
  Author,
  BookTag,
  apiService,
  transformBookTags,
} from "@/lib/api";
import BookForm from "@/components/forms/BookForm";
import AuthorForm from "@/components/forms/AuthorForm";
import TagForm from "@/components/forms/TagForm";

export default function LibraryManagement() {
  const [activeTab, setActiveTab] = useState<"books" | "authors" | "tags">(
    "books",
  );
  const [books, setBooks] = useState<Book[]>([]);
  const [authors, setAuthors] = useState<Author[]>([]);
  const [tags, setTags] = useState<BookTag[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Search/Filter states
  const [searchTitle, setSearchTitle] = useState("");
  const [searchAuthor, setSearchAuthor] = useState("");
  const [searchYear, setSearchYear] = useState("");

  // Form states
  const [showBookForm, setShowBookForm] = useState(false);
  const [showAuthorForm, setShowAuthorForm] = useState(false);
  const [showTagForm, setShowTagForm] = useState(false);
  const [editingBook, setEditingBook] = useState<Book | undefined>();
  const [editingAuthor, setEditingAuthor] = useState<Author | undefined>();
  const [editingTag, setEditingTag] = useState<BookTag | undefined>();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [booksData, authorsData, tagsData] = await Promise.all([
        apiService.getBooks(),
        apiService.getAuthors(),
        apiService.getBookTags(),
      ]);

      // Transform books to have proper tags array
      const transformedBooks = booksData.map(transformBookTags);

      setBooks(transformedBooks);
      setAuthors(authorsData);
      setTags(tagsData);
      setError(null);
    } catch (err) {
      setError("Failed to load data. Make sure the API server is running.");
      console.error("Error loading data:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    try {
      setLoading(true);
      const filters: any = {};
      if (searchTitle) filters.title = searchTitle;
      if (searchAuthor) filters.authorName = searchAuthor;
      if (searchYear) filters.publishedYear = parseInt(searchYear);

      if (Object.keys(filters).length > 0) {
        const filteredBooks = await apiService.filterBooks(filters);
        const transformedFilteredBooks = filteredBooks.map(transformBookTags);
        setBooks(transformedFilteredBooks);
      } else {
        const allBooks = await apiService.getBooks();
        setBooks(allBooks); // Already transformed in the service
      }
    } catch (err) {
      setError("Failed to search books");
      console.error("Error searching:", err);
    } finally {
      setLoading(false);
    }
  };

  const clearSearch = () => {
    setSearchTitle("");
    setSearchAuthor("");
    setSearchYear("");
    loadData();
  };

  const handleBookSave = (book: Book) => {
    const transformedBook = transformBookTags(book);

    if (editingBook) {
      setBooks((prev) =>
        prev.map((b) => (b.id === transformedBook.id ? transformedBook : b)),
      );
    } else {
      setBooks((prev) => [...prev, transformedBook]);
    }
    setShowBookForm(false);
    setEditingBook(undefined);
  };

  const handleAuthorSave = (author: Author) => {
    if (editingAuthor) {
      setAuthors((prev) => prev.map((a) => (a.id === author.id ? author : a)));
    } else {
      setAuthors((prev) => [...prev, author]);
    }
    setShowAuthorForm(false);
    setEditingAuthor(undefined);
  };

  const handleTagSave = (tag: BookTag) => {
    if (editingTag) {
      setTags((prev) => prev.map((t) => (t.id === tag.id ? tag : t)));
    } else {
      setTags((prev) => [...prev, tag]);
    }
    setShowTagForm(false);
    setEditingTag(undefined);
  };

  const handleDeleteBook = async (id: number) => {
    if (confirm("Are you sure you want to delete this book?")) {
      try {
        await apiService.deleteBook(id);
        setBooks((prev) => prev.filter((b) => b.id !== id));
      } catch (err) {
        setError("Failed to delete book");
        console.error("Error deleting book:", err);
      }
    }
  };

  const handleDeleteAuthor = async (id: number) => {
    if (confirm("Are you sure you want to delete this author?")) {
      try {
        await apiService.deleteAuthor(id);
        setAuthors((prev) => prev.filter((a) => a.id !== id));
      } catch (err) {
        setError("Failed to delete author");
        console.error("Error deleting author:", err);
      }
    }
  };

  const handleDeleteTag = async (id: number) => {
    if (confirm("Are you sure you want to delete this tag?")) {
      try {
        await apiService.deleteBookTag(id);
        setTags((prev) => prev.filter((t) => t.id !== id));
      } catch (err) {
        setError("Failed to delete tag");
        console.error("Error deleting tag:", err);
      }
    }
  };

  const handleEditBook = (book: Book) => {
    setEditingBook(book);
    setShowBookForm(true);
  };

  const handleEditAuthor = (author: Author) => {
    setEditingAuthor(author);
    setShowAuthorForm(true);
  };

  const handleEditTag = (tag: BookTag) => {
    setEditingTag(tag);
    setShowTagForm(true);
  };

  if (loading && books.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading library data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center bg-white p-8 rounded-lg shadow-md">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Connection Error
          </h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={loadData}
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                📚 Library Management System
              </h1>
              <p className="text-gray-600">
                Manage your books, authors, and tags
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-500">
                {books.length} books • {authors.length} authors • {tags.length}{" "}
                tags
              </span>
              <button
                onClick={loadData}
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg"
              >
                Refresh
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            {[
              { id: "books", label: "Books", count: books.length },
              { id: "authors", label: "Authors", count: authors.length },
              { id: "tags", label: "Tags", count: tags.length },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                {tab.label} ({tab.count})
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === "books" && (
          <div className="space-y-6">
            {/* Search/Filter Section */}
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Search & Filter Books
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <input
                  type="text"
                  placeholder="Search by title..."
                  value={searchTitle}
                  onChange={(e) => setSearchTitle(e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-2 text-gray-900"
                />
                <input
                  type="text"
                  placeholder="Search by author..."
                  value={searchAuthor}
                  onChange={(e) => setSearchAuthor(e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-2 text-gray-900"
                />
                <input
                  type="number"
                  placeholder="Published year..."
                  value={searchYear}
                  onChange={(e) => setSearchYear(e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-2 text-gray-900"
                />
                <div className="flex gap-2">
                  <button
                    onClick={handleSearch}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex-1"
                  >
                    Search
                  </button>
                  <button
                    onClick={clearSearch}
                    className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg"
                  >
                    Clear
                  </button>
                </div>
              </div>
            </div>

            {/* Books List */}
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                <h3 className="text-lg font-medium text-gray-900">
                  Books Collection
                </h3>
                <button
                  onClick={() => setShowBookForm(true)}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center"
                >
                  <svg
                    className="w-5 h-5 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                    />
                  </svg>
                  Add Book
                </button>
              </div>
              {books.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-gray-400 text-6xl mb-4">📖</div>
                  <p className="text-gray-500">No books found</p>
                </div>
              ) : (
                <div className="overflow-hidden">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
                    {books.map((book) => (
                      <div
                        key={book.id}
                        className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                      >
                        <div className="space-y-3">
                          <div>
                            <h4 className="font-semibold text-gray-900 text-lg">
                              {book.title}
                            </h4>
                            <p className="text-sm text-gray-600">
                              ISBN: {book.isbn}
                            </p>
                          </div>

                          {book.author && (
                            <div>
                              <span className="text-sm text-gray-500">
                                Author:{" "}
                              </span>
                              <span className="text-sm font-medium text-gray-700">
                                {book.author.name}
                              </span>
                            </div>
                          )}

                          {book.publishedYear && (
                            <div>
                              <span className="text-sm text-gray-500">
                                Published:{" "}
                              </span>
                              <span className="text-sm text-gray-700">
                                {book.publishedYear}
                              </span>
                            </div>
                          )}

                          {book.summary && (
                            <p className="text-sm text-gray-600 line-clamp-3">
                              {book.summary}
                            </p>
                          )}

                          {book.tags && book.tags.length > 0 && (
                            <div className="flex flex-wrap gap-1">
                              {book.tags.map((tag) => (
                                <span
                                  key={tag.id}
                                  className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded"
                                >
                                  {tag.name}
                                </span>
                              ))}
                            </div>
                          )}

                          <div className="flex justify-end space-x-2 pt-3 border-t border-gray-100">
                            <button
                              onClick={() => handleEditBook(book)}
                              className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDeleteBook(book.id)}
                              className="text-red-600 hover:text-red-800 text-sm font-medium"
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === "authors" && (
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <h3 className="text-lg font-medium text-gray-900">Authors</h3>
              <button
                onClick={() => setShowAuthorForm(true)}
                className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg flex items-center"
              >
                <svg
                  className="w-5 h-5 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                  />
                </svg>
                Add Author
              </button>
            </div>
            {authors.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-gray-400 text-6xl mb-4">✍️</div>
                <p className="text-gray-500">No authors found</p>
              </div>
            ) : (
              <div className="overflow-hidden">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
                  {authors.map((author) => (
                    <div
                      key={author.id}
                      className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                    >
                      <div className="space-y-3">
                        <h4 className="font-semibold text-gray-900 text-lg">
                          {author.name}
                        </h4>
                        {author.bio && (
                          <p className="text-sm text-gray-600">{author.bio}</p>
                        )}
                        <div className="text-xs text-gray-500">
                          Added:{" "}
                          {new Date(author.createdAt).toLocaleDateString()}
                        </div>
                        <div className="flex justify-end space-x-2 pt-3 border-t border-gray-100">
                          <button
                            onClick={() => handleEditAuthor(author)}
                            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteAuthor(author.id)}
                            className="text-red-600 hover:text-red-800 text-sm font-medium"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === "tags" && (
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <h3 className="text-lg font-medium text-gray-900">Book Tags</h3>
              <button
                onClick={() => setShowTagForm(true)}
                className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-lg flex items-center"
              >
                <svg
                  className="w-5 h-5 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                  />
                </svg>
                Add Tag
              </button>
            </div>
            {tags.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-gray-400 text-6xl mb-4">🏷️</div>
                <p className="text-gray-500">No tags found</p>
              </div>
            ) : (
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {tags.map((tag) => (
                    <div
                      key={tag.id}
                      className="bg-blue-50 border border-blue-200 rounded-lg p-4 hover:shadow-md transition-all duration-200 group"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-gray-900 text-base truncate">
                            {tag.name}
                          </h4>
                          <div className="text-xs text-gray-500 mt-1"></div>
                        </div>
                        <div className="ml-2 flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                          <button
                            onClick={() => handleEditTag(tag)}
                            className="p-1.5 text-blue-600 hover:text-blue-800 hover:bg-blue-100 rounded-md transition-colors"
                            title="Edit tag"
                          >
                            <svg
                              className="w-4 h-4"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                              />
                            </svg>
                          </button>
                          <button
                            onClick={() => handleDeleteTag(tag.id)}
                            className="p-1.5 text-red-600 hover:text-red-800 hover:bg-red-100 rounded-md transition-colors"
                            title="Delete tag"
                          >
                            <svg
                              className="w-4 h-4"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                              />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center text-sm text-gray-500">
            Library Management System
          </div>
        </div>
      </footer>

      {/* Forms */}
      {showBookForm && (
        <BookForm
          book={editingBook}
          onSave={handleBookSave}
          onCancel={() => {
            setShowBookForm(false);
            setEditingBook(undefined);
          }}
        />
      )}

      {showAuthorForm && (
        <AuthorForm
          author={editingAuthor}
          onSave={handleAuthorSave}
          onCancel={() => {
            setShowAuthorForm(false);
            setEditingAuthor(undefined);
          }}
        />
      )}

      {showTagForm && (
        <TagForm
          tag={editingTag}
          onSave={handleTagSave}
          onCancel={() => {
            setShowTagForm(false);
            setEditingTag(undefined);
          }}
        />
      )}
    </div>
  );
}
