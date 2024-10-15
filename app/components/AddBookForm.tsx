'use client';

import { useState } from 'react';

const AddBookForm = () => {
  const [isbn, setIsbn] = useState('');
  const [name, setName] = useState('');
  const [about, setAbout] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isbn || !name || !about) {
      alert("All fields are required.");
      return;
    }

    try {
      console.log("Sending data:", { isbn, name, about });

      const response = await fetch('/api/books', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isbn, name, about }),
      });

      const result = await response.json();
      console.log("API Response:", result);

      if (response.ok) {
        alert('Book added successfully!');
        setIsbn(''); // Reset form fields
        setName('');
        setAbout('');
      } else {
        alert(`Failed to add book: ${result.error}`);
      }
    } catch (error) {
      console.error('Error during API call:', error);
      alert('An unexpected error occurred');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={isbn}
        onChange={(e) => setIsbn(e.target.value)}
        placeholder="ISBN"
        required
      />
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Name"
        required
      />
      <textarea
        value={about}
        onChange={(e) => setAbout(e.target.value)}
        placeholder="About the book"
        required
      />
      <button type="submit">Add Book</button>
    </form>
  );
};

export default AddBookForm;
