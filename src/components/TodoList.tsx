import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Plus, Trash2, CheckCircle2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Todo {
  id: string;
  text: string;
  completed: boolean;
  createdAt: number;
}

const TodoList = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [inputValue, setInputValue] = useState("");
  const { toast } = useToast();

  // Load todos from localStorage on mount
  useEffect(() => {
    const savedTodos = localStorage.getItem("todos");
    if (savedTodos) {
      try {
        setTodos(JSON.parse(savedTodos));
      } catch (error) {
        console.error("Error loading todos:", error);
      }
    }
  }, []);

  // Save todos to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("todos", JSON.stringify(todos));
  }, [todos]);

  const addTodo = () => {
    if (!inputValue.trim()) {
      toast({
        variant: "destructive",
        title: "Oops!",
        description: "Please enter a task",
      });
      return;
    }

    const newTodo: Todo = {
      id: Date.now().toString(),
      text: inputValue.trim(),
      completed: false,
      createdAt: Date.now(),
    };

    setTodos([newTodo, ...todos]);
    setInputValue("");
    toast({
      title: "Task added!",
      description: "Your task has been added successfully",
    });
  };

  const toggleTodo = (id: string) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  const deleteTodo = (id: string) => {
    setTodos(todos.filter((todo) => todo.id !== id));
    toast({
      title: "Task deleted",
      description: "Task removed successfully",
    });
  };

  const clearCompleted = () => {
    const completedCount = todos.filter((todo) => todo.completed).length;
    if (completedCount === 0) {
      toast({
        title: "No completed tasks",
        description: "There are no completed tasks to clear",
      });
      return;
    }
    setTodos(todos.filter((todo) => !todo.completed));
    toast({
      title: "Completed tasks cleared",
      description: `${completedCount} task${completedCount > 1 ? "s" : ""} removed`,
    });
  };

  const remainingTasks = todos.filter((todo) => !todo.completed).length;

  return (
    <div className="min-h-screen bg-background py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <header className="text-center mb-8 animate-in fade-in slide-in-from-top duration-500">
          <h1 className="text-4xl font-bold text-foreground mb-2">My Todo List</h1>
          <p className="text-muted-foreground">Stay organized, get things done</p>
        </header>

        {/* Add Todo Form */}
        <div className="bg-card rounded-xl p-6 mb-6 shadow-[var(--shadow-medium)] animate-in fade-in slide-in-from-top duration-500 delay-100">
          <div className="flex gap-3">
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && addTodo()}
              placeholder="What needs to be done?"
              className="flex-1 border-input focus:ring-2 focus:ring-primary transition-all"
            />
            <Button
              onClick={addTodo}
              size="lg"
              className="bg-primary hover:bg-primary/90 transition-all"
            >
              <Plus className="w-5 h-5 mr-2" />
              Add
            </Button>
          </div>
        </div>

        {/* Task Counter and Clear Button */}
        {todos.length > 0 && (
          <div className="flex items-center justify-between mb-4 px-2 animate-in fade-in slide-in-from-top duration-500 delay-200">
            <div className="flex items-center gap-2 text-muted-foreground">
              <CheckCircle2 className="w-5 h-5" />
              <span className="font-medium">
                {remainingTasks} {remainingTasks === 1 ? "task" : "tasks"} remaining
              </span>
            </div>
            {todos.some((todo) => todo.completed) && (
              <Button
                onClick={clearCompleted}
                variant="ghost"
                size="sm"
                className="text-destructive hover:text-destructive hover:bg-destructive/10"
              >
                Clear Completed
              </Button>
            )}
          </div>
        )}

        {/* Todo List */}
        <div className="space-y-3">
          {todos.length === 0 ? (
            <div className="bg-card rounded-xl p-12 text-center shadow-[var(--shadow-soft)] animate-in fade-in slide-in-from-top duration-500 delay-300">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">
                No tasks yet
              </h3>
              <p className="text-muted-foreground">
                Add your first task to get started!
              </p>
            </div>
          ) : (
            todos.map((todo, index) => (
              <div
                key={todo.id}
                className="bg-card rounded-xl p-4 shadow-[var(--shadow-soft)] hover:shadow-[var(--shadow-medium)] transition-all animate-in fade-in slide-in-from-left duration-300"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="flex items-center gap-4">
                  <Checkbox
                    checked={todo.completed}
                    onCheckedChange={() => toggleTodo(todo.id)}
                    className="w-5 h-5 border-2 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                  />
                  <span
                    className={`flex-1 transition-all ${
                      todo.completed
                        ? "line-through text-muted-foreground"
                        : "text-foreground"
                    }`}
                  >
                    {todo.text}
                  </span>
                  <Button
                    onClick={() => deleteTodo(todo.id)}
                    variant="ghost"
                    size="icon"
                    className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default TodoList;
