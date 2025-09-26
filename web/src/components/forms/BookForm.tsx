"use client";

import { useState, useEffect } from "react";
import { Book, Author, BookTag, CreateBookDto, apiService } from "@/lib/api";

interface BookFormProps {
  book?: Book;
  onSave: (book: Book) => void;
  onCancel: () => void;
}

export default function BookForm({ book, onSave, onCancel }: BookFormProps) {
  const [formData, setFormData] = useState<CreateBookDto>({
    title: "",
    isbn: "",
    publishedYear: undefined,
    summary: "",
    authorId: 0,
    tags: [],
  });
  const [authors, setAuthors] = useState<Author[]>([]);
  const [bookTags, setBookTags] = useState<BookTag[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Prevent body scroll when modal is open
    document.body.style.overflow = "hidden";

    loadAuthorsAndTags();
    if (book) {
      // Extract tag IDs from the nested BookTag structure
      const tagIds =
        book.BookTag?.map((bookTag) => bookTag.tag.id) ||
        book.tags?.map((tag) => tag.id) ||
        [];

      setFormData({
        title: book.title,
        isbn: book.isbn,
        publishedYear: book.publishedYear,
        summary: book.summary || "",
        authorId: book.authorId,
        tags: tagIds,
      });
    }

    // Cleanup function to restore scroll when component unmounts
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [book]);

  const loadAuthorsAndTags = async () => {
    try {
      const [authorsData, tagsData] = await Promise.all([
        apiService.getAuthors(),
        apiService.getBookTags(),
      ]);
      setAuthors(authorsData);
      setBookTags(tagsData);
    } catch (err) {
      setError("Failed to load authors and tags");
      console.error("Error loading data:", err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.isbn || !formData.authorId) {
      setError("Please fill in all required fields");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const bookData = {
        ...formData,
        publishedYear: formData.publishedYear || undefined,
        summary: formData.summary || undefined,
      };

      let savedBook: Book;
      if (book) {
        savedBook = await apiService.updateBook(book.id, bookData);
      } else {
        savedBook = await apiService.createBook(bookData);
      }

      onSave(savedBook);
    } catch (err) {
      setError(`Failed to ${book ? "update" : "create"} book`);
      console.error("Error saving book:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleTagChange = (tagId: number, checked: boolean) => {
    if (checked) {
      setFormData((prev) => ({
        ...prev,
        tags: [...(prev.tags || []), tagId],
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        tags: (prev.tags || []).filter((id) => id !== tagId),
      }));
    }
  };

  return (
    <div className="fixed inset-0 backdrop-blur-sm bg-white/20 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-screen overflow-y-auto m-4">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              {book ? "Edit Book" : "Add New Book"}
            </h2>
            <button
              onClick={onCancel}
              className="text-gray-400 hover:text-gray-600"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {error && (
            <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Title *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, title: e.target.value }))
                }
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                placeholder="Enter book title"
                required
              />
            </div>

            {/* ISBN */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                ISBN *
              </label>
              <input
                type="text"
                value={formData.isbn}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, isbn: e.target.value }))
                }
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                placeholder="Enter ISBN"
                required
              />
            </div>

            {/* Author */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Author *
              </label>
              <select
                value={formData.authorId}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    authorId: parseInt(e.target.value),
                  }))
                }
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                required
              >
                <option value={0}>Select an author</option>
                {authors.map((author) => (
                  <option key={author.id} value={author.id}>
                    {author.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Published Year */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Published Year
              </label>
              <input
                type="number"
                value={formData.publishedYear || ""}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    publishedYear: e.target.value
                      ? parseInt(e.target.value)
                      : undefined,
                  }))
                }
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                placeholder="Enter published year"
                min="1000"
                max={new Date().getFullYear()}
              />
            </div>

            {/* Summary */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Summary
              </label>
              <textarea
                value={formData.summary}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, summary: e.target.value }))
                }
                rows={4}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                placeholder="Enter book summary"
              />
            </div>

            {/* Tags */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tags
              </label>
              <div className="space-y-2 max-h-32 overflow-y-auto border border-gray-200 rounded-lg p-3">
                {bookTags.length === 0 ? (
                  <p className="text-sm text-gray-500">No tags available</p>
                ) : (
                  bookTags.map((tag) => (
                    <label key={tag.id} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={(formData.tags || []).includes(tag.id)}
                        onChange={(e) =>
                          handleTagChange(tag.id, e.target.checked)
                        }
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700">{tag.name}</span>
                    </label>
                  ))
                )}
              </div>
            </div>

            {/* Buttons */}
            <div className="flex justify-end space-x-4 pt-6 border-t">
              <button
                type="button"
                onClick={onCancel}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
              >
                {loading && (
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                )}
                {book ? "Update Book" : "Add Book"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
