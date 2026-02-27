# Virtual Try-On Feature - Setup Guide

This guide explains how to set up the Virtual Try-On feature using Google Vertex AI.

## Prerequisites

1. **Google Cloud Project** with Vertex AI API enabled
2. **Service Account** with appropriate permissions
3. **service-account.json** file from your Google Cloud project

## Backend Setup (Django)

### 1. Install Dependencies

The required packages should already be installed in your virtual environment:
```bash
cd backend
.\.venv\Scripts\Activate.ps1  # Windows
pip install google-cloud-aiplatform google-auth
```

### 2. Add Service Account Credentials

Place your `service-account.json` file in the **project root** directory:
```
Sneakr.lab/
├── backend/
├── frontend/
└── service-account.json  ← Place it here
```

### 3. Enable Required APIs in Google Cloud

Make sure these APIs are enabled in your Google Cloud project:
- Vertex AI API
- Cloud Vision API (if required for Virtual Try-On)

### 4. Service Account Permissions

Your service account needs the following IAM roles:
- `Vertex AI User` or `Vertex AI Administrator`
- `Service Account Token Creator` (if needed)

### 5. Start Django Server

```bash
cd backend
.\.venv\Scripts\python.exe manage.py runserver
```

The backend will run on `http://localhost:8000`

## Frontend Setup (React)

### 1. Install Dependencies (if needed)

```bash
cd frontend
npm install
```

### 2. Start React Development Server

```bash
npm start
```

The frontend will run on `http://localhost:3000`

## How to Use

1. **Design Your Shoe**
   - Go to `/customizer`
   - Customize colors and design
   
2. **Capture Shoe Image**
   - Click the "👟 Try On Your Shoe" button
   - This saves the 3D render to localStorage
   
3. **Upload Your Photo**
   - On the Try-On page, upload a clear photo of yourself
   - Click "✨ Try On Your Shoe"
   
4. **View Result**
   - Wait for the AI to process (may take 10-30 seconds)
   - Download your try-on result!

## API Endpoint

**POST** `/api/tryon/`

**Request Body:**
```json
{
  "person_image": "data:image/png;base64,...",
  "shoe_image": "data:image/png;base64,..."
}
```

**Response:**
```json
{
  "success": true,
  "result_image": "data:image/png;base64,..."
}
```

## Troubleshooting

### Error: "service-account.json not found"
- Make sure the file is in the project root directory
- Check the file name is exactly `service-account.json`

### Error: "Google Cloud libraries not installed"
- Run: `pip install google-cloud-aiplatform google-auth`

### CORS Errors
- Make sure Django backend is running on `localhost:8000`
- React frontend should be on `localhost:3000`
- CORS is already configured in `backend/settings.py`

### API Errors
- Check your Google Cloud project has Vertex AI enabled
- Verify your service account has correct permissions
- Check the `virtual-try-on-001` model is available in `us-central1`

## Notes

- The Virtual Try-On API may have usage limits and costs
- Processing time varies (typically 10-30 seconds)
- Image quality affects results - use clear, well-lit photos
- The shoe image is captured from the 3D canvas at the current viewing angle

## File Structure

```
backend/
├── base/
│   ├── views.py          ← Virtual Try-On endpoint
│   └── urls.py           ← API routing
└── backend/
    └── settings.py       ← CORS configuration

frontend/
└── src/
    ├── components/
    │   ├── TryOnPage.js  ← Try-On UI
    │   ├── CustomizerPage.js  ← Added capture button
    │   └── Mockup3D.js   ← Added capture functionality
    └── App.js            ← Added /tryon route
```

## Security Notes

⚠️ **Important:**
- Never commit `service-account.json` to version control
- Add it to `.gitignore`
- Use environment variables for production deployments
- Restrict service account permissions to minimum required

## Support

For issues with:
- **Vertex AI API**: Check Google Cloud documentation
- **Application Bugs**: Check browser console and Django logs
- **CORS Issues**: Verify both servers are running on correct ports
