# Content Management System (CMS) - React Web Application

## Overview

This project is a Single Page Application (SPA) built with React as part of a web development course.
It interacts with a REST API (JSON-Server) and allows users to manage personal data such as tasks, posts, and photo albums through a clear and user-friendly interface.

## Features

* **Authentication System**: Login and Registration with password verification and session persistence using Local Storage
* **User Dashboard (Home)**: Personalized page with user details and navigation
* **Todos Management**: Full CRUD operations (Add, Edit, Delete, Toggle), including search and sorting
* **Posts & Comments**: View posts, search content, and manage comments (Add, Edit, Delete) for user-owned posts
* **Photo Albums**: Browse albums and photos with optimized loading (pagination / lazy loading)
* **Advanced Routing**: Implemented with React Router v6 using informative URLs
* **State Persistence & Caching**: Basic mechanisms to preserve state after refresh and reduce unnecessary API calls

## Technologies Used

* **Frontend**: React (Hooks, Context API, React Router v6), HTML5, CSS3
* **Backend Simulation**: JSON-Server (REST API)
* **State Management**: useState, useEffect, useContext, useReducer, useMemo
* **Async Operations**: JavaScript Promises, Async/Await, Fetch API

## Project Structure

* Component-based architecture
* Separation of concerns (JS, CSS, components)
* Single main entry file (index.js)

## Getting Started

1. Clone the repository
2. Install dependencies:

   ```
   npm install
   ```
3. Run the local server:

   ```
   npx json-server --watch db.json --port 3000
   ```
4. Start the React app:

   ```
   npm start
   ```

## Notes

* The application uses a local JSON-Server as a mock backend
* User session is stored in Local Storage
* Data is not permanently saved (mock API behavior)
