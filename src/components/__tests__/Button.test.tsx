import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

// Simple example component test
// This demonstrates testing patterns without Convex dependencies

describe('Component Testing Examples', () => {
  it('demonstrates basic rendering', () => {
    const TestComponent = () => <div>Hello World</div>;
    render(<TestComponent />);
    expect(screen.getByText('Hello World')).toBeInTheDocument();
  });

  it('demonstrates user interactions', async () => {
    const handleClick = vi.fn();
    const TestButton = () => (
      <button onClick={handleClick}>Click me</button>
    );

    const user = userEvent.setup();
    render(<TestButton />);

    await user.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('demonstrates testing props', () => {
    const Greeting = ({ name }: { name: string }) => (
      <div>Hello, {name}!</div>
    );

    render(<Greeting name="World" />);
    expect(screen.getByText('Hello, World!')).toBeInTheDocument();
  });

  it('demonstrates conditional rendering', () => {
    const ConditionalComponent = ({ show }: { show: boolean }) => (
      <div>{show ? 'Visible' : 'Hidden'}</div>
    );

    const { rerender } = render(<ConditionalComponent show={true} />);
    expect(screen.getByText('Visible')).toBeInTheDocument();

    rerender(<ConditionalComponent show={false} />);
    expect(screen.getByText('Hidden')).toBeInTheDocument();
  });

  it('demonstrates testing lists', () => {
    const items = ['Apple', 'Banana', 'Cherry'];
    const ListComponent = () => (
      <ul>
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    );

    render(<ListComponent />);
    expect(screen.getByText('Apple')).toBeInTheDocument();
    expect(screen.getByText('Banana')).toBeInTheDocument();
    expect(screen.getByText('Cherry')).toBeInTheDocument();
  });
});
