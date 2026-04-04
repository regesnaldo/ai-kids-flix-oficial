import { render, screen, fireEvent } from '@testing-library/react';
import Page from './page';
import React from 'react';

// Mock para o componente de fundo e outros elementos que podem ser complexos
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    h1: ({ children, ...props }: any) => <h1 {...props}>{children}</h1>,
    span: ({ children, ...props }: any) => <span {...props}>{children}</span>,
    button: ({ children, ...props }: any) => <button {...props}>{children}</button>,
    p: ({ children, ...props }: any) => <p {...props}>{children}</p>,
  },
  AnimatePresence: ({ children }: any) => <>{children}</>,
}));

describe('Laboratório de Inteligência Viva', () => {
  beforeEach(() => {
    // Reset mocks before each test
    jest.clearAllMocks();
    render(<Page />);
  });

  test('renderiza título em português', () => {
    expect(screen.getByText(/Laboratório de Inteligência Viva/i)).toBeInTheDocument();
  });

  test('input de expressão está presente', () => {
    const input = screen.getByPlaceholderText(/Expresse seu estado/i);
    expect(input).toBeInTheDocument();
  });

  test('botão Conectar Consciência está presente', () => {
    expect(screen.getByText(/Conectar Consciência/i)).toBeInTheDocument();
  });

  test('chat inicia vazio com "Aguardando..."', () => {
    expect(screen.getByText(/Aguardando/i)).toBeInTheDocument();
  });

  test('permite digitar no input', () => {
    const input = screen.getByPlaceholderText(/Expresse seu estado/i) as HTMLInputElement;
    fireEvent.change(input, { target: { value: 'Estou feliz' } });
    expect(input.value).toBe('Estou feliz');
  });
});
