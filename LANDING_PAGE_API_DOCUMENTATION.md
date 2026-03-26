# Landing Page Designer API Documentation

## Overview
This document outlines the API endpoints and data structures for the Landing Page Designer feature. The frontend sends data to these endpoints to save, retrieve, and manage user-created landing pages.

## API Endpoints

### 1. Save/Create Landing Page
**Endpoint:** `POST /api/landing-pages`  
**Purpose:** Create a new landing page or update existing one

#### Request Headers
```
Content-Type: application/json
Authorization: Bearer <user_access_token>
```

#### Request Body Structure
```json
{
  "id": "string (optional - for updates)",
  "title": "string (required)",
  "sections": "array (required)",
  "isPublic": "boolean (optional, default: false)",
  "userId": "string (auto-filled from session)",
  "createdAt": "string (ISO datetime, auto-filled)",
  "updatedAt": "string (ISO datetime, auto-filled)"
}
```

#### Section Object Structure
Each section in the `sections` array has this structure:

```json
{
  "id": "string (unique identifier, e.g., 'section-1640995200000')",
  "type": "string (one of: 'text', 'image', 'text-image')",
  "order": "number (0-based ordering)",
  "content": {
    "text": "string (optional - only for text/text-image types)",
    "imageUrl": "string (optional - only for image/text-image types)",
    "imageAlt": "string (optional - alt text for images)",
    "layout": "string (one of: 'left', 'right', 'center')",
    "backgroundColor": "string (hex color, e.g., '#ffffff')",
    "textColor": "string (hex color, e.g., '#333333')",
    "fontSize": "string (one of: 'small', 'medium', 'large', 'xl')"
  }
}
```

#### Example Complete Request
```json
{
  "title": "Welcome to Our Real Estate Platform",
  "sections": [
    {
      "id": "section-1640995200000",
      "type": "text",
      "order": 0,
      "content": {
        "text": "Welcome to the best real estate platform in Vietnam",
        "layout": "center",
        "backgroundColor": "#ffffff",
        "textColor": "#333333",
        "fontSize": "large"
      }
    },
    {
      "id": "section-1640995201000",
      "type": "image",
      "order": 1,
      "content": {
        "imageUrl": "https://example.com/images/hero.jpg",
        "imageAlt": "Beautiful house exterior",
        "layout": "center",
        "backgroundColor": "#f8f9fa"
      }
    },
    {
      "id": "section-1640995202000",
      "type": "text-image",
      "order": 2,
      "content": {
        "text": "Find your dream home with our advanced search features",
        "imageUrl": "https://example.com/images/search.jpg",
        "imageAlt": "Search interface",
        "layout": "left",
        "backgroundColor": "#ffffff",
        "textColor": "#555555",
        "fontSize": "medium"
      }
    }
  ],
  "isPublic": true
}
```

#### Success Response
```json
{
  "success": true,
  "message": "Landing page saved successfully",
  "id": "landing_page_id",
  "url": "/landing/landing_page_id",
  "data": {
    // Complete landing page object with backend-generated fields
  }
}
```

#### Error Response
```json
{
  "error": "Error Type",
  "message": "Human-readable error message in Vietnamese"
}
```

### 2. Get User's Landing Pages
**Endpoint:** `GET /api/landing-pages?page=0`  
**Purpose:** Retrieve user's landing pages with pagination

#### Response
```json
{
  "content": [
    {
      "id": "string",
      "title": "string", 
      "isPublic": "boolean",
      "createdAt": "string",
      "updatedAt": "string",
      "sections": "array"
      // ... other fields
    }
  ],
  "page": "number",
  "totalPages": "number",
  "totalElements": "number"
}
```

### 3. Update Landing Page
**Endpoint:** `PUT /api/landing-pages`  
**Purpose:** Update an existing landing page

Uses the same request body structure as the POST endpoint, but requires an `id` field.

## Image Upload API

### Upload Landing Page Image
**Endpoint:** `POST /api/media/upload/landing-image`  
**Content-Type:** `multipart/form-data`

#### Request Body (FormData)
```
image: File (required)
userId: string (auto-filled from session)
type: string ("landing-page")
```

#### File Validation
- **Allowed types:** image/* (JPG, PNG, GIF, WebP)
- **Max size:** 5MB
- **Required:** File must be a valid image

#### Success Response
```json
{
  "success": true,
  "message": "Image uploaded successfully",
  "url": "string (full URL to access the image)",
  "filename": "string",
  "size": "number",
  "type": "string"
}
```

#### Error Response
```json
{
  "error": "Error Type",
  "message": "Error description in Vietnamese"
}
```

### Delete Image (Optional)
**Endpoint:** `DELETE /api/media/upload-landing-image?url=<image_url>`

## Database Schema Recommendations

Based on the API structure, here's a recommended database schema:

### landing_pages table
```sql
CREATE TABLE landing_pages (
    id VARCHAR(255) PRIMARY KEY,
    user_id VARCHAR(255) NOT NULL,
    title VARCHAR(100) NOT NULL,
    is_public BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_user_id (user_id),
    INDEX idx_created_at (created_at)
);
```

### landing_page_sections table
```sql
CREATE TABLE landing_page_sections (
    id VARCHAR(255) PRIMARY KEY,
    landing_page_id VARCHAR(255) NOT NULL,
    section_type ENUM('text', 'image', 'text-image') NOT NULL,
    section_order INT NOT NULL,
    content JSON NOT NULL,
    FOREIGN KEY (landing_page_id) REFERENCES landing_pages(id) ON DELETE CASCADE,
    INDEX idx_landing_page_order (landing_page_id, section_order)
);
```

### media_files table (for tracking uploaded images)
```sql
CREATE TABLE media_files (
    id VARCHAR(255) PRIMARY KEY,
    user_id VARCHAR(255) NOT NULL,
    file_path VARCHAR(500) NOT NULL,
    file_name VARCHAR(255) NOT NULL,
    file_size INT NOT NULL,
    file_type VARCHAR(100) NOT NULL,
    upload_type ENUM('landing-page', 'post', 'profile') DEFAULT 'landing-page',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_user_id (user_id),
    INDEX idx_upload_type (upload_type)
);
```

## Section Type Details

### 1. Text Section (`type: "text"`)
- **Purpose:** Display formatted text content
- **Required fields:** `content.text`
- **Optional styling:** `textColor`, `backgroundColor`, `fontSize`, `layout`

### 2. Image Section (`type: "image"`)  
- **Purpose:** Display a single image
- **Required fields:** `content.imageUrl`
- **Optional fields:** `content.imageAlt`, `content.layout`, `content.backgroundColor`

### 3. Text + Image Section (`type: "text-image"`)
- **Purpose:** Display text alongside an image
- **Required fields:** `content.text`, `content.imageUrl`
- **Layout options:**
  - `"left"`: Text on left, image on right
  - `"right"`: Text on right, image on left  
  - `"center"`: Text above image, both centered

## Authentication Requirements

All endpoints require a valid user session with:
- User ID or email identifier
- Access token (if using JWT authentication)
- Session validation to prevent unauthorized access

## Error Handling

The frontend expects these error types:
- **Validation Error** (400): Missing/invalid input data
- **Unauthorized** (401): User not logged in
- **Upload Error** (400): File upload issues
- **Backend Error** (500+): Server/database errors
- **Internal Server Error** (500): Unexpected errors

All error messages should be in Vietnamese for user-facing display.

## CORS and Security

Ensure your backend API:
- Accepts requests from your frontend domain
- Validates file uploads for security
- Sanitizes user input (especially text content)
- Implements rate limiting for uploads
- Validates image file types server-side

## Testing Endpoints

You can test the endpoints with tools like Postman or curl. Here's a sample curl command:

```bash
curl -X POST "http://your-backend.com/api/landing-pages" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "title": "Test Landing Page",
    "sections": [
      {
        "id": "section-1",
        "type": "text", 
        "order": 0,
        "content": {
          "text": "Hello World",
          "layout": "center",
          "backgroundColor": "#ffffff",
          "textColor": "#333333",
          "fontSize": "medium"
        }
      }
    ],
    "isPublic": false
  }'
```