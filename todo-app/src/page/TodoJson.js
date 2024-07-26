import React, { useState, useEffect } from 'react';
import axios from 'axios';

const TodoJson = () => {
    const [todos, setTodos] = useState([]);
    const [newTodo, setNewTodo] = useState('');
    const [editingTodo, setEditingTodo] = useState(null);
    const [editingText, setEditingText] = useState('');

    useEffect(() => {
        fetchTodos();
    }, []);

    const fetchTodos = async () => {
        try {
            const response = await axios.get('http://localhost:3001/todos');
            setTodos(response.data);
        } catch (error) {
            console.error('Error fetching todos:', error);
        }
    };

    const addTodo = async () => {
        try {
            const response = await axios.post('http://localhost:3001/todos', {
                title: newTodo,
                completed: false,
            });
            setTodos([...todos, response.data]);
            setNewTodo('');
        } catch (error) {
            console.error('Error adding todo:', error);
        }
    };

    const deleteTodo = async (id) => {
        await axios.delete(`http://localhost:3001/todos/${id}`);
        setTodos(todos.filter((todo) => todo.id !== id));
    };

    const startEditing = (todo) => {
        setEditingTodo(todo);
        setEditingText(todo.title);
    };

    const cancelEditing = () => {
        setEditingTodo(null);
        setEditingText('');
    };

    const saveTodo = async (id) => {
        try {
            const response = await axios.patch(`http://localhost:3001/todos/${id}`, { title: editingText });
            setTodos(todos.map((todo) => (todo.id === id ? response.data : todo)));
            setEditingTodo(null);
            setEditingText('');
        } catch (error) {
            console.error('Error updating todo:', error);
        }
    };

    return (
        <div className="container">
            <h1>Todo List</h1>
            <input
                type="text"
                value={newTodo}
                onChange={(e) => setNewTodo(e.target.value)}
                placeholder="New Todo"
            />
            <button className="add" onClick={addTodo}>Add Todo</button>
            <ul>
                {todos.map((todo) => (
                    <li key={todo.id}>
                        <span>{todo.title}</span>
                        {editingTodo && editingTodo.id === todo.id ? (
                            <div>
                                <input
                                    type="text"
                                    value={editingText}
                                    onChange={(e) => setEditingText(e.target.value)}
                                />
                                <div className="buttons">
                                    <button className="save" onClick={() => saveTodo(todo.id)}>Save</button>
                                    <button className="cancel" onClick={cancelEditing}>Cancel</button>
                                </div>
                            </div>
                        ) : (
                            <div className="buttons">
                                <button className="edit" onClick={() => startEditing(todo)}>Edit</button>
                                <button className="delete" onClick={() => deleteTodo(todo.id)}>Delete</button>
                            </div>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
};
export default TodoJson;