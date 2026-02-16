# Code Snippet Manager (official name TBD)
## By Jarom Craghead, Chandler Silk, and Ryan Wood

## Project Overview

Code Snippet Manager is a web-based application that allows developers to save, organize, and share reusable code snippets. The platform provides syntax highlighting, tagging capabilities, and search functionality to help developers maintain a personal library of useful code blocks they can reference across projects.

### Key Features
- Create, read, update, and delete code snippets 
- Syntax highlighting for multiple programming languages
- Tag-based organization and search
- User authentication and personal snippet libraries
- Public/private snippet visibility controls
- Copy-to-clipboard functionality

## System Description

## Technologies Used

### Frontend

### Backend

### Database

### Development Tools
- **Git/GitHub**: Version control and collaboration

## Repository Structure

## Implemented Use Cases

The current prototype implements the following use cases to demonstrate the complete architecture:

1. **User Registration**: New users can create accounts (exercises frontend form → API endpoint → database insert → encrypted password storage)
2. **User Login**: Existing users authenticate (demonstrates JWT token generation and session management)
3. **Create Snippet**: Authenticated users can save new code snippets (full stack: UI → API → database → response)
4. **View Snippets**: Users can browse their saved snippets with syntax highlighting (database query → API → frontend rendering)
5. **Search Snippets**: Users can search by title, language, or tags (demonstrates database querying and filtering logic)

These use cases exercise all architectural layers: user interface, client-server communication via REST API, business logic processing, and database operations (CRUD).

## Setup Instructions

### Prerequisites

### Installation

1. Clone the repository

## Demo Video

[Link to demo video will be added here]

## Team Members and Contacts

- Jarom Craghead
- Chandler Silk
- Ryan Wood (rmw367@nau.edu)
