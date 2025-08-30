# Overview

This is a full-stack web application for "Nur Mobile," an electronics store specializing in smartphones and mobile accessories. The application provides a public landing page showcasing products and store information, along with an authenticated admin dashboard for inventory management, sales tracking, and business analytics.

The application follows a modern monorepo structure with a React frontend and Express.js backend, implementing secure authentication through Replit's OAuth system and comprehensive product/sales management capabilities.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
- **Framework**: React 18 with TypeScript using Vite as the build tool
- **UI Library**: Shadcn/ui components built on Radix UI primitives
- **Styling**: Tailwind CSS with custom design tokens and dark mode support
- **State Management**: TanStack Query (React Query) for server state management
- **Routing**: Wouter for lightweight client-side routing
- **Form Handling**: React Hook Form with Zod validation

## Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **Database ORM**: Drizzle ORM for type-safe database operations
- **Database**: PostgreSQL (configured for Neon serverless)
- **Session Management**: Express sessions with PostgreSQL store
- **Authentication**: Replit OAuth integration with passport-based strategy

## Database Schema Design
- **Users Table**: Stores user profiles with OAuth integration (mandatory for Replit Auth)
- **Products Table**: Complete product catalog with inventory tracking, categories, pricing, and metadata
- **Sales Table**: Transaction records linking products to sales data with timestamps
- **Sessions Table**: Secure session storage for authentication persistence

## Authentication & Authorization
- **OAuth Provider**: Replit's OpenID Connect implementation
- **Session Strategy**: Server-side sessions stored in PostgreSQL with secure cookies
- **Route Protection**: Middleware-based authentication for admin endpoints
- **User Management**: Automatic user creation/updates on OAuth login

## API Design
- **RESTful Endpoints**: Structured around resource-based URLs
- **Product Management**: Full CRUD operations with inventory tracking
- **Sales Analytics**: Aggregated data endpoints for business intelligence
- **Error Handling**: Centralized error middleware with proper HTTP status codes
- **Request Logging**: Comprehensive logging for API monitoring

## State Management Strategy
- **Server State**: TanStack Query for caching and synchronization
- **Authentication State**: React context derived from secure API calls
- **Form State**: React Hook Form for complex form interactions
- **UI State**: Local component state and URL parameters for navigation

# External Dependencies

## Database & ORM
- **Neon Database**: Serverless PostgreSQL hosting
- **Drizzle ORM**: Type-safe database operations with migration support
- **Drizzle Kit**: Database migration and schema management tools

## Authentication Services
- **Replit OAuth**: Primary authentication provider
- **OpenID Client**: OAuth flow implementation
- **Passport.js**: Authentication middleware and strategy management

## Frontend Libraries
- **Shadcn/ui**: Pre-built accessible UI components
- **Radix UI**: Headless UI primitives for complex interactions
- **TanStack Query**: Server state management and caching
- **React Hook Form**: Form state management with validation
- **Zod**: Schema validation for forms and API data
- **Wouter**: Lightweight routing solution

## Development & Build Tools
- **Vite**: Fast development server and build tool
- **TypeScript**: Static type checking across the stack
- **Tailwind CSS**: Utility-first styling framework
- **ESBuild**: JavaScript bundling for production builds

## Session & Storage
- **Connect-PG-Simple**: PostgreSQL session store adapter
- **Express Session**: Server-side session management
- **WebSocket Support**: Real-time capabilities through Neon's WebSocket constructor