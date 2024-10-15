"use client"

import { useCallback, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import Image from "next/image"
import React from "react"
import { X } from 'lucide-react'

export function AddBooksTabComponent() {
  const [isbn, setIsbn] = useState("")
  const [bookName, setBookName] = useState("")
  const [bookAuthor, setBookAuthor] = useState("")
  const [bookDescription, setBookDescription] = useState("")
  const [bookQuantity, setQuantity] = useState("")
  const [images, setImages] = useState<File[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setImages(prevImages => [...prevImages, ...Array.from(e.target.files as FileList)])
    }
  }

  // Helper function to convert a File to a base64 string
const convertToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
};

  const handlePaste = useCallback((e: ClipboardEvent) => {
    const items = e.clipboardData?.items
    if (items) {
      for (let i = 0; i < items.length; i++) {
        if (items[i].type.indexOf('image') !== -1) {
          const blob = items[i].getAsFile()
          if (blob) {
            setImages(prevImages => [...prevImages, blob])
          }
        }
      }
    }
  }, [])

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    const files = e.dataTransfer.files
    if (files) {
      setImages(prevImages => [...prevImages, ...Array.from(files)])
    }
  }, [])

  const removeImage = (index: number) => {
    setImages(prevImages => prevImages.filter((_, i) => i !== index))
  }

  React.useEffect(() => {
    document.addEventListener('paste', handlePaste)
    return () => {
      document.removeEventListener('paste', handlePaste)
    }
  }, [handlePaste])



  const handleSubmit = async (e) => {
    e.preventDefault()
    console.log({ isbn, bookName, bookDescription, bookAuthor, bookQuantity, images })
    alert("Book added successfully!")
    setIsbn("")
    setBookName("")
    setBookAuthor("")
    setQuantity("")
    setBookDescription("")
    setImages([])
        if (!isbn || !bookName || !bookDescription || !bookAuthor || !bookQuantity || !images) {
      alert("All fields are required.");
      return;
    }

    try {
      console.log("Sending data:", { isbn, bookName, bookDescription, bookAuthor, bookQuantity, images});

       const base64Images = await Promise.all(
      images.map(async (image) => await convertToBase64(image))
       );
      
        const data = {
      isbn,
      bookName,
      bookDescription,
      bookAuthor,
      bookQuantity,
      images: base64Images, // Include base64 images
        };
      
      const response = await fetch('/api/books', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const result = await response.json();
      console.log("API Response:", result);

      if (response.ok) {
        alert('Book added successfully!');
        setIsbn('');
        setBookName('');
        setBookDescription('');
        setBookAuthor('');
        setQuantity('');
        setImages([]);
      } else {
        alert(`Failed to add book: ${result.error}`);
      }
    } catch (error) {
      console.error('Error during API call:', error);
      alert('An unexpected error occurred');
    }
  }

  return (
    <Card className="md:rounded-lg rounded-none">
      <CardHeader>
        <CardTitle>Add Books</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="isbn">ISBN</Label>
              <Input
                id="isbn"
                placeholder="Enter ISBN"
                value={isbn}
                onChange={(e) => setIsbn(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="bookName">Book Name</Label>
              <Input
                id="bookName"
                placeholder="Enter Book Name"
                value={bookName}
                onChange={(e) => setBookName(e.target.value)}
                required
              />
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="author">Book Author</Label>
              <Input
                id="author"
                placeholder="Enter ISBN"
                value={bookAuthor}
                onChange={(e) => setBookAuthor(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="quantity">Quantity</Label>
              <Input
                id="quantity"
                placeholder="Enter Quantity"
                value={bookQuantity}
                onChange={(e) => setQuantity(e.target.value)}
                required
              />
            </div>
          </div>

          {/* image */}
         <div className="space-y-2">
            <Label htmlFor="imageUpload">Upload or Paste Image</Label>
              <div
            className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center cursor-pointer hover:border-gray-400 transition-colors"
            onClick={() => fileInputRef.current?.click()}
            onDrop={handleDrop}
            onDragOver={e => e.preventDefault()}
            >
              <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/*"
          multiple
          className="hidden"
        />
        <p className="text-gray-600">
          Click to browse or drag and drop images here
              </p>
              <p className="text-sm text-gray-500 mt-2">
          You can also paste images from clipboard
        </p>
            </div>
            
            {images.length > 0 && (
        <div className="mt-4 flex gap-4">
          {images.map((image, index) => (
            <div key={index} className="relative">
              <Image
                src={URL.createObjectURL(image)}
                alt={`Preview ${index + 1}`}
                className="w-32 h-32 object-cover rounded-lg"
                width={50}
                height={50}
              />
              <button
                onClick={() => removeImage(index)}
                className="absolute top-1 right-1 bg-white rounded-full p-1 shadow-md hover:bg-gray-100 transition-colors"
              >
                <X className="w-4 h-4 text-gray-600" />
              </button>
            </div>
          ))}
        </div>
      )}
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label htmlFor="bookDescription">Book Description</Label>
              <Button>Fetch Discription</Button>
            </div>
            <Textarea
              id="bookDescription"
              placeholder="Enter Book Description"
              value={bookDescription}
              onChange={(e) => setBookDescription(e.target.value)}
              rows={4}
              required
            />
          </div>
          <Button type="submit" className="w-full">Add Book</Button>
        </form>
      </CardContent>
    </Card>
  )
}