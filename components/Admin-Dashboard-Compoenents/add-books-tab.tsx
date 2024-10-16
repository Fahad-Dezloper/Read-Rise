"use client"

import { useCallback, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import Image from "next/image"
import React from "react"
import { Loader2, Loader2Icon, X } from 'lucide-react'
import axios from 'axios'
export function AddBooksTabComponent() {
  const [isbn, setIsbn] = useState("")
  const [bookName, setBookName] = useState("")
  const [bookAuthor, setBookAuthor] = useState("")
  const [bookDescription, setBookDescription] = useState("")
  const [bookQuantity, setQuantity] = useState("")
  const [images, setImages] = useState<File[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

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
      console.log(aiAnswer)
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
    
    if (!isbn ||!bookName ||!bookDescription ||!bookAuthor ||!bookQuantity) {
      alert("All fields are required.");
      return;
    }
      const bookData = {
        ISBN: isbn,
        BookName: bookName,
        Author: bookAuthor,
        Description: bookDescription,
        Quantity: bookQuantity,
    };

    try {
        const response = await axios.post('https://api.sheetbest.com/sheets/d5b080a8-0c21-44d8-8e17-f32f4f970fbf', bookData);
        console.log(response.data);
        alert("Book added successfully!");
        
        // Clear form fields after submission
        setIsbn("");
        setBookName("");
        setBookAuthor("");
        setBookDescription("");
        setQuantity("");
        setImages([]);
    } catch (error) {
        console.error("Error adding book:", error);
        alert("There was an error adding the book.");
    }
  };
  
  // https://api.sheetbest.com/sheets/d5b080a8-0c21-44d8-8e17-f32f4f970fbf


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
              <Button type="button" onClick={() => generateDiscription()}>
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
          <Button type="submit" className="w-full">Add Book</Button>
        </form>
      </CardContent>
    </Card>
  )
}