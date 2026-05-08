---
name: backend-development
description: Helps with backend and API integration tasks. Use when you need to work with server-side logic or external services.
---

# Backend Development Skill

Detailed instructions for the agent regarding backend and API integration in the PromptVista ML project.

## When to use this skill

- Use this when setting up API communication or handling data flow from external services.
- This is helpful for data fetching logic and integrating the frontend with the Supabase client.

## How to use it

### Design Patterns
- **Service Layer Abstraction**: All database interactions are centralized in `src/services/supabase.js`. Do not call Supabase methods directly from components; add a new service function instead.
- **Async/Await**: Use `async/await` for all asynchronous operations with explicit error handling using `try/catch` or `.catch()`.
- **Environment Variables**: Always use `import.meta.env.VITE_...` for sensitive keys (Supabase URL/Key).

### Conventions
- **API Documentation**: Refer to `src/pages/ApiDocs.jsx` for understanding the structure of API request/response examples provided to users.
- **Error Handling**: Log errors to the console with descriptive messages to aid debugging.
- **Data Transformation**: Perform any necessary data cleaning or transformation within the service layer before returning data to the frontend.
