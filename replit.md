# Addiction Recovery Web Application

## Overview

This is a comprehensive addiction recovery support application built with modern web technologies. The app provides a safe, private, and supportive digital environment for individuals on their recovery journey. Core features include streak tracking, encrypted private journaling, daily affirmations, progress visualization, crisis support tools (panic button), and milestone management. The application follows a wellness-focused design approach inspired by mindfulness apps like Headspace and Calm, emphasizing emotional support and visual calm.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: TanStack Query (React Query) for server state management
- **UI Components**: Radix UI primitives with custom shadcn/ui component library
- **Styling**: Tailwind CSS with custom design system supporting light/dark themes
- **Build Tool**: Vite for fast development and optimized production builds

### Backend Architecture
- **Runtime**: Node.js with Express.js server
- **Language**: TypeScript throughout the stack
- **API Pattern**: RESTful endpoints under `/api` namespace
- **Session Management**: Express sessions with PostgreSQL storage
- **Authentication**: Replit Auth integration with OpenID Connect
- **Security**: CSRF protection for state-changing operations, encrypted journal entries

### Data Storage Solutions
- **Database**: PostgreSQL with Drizzle ORM for type-safe database operations
- **Session Storage**: PostgreSQL-backed session store using connect-pg-simple
- **Schema Management**: Drizzle Kit for database migrations and schema changes
- **Encryption**: AES-256-GCM encryption for sensitive journal content with scrypt key derivation

### Authentication and Authorization
- **Provider**: Replit Auth with OpenID Connect flow
- **Session Management**: Secure HTTP-only cookies with configurable expiration
- **CSRF Protection**: Token-based CSRF protection for authenticated state-changing requests
- **Authorization**: Route-level protection requiring authenticated sessions

### External Dependencies
- **Database Hosting**: Neon Database (serverless PostgreSQL)
- **Font Provider**: Google Fonts (Inter, DM Sans, Geist Mono, etc.)
- **UI Components**: Radix UI ecosystem for accessible component primitives
- **Icons**: Lucide React for consistent iconography
- **Development Tools**: Replit-specific development plugins and error handling