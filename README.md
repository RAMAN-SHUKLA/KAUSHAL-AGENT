# KAUSHAL - Hiring Platform

KAUSHAL is a modern hiring platform that connects employers with potential candidates. The platform provides a streamlined experience for both administrators and job seekers.

## Features

### For Administrators
- Dashboard with real-time statistics
- Job posting and management
- Application tracking
- User management
- Analytics and reporting

### For Candidates
- User-friendly job browsing
- Easy application process
- Application status tracking
- Profile management
- Skills assessment

## Technology Stack

- **Frontend**: React.js with Vite
- **Styling**: Tailwind CSS
- **Backend**: Supabase
- **Authentication**: Supabase Auth
- **Database**: PostgreSQL (via Supabase)
- **State Management**: React Context
- **Notifications**: React Toastify

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Git

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/YOUR_USERNAME/hiring-agent.git
   cd hiring-agent
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory and add your Supabase credentials:
   ```
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

## Project Structure

```
hiring-agent/
├── src/
│   ├── components/
│   │   ├── admin/       # Admin-specific components
│   │   ├── auth/        # Authentication components
│   │   └── layout/      # Layout components
│   ├── pages/
│   │   ├── admin/       # Admin pages
│   │   ├── auth/        # Auth pages
│   │   └── candidate/   # Candidate pages
│   ├── config/          # Configuration files
│   ├── contexts/        # React contexts
│   └── App.jsx          # Main application component
├── public/              # Static assets
└── package.json         # Project dependencies
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Contact

ramanshukla2005@gmail.com

Project Link: https://github.com/RAMAN-SHUKLA/KAUSHAL-AGENT
