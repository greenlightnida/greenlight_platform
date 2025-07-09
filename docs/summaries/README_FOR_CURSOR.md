# README_FOR_CURSOR.md

## Holon System: Elevate Unified Sports Platform

This directory contains a comprehensive sports management system built with multiple interconnected holons (self-contained modules) for Elevate Sports. The system integrates media intelligence, team collaboration, player recruitment, and program management into a unified platform.

## Holon Architecture

### Protected Holon
- **Media Intelligence Holon**: OCR-based media tagging and player card generation
  - **Status**: Protected - do not modify directly
  - **Location**: `src/components/PhotoUpload.tsx`, `src/components/MediaLibrary.tsx`
  - **Purpose**: Core media processing functionality

### Active Development Holons
- **Team Portal Holon**: Unified team collaboration and CRM platform
- **Player Grid Holon**: Visual progress tracking and recruitment motivation  
- **Cohort Management Holon**: Program and camp lifecycle management

## Development Guidelines

### Holon Protection Rules
- **Media Intelligence Holon**: Protected - no direct modifications without owner approval
- **Other Holons**: Active development - extend through sibling modules or direct enhancement
- **Integration**: Use shared services and utilities for cross-holon communication
- **Data Flow**: Maintain unified database schema across all holons

### Extension Patterns
- **Sibling Modules**: Create new holons for major new functionality
- **Direct Enhancement**: Extend existing active holons for minor features
- **Shared Services**: Use `src/services/` and `src/utils/` for cross-holon functionality
- **Database Integration**: Extend schema through migrations, maintain data consistency

## System Overview
- **Frontend**: React + TypeScript + Tailwind CSS + Vite
- **Backend**: Supabase with unified database schema
- **Architecture**: Holon-based modular design with unified data flow
- **Integration**: Real-time synchronization across all holons

## Key Files
- `architecture.json` - System/AI overview with holon definitions
- `README.md` - Developer documentation and usage guidelines
- `src/App.tsx` - Main application with holon switching
- `src/components/` - Holon entry points and shared components

**Owner:** Nida Nizam (nida@greenlight.live) 