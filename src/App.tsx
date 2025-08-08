import { useEffect, useMemo, useState } from 'react'
import { Input } from './components/ui/input'
import { Button } from './components/ui/button'
import { Checkbox } from './components/ui/checkbox'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from './components/ui/card'

type Todo = {
  id: string
  title: string
  completed: boolean
}

const STORAGE_KEY = 'todos'

function App() {
  const [todos, setTodos] = useState<Todo[]>([])
  const [query, setQuery] = useState('')
  const [newTodo, setNewTodo] = useState('')

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) setTodos(JSON.parse(saved))
  }, [])

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos))
  }, [todos])

  const filteredTodos = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return todos
    return todos.filter((t) => t.title.toLowerCase().includes(q))
  }, [todos, query])

  function addTodo() {
    const title = newTodo.trim()
    if (!title) return
    const todo: Todo = { id: crypto.randomUUID(), title, completed: false }
    setTodos((prev) => [todo, ...prev])
    setNewTodo('')
  }

  function toggleTodo(id: string) {
    setTodos((prev) => prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)))
  }

  function removeTodo(id: string) {
    setTodos((prev) => prev.filter((t) => t.id !== id))
  }

  function clearCompleted() {
    setTodos((prev) => prev.filter((t) => !t.completed))
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <Card className="w-full max-w-xl">
        <CardHeader>
          <CardTitle className="text-2xl">Lista de Tarefas Guilherme</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder="Nova tarefa"
              value={newTodo}
              onChange={(e) => setNewTodo(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && addTodo()}
            />
            <Button onClick={addTodo}>Adicionar</Button>
          </div>
          <div className="flex gap-2">
            <Input
              placeholder="Buscar"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <Button variant="secondary" onClick={clearCompleted}>
              Limpar concluídas
            </Button>
          </div>
          <ul className="space-y-2">
            {filteredTodos.map((todo) => (
              <li key={todo.id} className="flex items-center gap-3 p-2 rounded border">
                <Checkbox checked={todo.completed} onCheckedChange={() => toggleTodo(todo.id)} />
                <span className={todo.completed ? 'line-through text-muted-foreground flex-1' : 'flex-1'}>
                  {todo.title}
                </span>
                <Button variant="destructive" size="sm" onClick={() => removeTodo(todo.id)}>
                  Remover
                </Button>
              </li>
            ))}
            {filteredTodos.length === 0 && (
              <li className="text-sm text-muted-foreground">Sem tarefas</li>
            )}
          </ul>
        </CardContent>
        <CardFooter className="text-sm text-muted-foreground">
          {todos.filter((t) => !t.completed).length} pendente(s) de {todos.length}
        </CardFooter>
      </Card>
    </div>
  )
}

export default App
