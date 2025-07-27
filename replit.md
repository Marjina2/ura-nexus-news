# Replit.md - News Platform Application

## Overview

This is a full-stack news platform application called "Pulsee" (previously "URA") that provides AI-enhanced news content with user authentication, article management, and social features. The application follows a modern web architecture with a React frontend, Express.js backend, PostgreSQL database, and various third-party integrations.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Styling**: Tailwind CSS with shadcn/ui components
- **State Management**: TanStack Query (React Query) for server state
- **Routing**: React Router v6 with lazy loading
- **Build Tool**: Vite with custom configuration
- **UI Library**: Radix UI components with custom styling

### Backend Architecture
- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js with ESM modules
- **Database ORM**: Drizzle ORM
- **Database**: PostgreSQL (configured for Neon)
- **Authentication**: Clerk integration
- **Session Management**: Connect-pg-simple for PostgreSQL sessions

### Database Architecture
- **Primary Database**: PostgreSQL with Drizzle ORM
- **Connection**: Neon serverless PostgreSQL
- **Schema Location**: `shared/schema.ts` (shared between client and server)
- **Migrations**: Managed through Drizzle Kit

## Key Components

### Authentication System
- **Provider**: Clerk for authentication and user management
- **Features**: Email verification, phone verification, OAuth support
- **User Profiles**: Custom profile system with country, verification status, and device tracking
- **Protection**: Route-level authentication with protected routes

### News Management System
- **Multiple Article Types**: 
  - Regular news articles from external sources
  - AI-generated articles
  - Spotlight articles for breaking news
  - Cached articles for performance
- **Content Enhancement**: AI-powered title rephrasing and content summarization
- **Categories**: Support for multiple news categories (technology, business, sports, etc.)
- **Regional Content**: Country-specific news filtering

### User Features
- **Bookmarking System**: Save articles with full metadata
- **Article Sharing**: Social sharing capabilities
- **Personalization**: User preferences and reading history
- **Real-time Updates**: Live news updates and notifications

### Content Creation Tools
- **API Integration**: SERP API for external news sources
- **Image Generation**: Automated image sourcing for articles
- **Content Licensing**: Built-in licensing system for content creators
- **Analytics**: Usage tracking and performance metrics

## Data Flow

### Article Processing Pipeline
1. **External Source Ingestion**: News fetched from various APIs (GNews, SERP API)
2. **AI Enhancement**: Titles rephrased, summaries generated
3. **Storage**: Articles stored in PostgreSQL with full metadata
4. **Caching**: Frequently accessed articles cached for performance
5. **Delivery**: Articles served through REST API with pagination

### User Interaction Flow
1. **Authentication**: User signs in through Clerk
2. **Profile Creation**: User data synced with custom profile system
3. **Content Consumption**: Articles fetched based on user preferences
4. **Engagement**: Bookmarking, sharing, and viewing tracked
5. **Personalization**: AI learns from user behavior for content curation

## External Dependencies

### Authentication & User Management
- **Clerk**: Complete authentication solution with OAuth providers
- **Supabase**: Secondary integration (appears to be legacy/transitional)

### Data & Content
- **Neon Database**: Serverless PostgreSQL hosting
- **GNews API**: Primary news content source
- **SERP API**: Additional news and image sourcing
- **Various News Sources**: Multiple RSS and API feeds

### Frontend Libraries
- **React Query**: Server state management
- **Radix UI**: Accessible component primitives
- **Tailwind CSS**: Utility-first styling
- **React Hook Form**: Form management with Zod validation

### Monitoring & Analytics
- **Replit Integration**: Development environment integration
- **Performance Monitoring**: Built-in analytics system

## Deployment Strategy

### Development Environment
- **Primary**: Replit-based development with hot reload
- **Local Development**: Vite dev server with Express backend
- **Database**: Neon PostgreSQL for both development and production

### Production Build
- **Frontend**: Vite build system generating optimized static assets
- **Backend**: esbuild bundling for Node.js deployment
- **Assets**: Static file serving through Express
- **Environment**: Production-ready Express server with compression and security

### Database Management
- **Schema**: Centralized schema definition in TypeScript
- **Migrations**: Drizzle Kit for database schema changes
- **Connection Pooling**: Neon's built-in connection pooling
- **Backup**: Managed through Neon's infrastructure

### Scaling Considerations
- **Frontend**: CDN-ready static assets
- **Backend**: Stateless Express server for horizontal scaling
- **Database**: Serverless PostgreSQL with automatic scaling
- **Caching**: Article caching system to reduce database load

The application is designed as a modern, scalable news platform with strong emphasis on user experience, content quality through AI enhancement, and creator tools for content licensing and distribution.

## Recent Migration Changes (July 27, 2025)

### Migration Status: COMPLETED ✓
- ✓ Successfully migrated from Lovable to Replit environment
- ✓ Re-integrated Supabase for news data storage (with proper URL conversion)
- ✓ Implemented Clerk authentication system (requires proper publishable key)
- ✓ Created automatic news fetching scheduler (every 10 minutes)
- ✓ Fixed all LSP diagnostics and code issues
- ✓ All migration checklist items completed

### Current Architecture
- **Frontend**: React 18 + TypeScript + Tailwind CSS + Vite
- **Backend**: Express.js + TypeScript + Drizzle ORM
- **Authentication**: Clerk (replacing Supabase Auth)
- **Database**: Supabase PostgreSQL for news storage
- **News Fetching**: Automatic updates every 10 minutes from Supabase
- **Environment**: Replit-based development and production

### Next Steps Required
1. **Create Supabase Tables**: Run the SQL script in `supabase-setup.sql` in your Supabase SQL Editor
2. **Verify Clerk Key**: Ensure VITE_CLERK_PUBLISHABLE_KEY is correctly set
3. **Test Authentication**: Once tables are created, test sign-in/sign-up functionality

### Key Files Modified
- `server/supabase.ts` - Supabase integration with URL conversion
- `server/routes.ts` - Updated to use Supabase for news data
- `server/newsScheduler.ts` - Automatic news updates every 10 minutes
- `client/src/App.tsx` - Clerk authentication setup
- `supabase-setup.sql` - Database schema for news tables