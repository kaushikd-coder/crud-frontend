# HOE - Frontend Application

A modern web application built with Next.js, Redux, and React Hook Form.

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
- [Usage](#usage)
- [Project Structure](#project-structure)
- [Testing](#testing)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)

## 🔍 Overview

This application provides a comprehensive dashboard with authentication, task management, and collaboration features.

## ✨ Features

- User authentication (login/register)
- Dashboard with entity management
- Task tracking and filtering
- Collaboration with user invites
- Responsive design

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone <repository-url>
cd HOE/frontend
```

2. Install dependencies
```bash
npm install
# or
yarn install
```

3. Set up environment variables
```bash
cp .env.example .env.local
# Edit .env.local with your configuration
```

## 💻 Usage

Start the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📁 Project Structure

```
frontend/
├── app/                  # Next.js app directory
│   ├── (auth)/           # Authentication routes
│   ├── (dashboard)/      # Dashboard routes
├── components/           # Reusable components
├── features/             # Feature-specific components
├── lib/                  # Utility functions
├── services/             # API services
├── store/                # Redux store configuration
│   ├── slices/           # Redux slices
├── types/                # TypeScript type definitions
├── utils/                # Helper utilities
```

## 🧪 Testing

Run tests with:

```bash
npm test
# or
yarn test
```

## 🚢 Deployment

The application can be deployed on Vercel:

```bash
npm run build
# or
vercel deploy
```

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.
