import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

interface Todo {
  id: number;
  text: string;
  done: boolean;
}

interface TodoState {
  todos: Todo[];
  addTodo: (text: string) => void;
  toggleTodo: (id: number) => void;
  removeTodo: (id: number) => void;
}

export const useTodoStore = create<TodoState>()(
  devtools(
    (set) => ({
      todos: [],
      addTodo: (text: string) => {
        set(
          (state) => ({
            todos: [...state.todos, { id: Date.now(), text, done: false }],
          }),
          false,
          'addTodo',
        );
      },
      toggleTodo: (id: number) => {
        set(
          (state) => ({
            todos: state.todos.map((todo) =>
              todo.id === id ? { ...todo, done: !todo.done } : todo,
            ),
          }),
          false,
          'toggleTodo',
        );
      },
      removeTodo: (id: number) => {
        set(
          (state) => ({
            todos: state.todos.filter((todo) => todo.id !== id),
          }),
          false,
          'removeTodo',
        );
      },
    }),
    { name: 'TodoStore' },
  ),
);
