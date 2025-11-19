# 4Komments Client

A modern Angular application for managing comments and user interactions. Built with Angular 19, Ng-Zorro Ant Design, and TypeScript.

## Project Overview

This client application provides a comprehensive comment management system with the following features:

- **User Authentication**: Login and registration with JWT token-based authentication
- **Comment Management**: Create, read, update, and delete comments
- **User Management**: Admin functionality for managing users
- **Audit Trail**: Track all system activities and changes
- **Responsive UI**: Modern interface built with Ng-Zorro Ant Design components
- **Real-time Notifications**: Toast messages and notifications for user feedback

## Technology Stack

- **Framework**: Angular 19.2.18
- **UI Library**: Ng-Zorro Ant Design
- **Language**: TypeScript 5.7.2
- **Styling**: SCSS
- **Testing**: Jasmine + Karma
- **HTTP Client**: Angular HttpClient with RxJS

## Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Angular CLI 19.2.18

## Installation

1. Navigate to the client directory:
   ```bash
   cd client
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables:
   Copy `src/environments/environment.ts` and update the API URL:
   ```typescript
   export const environment = {
     production: false,
     apiUrl: 'http://localhost:3000' // Update with your backend URL
   };
   ```

## Development Server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Usage Guide

### Authentication
1. **Login**: Use existing credentials to access the application
2. **Register**: Create a new account with username and password
3. **Logout**: Clear session and return to login page

### Comment Management
- **View Comments**: Browse all comments in the data table
- **Create Comment**: Add new comments with text and metadata
- **Edit Comment**: Modify existing comment content and state
- **Delete Comment**: Remove comments (admin only)
- **State Management**: Change comment status (published, unpublished, archived)

### User Management (Admin)
- View all registered users
- Manage user roles and permissions
- Monitor user activities

### Audit Trail
- Track all system changes and user actions
- View detailed activity logs
- Monitor system security events

## Testing

### Unit Tests

To execute unit tests with the [Karma](https://karma-runner.github.io) test runner, use the following command:

```bash
ng test
```

The test suite includes comprehensive coverage for:
- **Services**: AuthService, CommentService, NotificationService, StateService
- **Components**: DataTableComponent, ModalFormComponent, LoginComponent
- **HTTP Mocking**: All API calls are properly mocked
- **Component Interactions**: Input/output binding and event emission

### Test Coverage

Current test coverage includes:
- Authentication flow (login, register, logout, token refresh)
- Comment CRUD operations
- Form validation and submission
- UI component interactions
- Error handling scenarios

### Running Tests in CI/CD

Tests are configured to run in headless mode for CI/CD pipelines:

```bash
ng test --watch=false --browsers=ChromeHeadless
```

## Project Structure

```
src/
├── app/
│   ├── features/
│   │   ├── auth/          # Authentication module
│   │   ├── comments/      # Comment management
│   │   ├── users/         # User management
│   │   ├── audits/        # Audit trail
│   │   └── history/       # History tracking
│   ├── shared/
│   │   ├── components/    # Reusable UI components
│   │   └── services/      # Shared business logic
│   ├── guards/            # Route guards
│   ├── models/            # TypeScript interfaces
│   └── core/              # Core application logic
├── environments/          # Environment configurations
└── assets/                # Static assets
```

## Building for Production

To build the project for production:

```bash
ng build --configuration=production
```

The build artifacts will be stored in the `dist/client/` directory, optimized for performance and speed.

## Deployment

1. Build the application for production
2. Serve the `dist/client/` directory with any static file server
3. Configure your backend API URL in the environment files
4. Ensure HTTPS in production environments

## Contributing

1. Follow Angular style guide
2. Write unit tests for new features
3. Update documentation as needed
4. Use conventional commit messages

## Additional Resources

- [Angular Documentation](https://angular.dev/)
- [Ng-Zorro Documentation](https://ng.ant.design/)
- [Angular CLI Reference](https://angular.dev/tools/cli)
- [RxJS Documentation](https://rxjs.dev/)
