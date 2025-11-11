# Box File Sharing App

A modern file sharing application inspired by Box, built with React, TypeScript, and Node.js. Users receive a shareable link via email where they can upload and download files.

## Features

- 📁 **File Upload & Download** - Drag and drop interface for easy file management
- 🔗 **Shareable Links** - Generate unique links for file sharing
- 📧 **Email Notifications** - Optionally send sharing links via email
- 🎨 **Modern UI** - Beautiful interface built with Ant Design
- 📊 **File Management** - View file details, sizes, and upload times
- 🗑️ **Delete Files** - Remove files from shared folders
- 💾 **Large File Support** - Upload files up to 100MB

## Tech Stack

### Frontend
- React 18
- TypeScript
- Vite
- Ant Design
- React Router
- Axios

### Backend
- Node.js
- Express
- TypeScript
- Multer (file uploads)
- Nodemailer (email)

## Project Structure

```
my-box-claude-code/
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── components/    # React components
│   │   │   ├── FileUpload.tsx
│   │   │   └── FileList.tsx
│   │   ├── pages/         # Page components
│   │   │   ├── Home.tsx
│   │   │   └── SharedFolder.tsx
│   │   ├── services/      # API services
│   │   │   └── api.ts
│   │   ├── types/         # TypeScript types
│   │   │   └── index.ts
│   │   ├── App.tsx
│   │   └── main.tsx
│   └── package.json
│
└── server/                # Backend Node.js application
    ├── src/
    │   ├── controllers/   # Request handlers
    │   │   ├── fileController.ts
    │   │   └── linkController.ts
    │   ├── models/        # Data models
    │   │   └── Storage.ts
    │   ├── routes/        # API routes
    │   │   ├── fileRoutes.ts
    │   │   └── linkRoutes.ts
    │   ├── utils/         # Utilities
    │   │   └── email.ts
    │   └── index.ts
    ├── uploads/           # Uploaded files storage
    ├── data.json          # File metadata storage
    └── package.json
```

## Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd my-box-claude-code
   ```

2. **Install backend dependencies**
   ```bash
   cd server
   npm install
   ```

3. **Install frontend dependencies**
   ```bash
   cd ../client
   npm install
   ```

### Running the Application

You need to run both the backend and frontend servers:

#### Terminal 1 - Backend Server
```bash
cd server
npm run dev
```
The backend will start on http://localhost:3001

#### Terminal 2 - Frontend Server
```bash
cd client
npm run dev
```
The frontend will start on http://localhost:5173

### Using the Application

1. **Open your browser** and navigate to http://localhost:5173

2. **Create a sharing link**:
   - Optionally enter an email address
   - Click "Create Sharing Link"
   - Copy the generated link or open it directly

3. **Share files**:
   - Open the shared link
   - Drag and drop files to upload
   - Download or delete existing files
   - Anyone with the link can upload/download files

## Configuration

### Backend Configuration (.env)

The backend uses environment variables for configuration. Edit `server/.env`:

```env
PORT=3001
NODE_ENV=development
CLIENT_URL=http://localhost:5173

# For production email (uncomment and configure)
# SMTP_HOST=smtp.gmail.com
# SMTP_PORT=587
# SMTP_SECURE=false
# SMTP_USER=your-email@gmail.com
# SMTP_PASS=your-app-password
# SMTP_FROM=noreply@boxapp.com
```

### Frontend Configuration (.env)

Edit `client/.env`:

```env
VITE_API_URL=http://localhost:3001/api
```

## API Endpoints

### Links
- `POST /api/links/create` - Create a new sharing link
- `GET /api/links/:token` - Get link information

### Files
- `POST /api/files/:token/upload` - Upload a file
- `GET /api/files/:token/files` - Get all files for a link
- `DELETE /api/files/:token/files/:fileId` - Delete a file
- `GET /api/files/:token/files/:fileId/download` - Download a file

## Development

### Backend Development
```bash
cd server
npm run dev        # Run with hot reload
npm run build      # Build TypeScript to JavaScript
npm start          # Run production build
```

### Frontend Development
```bash
cd client
npm run dev        # Run development server
npm run build      # Build for production
npm run preview    # Preview production build
```

## Production Deployment

### Backend
1. Set `NODE_ENV=production` in `.env`
2. Configure SMTP settings for real email delivery
3. Build the application: `npm run build`
4. Run with: `npm start`

### Frontend
1. Update `VITE_API_URL` to your production API URL
2. Build: `npm run build`
3. Deploy the `dist` folder to your hosting service

## Email Configuration

In development mode, emails are logged to the console. For production:

1. Configure an SMTP provider (Gmail, SendGrid, etc.)
2. Update `server/.env` with SMTP credentials
3. For Gmail, use an [App Password](https://support.google.com/accounts/answer/185833)

## Security Considerations

- Implement authentication for production use
- Add rate limiting to prevent abuse
- Validate file types and sizes
- Implement link expiration
- Use HTTPS in production
- Add virus scanning for uploaded files

## Future Enhancements

- [ ] User authentication
- [ ] Link expiration dates
- [ ] Password-protected links
- [ ] File versioning
- [ ] Folder organization
- [ ] Search functionality
- [ ] File previews
- [ ] Upload progress for multiple files
- [ ] Drag and drop for folders

## License

MIT

## Support

For issues and questions, please open an issue on GitHub.