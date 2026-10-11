# Testing Guide for Elite Irrigation & Landscaping OS

This guide covers how to run, write, and maintain tests for the Elite Irrigation & Landscaping OS project.

## Table of Contents

- [Setup](#setup)
- [Running Tests](#running-tests)
- [Writing Tests](#writing-tests)
- [Testing Conventions](#testing-conventions)
- [Common Patterns](#common-patterns)
- [Test Structure](#test-structure)

## Setup

The testing infrastructure is already set up with the following dependencies:

- **Vitest**: Test runner (configured in `vitest.config.ts`)
- **React Testing Library**: For testing React components
- **MSW (Mock Service Worker)**: For mocking API requests
- **Coverage tools**: For generating coverage reports

## Running Tests

### Run all tests in watch mode
```bash
npm test
```

### Run tests once
```bash
npm run test:run
```

### Run tests with UI
```bash
npm run test:ui
```
This opens the Vitest UI in your browser for an interactive test experience.

### Generate coverage report
```bash
npm run test:coverage
```
Coverage reports will be generated in the `coverage` directory.

## Writing Tests

### Component Tests

Component tests should be placed in `src/components/__tests__/` or alongside the component file.

#### Example Component Test

```typescript
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { renderWithRouter, renderWithProviders } from '../test/utils';

// Mock dependencies
vi.mock('../AuthProvider', () => ({
  useAuth: vi.fn(),
}));

describe('MyComponent', () => {
  it('renders correctly', () => {
    const { useAuth } = await import('../AuthProvider');
    vi.mocked(useAuth).mockReturnValue({
      user: { name: 'Test User', role: 'admin' },
      loading: false,
    });

    renderWithProviders(<MyComponent />);
    expect(screen.getByText('Hello')).toBeInTheDocument();
  });
});
```

### Convex Tests

Convex tests should be placed in `convex/__tests__/`.

#### Example Convex Test

```typescript
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { MockDatabase, runMutationWithMockDb } from '../test/helpers';

describe('MyConvexFunction', () => {
  let mockDb: MockDatabase;

  beforeEach(() => {
    mockDb = new MockDatabase();
    vi.clearAllMocks();
  });

  it('performs mutation correctly', async () => {
    const { myMutation } = await import('../myFile');
    const result = await runMutationWithMockDb(
      myMutation,
      mockDb,
      { arg1: 'value' }
    );

    expect(result.success).toBe(true);
  });
});
```

## Testing Conventions

### File Naming

- Test files should end with `.test.ts` or `.test.tsx`
- Test files should be co-located with the code they test or in `__tests__` directories

### Test Structure

Follow the AAA pattern (Arrange, Act, Assert):

```typescript
it('does something', async () => {
  // Arrange - Set up the test
  const mockUser = createMockUser();
  vi.mocked(useAuth).mockReturnValue({ user: mockUser });

  // Act - Execute the code being tested
  render(<MyComponent />);
  const button = screen.getByRole('button');

  // Assert - Verify the result
  expect(button).toBeEnabled();
});
```

### Test Descriptions

- Use `describe` to group related tests
- Use `it` or `test` to describe individual test cases
- Test descriptions should be clear and descriptive
- Start descriptions with what is being tested, not "should"

Good:
```typescript
it('redirects to login when not authenticated', () => {});
it('renders children when authenticated', () => {});
```

Avoid:
```typescript
it('should redirect', () => {});
it('works correctly', () => {});
```

## Common Patterns

### Testing Components with Authentication

```typescript
import { renderWithProviders } from '../test/utils';

it('shows admin content for admin users', async () => {
  const { useAuth } = await import('../AuthProvider');
  vi.mocked(useAuth).mockReturnValue({
    user: { role: 'admin', ... },
    loading: false,
  });

  renderWithProviders(<AdminDashboard />);
  expect(screen.getByText('Admin Panel')).toBeInTheDocument();
});
```

### Testing Components with Routing

```typescript
import { renderWithRouter } from '../test/utils';

it('navigates to correct route', () => {
  renderWithRouter(
    <MyComponent />,
    { routerProps: { initialEntries: ['/test'] } }
  );

  expect(screen.getByText('Test Page')).toBeInTheDocument();
});
```

### Testing Async Operations

```typescript
it('loads data asynchronously', async () => {
  const mockData = { items: [] };
  vi.mocked(useQuery).mockReturnValue(mockData);

  render(<MyComponent />);

  await waitFor(() => {
    expect(screen.getByText('Items loaded')).toBeInTheDocument();
  });
});
```

### Mocking Convex Queries and Mutations

```typescript
import { mockConvexQuery, mockConvexMutation } from '../test/utils';

it('uses Convex query', () => {
  const mockData = { users: [] };
  vi.mocked(useQuery).mockReturnValue(mockData);

  render(<UserList />);
  expect(screen.getByText('No users')).toBeInTheDocument();
});
```

### Testing User Interactions

```typescript
import { renderWithProviders } from '../test/utils';
import userEvent from '@testing-library/user-event';

it('handles button click', async () => {
  const user = userEvent.setup();
  const handleClick = vi.fn();

  renderWithProviders(<Button onClick={handleClick}>Click me</Button>);

  await user.click(screen.getByRole('button'));
  expect(handleClick).toHaveBeenCalledTimes(1);
});
```

## Test Structure

### Directory Layout

```
elite-os/
├── src/
│   ├── components/
│   │   ├── __tests__/
│   │   │   └── ProtectedRoute.test.tsx
│   │   └── ...
│   └── test/
│       ├── setup.ts
│       ├── utils.tsx
│       └── mocks/
│           └── data.ts
├── convex/
│   ├── __tests__/
│   │   └── auth.test.ts
│   └── test/
│       └── helpers.ts
├── vitest.config.ts
└── TESTING.md
```

### Test Utilities

Located in `src/test/utils.tsx`:

- `renderWithRouter()` - Renders components with HashRouter
- `renderWithAuth()` - Renders components with AuthProvider
- `renderWithProviders()` - Renders components with both router and auth
- `mockConvexQuery()` - Mocks Convex queries
- `mockConvexMutation()` - Mocks Convex mutations
- `createMockUser()` - Creates mock user objects

### Mock Data

Located in `src/test/mocks/data.ts`:

- `mockUsers` - Pre-defined mock users
- `mockLeads` - Pre-defined mock leads
- `mockEstimates` - Pre-defined mock estimates
- `mockWorkOrders` - Pre-defined mock work orders
- `mockInvoices` - Pre-defined mock invoices
- Helper functions to create mock data

### Convex Test Helpers

Located in `convex/test/helpers.ts`:

- `MockDatabase` - In-memory database for testing
- `mockContext()` - Creates mock Convex context
- `createMockContext()` - Creates context with mock database
- `runQueryWithMockDb()` - Runs queries with mock database
- `runMutationWithMockDb()` - Runs mutations with mock database

## Best Practices

1. **Test behavior, not implementation** - Focus on what the component does, not how it does it
2. **Keep tests simple** - Each test should verify one thing
3. **Use descriptive test names** - Make it clear what is being tested
4. **Mock external dependencies** - Use mocks for Convex, API calls, etc.
5. **Test edge cases** - Don't just test the happy path
6. **Keep tests fast** - Avoid unnecessary delays or complex setups
7. **Maintain test independence** - Tests should not depend on each other
8. **Use beforeEach wisely** - Reset state between tests when needed

## Debugging Tests

### Run tests in verbose mode
```bash
npm test -- --verbose
```

### Run only specific tests
```bash
npm test -- --grep "test name"
```

### Debug with browser
```bash
npm run test:ui
```

## Continuous Integration

Tests should run automatically in CI/CD pipelines:

```yaml
# Example GitHub Actions workflow
- name: Run tests
  run: npm run test:run

- name: Generate coverage
  run: npm run test:coverage
```

## Resources

- [Vitest Documentation](https://vitest.dev/)
- [React Testing Library](https://testing-library.com/react)
- [Convex Testing Guide](https://docs.convex.dev/testing)

## Troubleshooting

### Tests are timing out
- Increase timeout in test: `it('test', { timeout: 10000 }, () => {})`
- Check for infinite loops or unresolved promises

### Mocks aren't working
- Make sure to clear mocks in `beforeEach()`
- Use `vi.mocked()` for TypeScript support

### Tests pass locally but fail in CI
- Check environment variables
- Ensure all dependencies are installed
- Verify file paths are correct

### Coverage is low
- Focus on testing critical paths first
- Add tests for edge cases and error handling
- Test utility functions and helpers

## Contributing

When adding new features:

1. Write tests first (TDD approach recommended)
2. Ensure all tests pass before committing
3. Maintain or improve test coverage
4. Add integration tests for complex features
5. Update this guide if adding new testing patterns
