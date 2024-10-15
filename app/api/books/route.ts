// app/api/books/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { google } from 'googleapis';

const sheets = google.sheets('v4');

async function addBookToSheet(isbn: number, bookName: string, bookDescription: string, bookAuthor: string, bookQuantity: number, images)  {
  const auth = new google.auth.GoogleAuth({
    keyFile: process.env.GOOGLE_APPLICATION_CREDENTIALS, 
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });

  const client = await auth.getClient();
  const sheetId = '1K7Rv2xosfccdPufG5Mh0PrIjpIrmAX5nAA-uboBbPoI';
    console.log("Appending to Google Sheet:", { isbn, bookName, bookDescription, bookQuantity, bookAuthor, images });
  await sheets.spreadsheets.values.append({
    auth: client,
    spreadsheetId: sheetId,
    range: 'Sheet1!A:F', 
    valueInputOption: 'RAW',
    requestBody: {
      values: [[isbn, bookName, bookDescription, bookAuthor, bookQuantity, images]],
    },
  });
    
    console.log("Successfully added book to Google Sheets.");
}

export async function POST(request: NextRequest) {
  try {
    const { isbn, bookName, bookDescription, bookAuthor, bookQuantity, images } = await request.json();
    console.log('Received request with data:', { isbn, bookName, bookDescription,bookAuthor, bookQuantity });

    // Call the function to add the book details to the Google Sheet
    await addBookToSheet(isbn, bookName, bookDescription, bookAuthor, bookQuantity, images);

    return NextResponse.json({ message: 'Book added successfully' });
  } catch (error) {
    console.error('Error in API Route:', error);
    return NextResponse.json({ error: 'Failed to add book' }, { status: 500 });
  }
}
