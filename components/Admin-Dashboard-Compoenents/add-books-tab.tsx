"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import Image from "next/image"
import React from "react"
import { Loader2Icon, X } from 'lucide-react'
import placeholder from '@/assets/placeholder.png'
export function AddBooksTabComponent() {
  const CLOUDINARY_CLOUD_NAME="dmatteqxe"
  const UPLOAD_PRESET = "R2_book_image"
  
  const [isbn, setIsbn] = useState("")
  const [bookName, setBookName] = useState("")
  const [bookAuthor, setBookAuthor] = useState("")
  const [bookDescription, setBookDescription] = useState("")
  const [bookQuantity, setQuantity] = useState("")
  const [bookPrice, setBookPrice] = useState("")
  const [images, setImages] = useState<File[]>([])
  const [prevImages, setPrevImages] = useState([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [bookExists, setBookExists] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null)

  // book delete button function
  const handleDelete = async () => {
    try {
      const response = await fetch(`/queries/books?isbn=${isbn}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Error deleting book');
      }

      const result = await response.json();
      console.log("Book deleted successfully:", result);
      resetForm();
      alert("Book deleted successfully!");
    } catch (error) {
      console.error("Error deleting book:", error);
      alert("There was an error deleting the book.");
    }
  }
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setImages(prevImages => [...prevImages, ...Array.from(e.target.files as FileList)])
    }
  }

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

  const generateDiscription = async () => {
    setIsSubmitting(true)

    try {
      const prompt = `Generate a summary of the book 
      ISBN: ${isbn}, 
      Book Name: ${bookName}, 
      Author: ${bookAuthor}.`;
      
      const response = await fetch(`/api/gemini`, {
        method: 'POST',
        body: JSON.stringify({ prompt }),
      })

      const aiAnswer = await response.json();
      // console.log(aiAnswer)
      setBookDescription(aiAnswer.reply);
      if (response.ok) {
        setBookDescription(aiAnswer.reply);
        // alert(aiAnswer?.reply);
      } else {
        alert(`Error: ${aiAnswer?.error}`);
      }
    } catch (error) {
      console.log(error)
    } finally {
      setIsSubmitting(false)
    }
  }

const handleSubmit = async (e) => {
  e.preventDefault();
  setIsSubmitting(true);

  if (!isbn || !bookName || !bookDescription || !bookAuthor || !bookQuantity || !bookPrice) {
    alert("All fields are required.");
    setIsSubmitting(false);
    return;
  }

  try {
    // Upload images and retrieve their URLs
    const uploadedImages = await Promise.all(images.map(async (image) => {
      const formData = new FormData();
      formData.append('file', image);
      formData.append('upload_preset', UPLOAD_PRESET);

      const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`, {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      return {
        id: data["public_id"],
        url: data["secure_url"]
      };
    }));

    // Extract URLs from the uploaded images
    const imageUrls = uploadedImages.map(img => img.url);

    // Prepare book data to be sent to MongoDB
    const bookData = {
      ISBN: isbn,
      BookName: bookName,
      Author: bookAuthor,
      Description: bookDescription,
      Quantity: parseInt(bookQuantity),
      Price: parseFloat(bookPrice),
      Images: imageUrls,
    };

    // Send book data to your API endpoint
    const response = await fetch(bookExists ? `/queries/books?isbn=${isbn}` : '/queries/books', {
      method: bookExists ? 'PUT' : 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(bookData),
    });

    if (!response.ok) {
      throw new Error("Error adding book");
    }

    const result = await response.json();
    console.log("Book added successfully:", result);
    alert("Book added successfully!");

    // Reset form fields after successful submission
    resetForm();
  } catch (error) {
    console.error("Error adding book:", error);
    alert("There was an error adding the book.");
  } finally {
    setIsSubmitting(false); // Reset submitting state
  }
};

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const uploadImages = async () => {
  const uploadedImages = await Promise.all(images.map(async (image) => {
    const formData = new FormData();
    formData.append('file', image);
    formData.append('upload_preset', UPLOAD_PRESET);

    const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`, {
      method: 'POST',
      body: formData,
    });

    const data = await res.json();
    return {
      id: data["public_id"],
      url: data["secure_url"]
    };
  }));

  return uploadedImages;
};

 const fetchBookDetails = async (isbn: string) => {
    try {
      const response = await fetch(`/queries/books?isbn=${isbn}`); // Modify this to your API endpoint
      if (!response.ok) throw new Error("Book not found");

      const bookData = await response.json();
      // Set the state with book details
      setBookName(bookData.BookName);
      setBookAuthor(bookData.Author);
      setBookDescription(bookData.Description);
      setQuantity(bookData.Quantity);
      setBookPrice(bookData.Price);
      setPrevImages(bookData.Images); // Assuming you store image URLs in your database
      setBookExists(true); // Set bookExists to true if book is found
    } catch (error) {
      console.error("Error fetching book details:", error);
      setBookExists(false); // If there's an error, set bookExists to false
    }
 };
  
    useEffect(() => {
    if (isbn) {
      fetchBookDetails(isbn); 
    } else {
      // Reset fields if ISBN is cleared
      setBookName("");
      setBookAuthor("");
      setBookDescription("");
      setQuantity("");
      setBookPrice("");
      setImages([]);
      setPrevImages([]);
      setBookExists(false);
    }
  }, [isbn]);


  // reset form
  const resetForm = () => {
    setIsbn("");
    setBookName("");
    setBookAuthor("");
    setBookDescription("");
    setQuantity("");
    setBookPrice("");
    setImages([]);
    setBookExists(false);
   };
  
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
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="author">Book Author</Label>
              <Input
                id="author"
                placeholder="Enter Author Name"
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
            <div className="space-y-2">
              <Label htmlFor="price">Book Price</Label>
              <Input
                id="price"
                placeholder="Enter Book Price"
                value={bookPrice}
                onChange={(e) => setBookPrice(e.target.value)}
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
            <div className="flex gap-2">
           {bookExists && (
              prevImages.map((images) => {
                return (
                  <Image src={images.url ? images.url : placeholder} alt="previmage" key={images.id} height={110} width={110} />
                );
              })
              )}
              </div>

          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label htmlFor="bookDescription">Book Description</Label>
              <Button type="button" disabled={isSubmitting == true} onClick={() => generateDiscription()}>
                {isSubmitting ? <><Loader2Icon className="mr-2 h-4 w-4 animate-spin" />Fetching</> : 'Fetch Description'}
              </Button>
            </div>
            <Textarea
              id="bookDescription"
              placeholder="Enter Book Description"
              value={bookDescription}
              onChange={(e) => setBookDescription(e.target.value)}
              rows={4}
            />
          </div>
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : bookExists ? "Update Book" : "Add Book"}
          </Button>
          {bookExists && (
            <div className="flex justify-between">
              <Button onClick={handleDelete} type="button" className="w-full bg-red-500 hover:bg-red-600">
                Delete Book
              </Button>
            </div>
          )}
        </form>
      </CardContent>
    </Card>
  )
}