import React from 'react';

export default function TodoItem({ todo, onToggle, onDelete, onUpdate }) {
  return (
    <li className="todo-item" style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '5px 0' }}>
      <span>{todo.id}</span>
      <input 
        type="checkbox" 
        checked={todo.completed} 
        onChange={() => onToggle(todo)} 
      />
      <span style={{ 
        textDecoration: todo.completed ? "line-through" : "none",
        flex: 1 
      }}>
        {todo.title}
      </span>
      <div className="actions">
         <button onClick={() => onUpdate(todo)} title="ערוך כותרת">📝</button>
         <button onClick={() => onDelete(todo.id)} title="מחק משימה">🗑️</button>
      </div>
    </li>
  );
}