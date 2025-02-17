
# Q - Student Advisor Queue Management System

## Overview

Q is a modern web application designed to streamline the student advising process at educational institutions. It provides an efficient way for students to join a queue for academic advising while automatically managing advisor assignments and wait times.

## Features

- **Smart Queue Management**
  - Automatic advisor assignment based on availability and workload
  - Real-time wait time estimates
  - Room number notifications
  - Maximum queue size control

- **Student Features**
  - Easy queue registration with name and student number validation
  - Real-time position tracking
  - Automatic advisor and room assignment
  - Clear notifications and status updates

- **Form Validation**
  - Full name validation (first and last name required)
  - Student number validation (10 digits required)
  - Name format validation (letters, hyphens, and apostrophes only)
  - Required fields validation

- **User Interface**
  - Clean, modern design
  - Responsive layout
  - Toast notifications for important updates
  - Animated components for better user experience

## Technology Stack

- **Frontend Framework**: React
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Type Safety**: TypeScript
- **State Management**: React Query
- **Toast Notifications**: Custom toast system

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn package manager

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Start the development server:
```bash
npm run dev
# or
yarn dev
```

4. Open your browser and navigate to `http://localhost:8080`

## Usage

### For Students

1. Navigate to the main page
2. Fill in your details:
   - Full name (first and last name)
   - Student number (10 digits)
   - Reason for visit
3. Click "Join Queue"
4. You'll receive a notification with your assigned advisor and room number
5. Monitor your position in the queue

### For Administrators

1. Navigate to `/admin`
2. Manage the queue:
   - View current queue status
   - Adjust advisor availability
   - Remove students from queue
   - Change advisor assignments
   - Monitor queue statistics

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Built with [Lovable](https://lovable.dev)
- UI components from [shadcn/ui](https://ui.shadcn.com/)
- Icons from [Lucide](https://lucide.dev/)

