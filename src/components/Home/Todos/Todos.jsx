import { useEffect, useReducer, useState } from "react";
import { useHttp } from "../../../hook/useHttp";
import { apiRequest } from "../../../services/api";
import { useAuth } from "../../../context/AuthContext";
import TodoItem from "./TodoItem"; // ודאי שהנתיב נכון לפי מבנה התיקיות שלך

const todosReducer = (state, action) => {
  switch (action.type) {
    case "SET": return action.payload;
    case "ADD": return [...state, action.payload];
    case "DELETE": return state.filter(t => t.id !== action.payload);
    case "UPDATE": return state.map(t => t.id === action.payload.id ? action.payload : t);
    default: return state;
  }
};

export default function Todos() {
  const { user } = useAuth();
  const [todos, dispatch] = useReducer(todosReducer, []);
  
  const [newTodoTitle, setNewTodoTitle] = useState("");
  const [sortBy, setSortBy] = useState("id");
  const [searchType, setSearchType] = useState("title");
  const [searchValue, setSearchValue] = useState("");

  const { sendRequest, isLoading, error, clearError } = useHttp();

  useEffect(() => {
    if (!user?.id) return;
    const fetchTodos = async () => {
      try {
        const data = await sendRequest(() => apiRequest(`/todos?userId=${user.id}`));
        dispatch({ type: "SET", payload: data });
      } catch (err) {}
    };
    fetchTodos();
  }, [sendRequest, user?.id]);

  const addTodoHandler = async () => {
    if (!newTodoTitle.trim() || !user?.id) return;
    try {
      const created = await sendRequest(() =>
        apiRequest("/todos", {
          method: "POST",
          body: { title: newTodoTitle, completed: false, userId: user.id },
        })
      );
      dispatch({ type: "ADD", payload: created });
      setNewTodoTitle("");
    } catch (err) {}
  };

  const deleteTodoHandler = async (id) => {
    try {
      await sendRequest(() => apiRequest(`/todos/${id}`, { method: "DELETE" }));
      dispatch({ type: "DELETE", payload: id });
    } catch (err) {}
  };

  const toggleComplete = async (todo) => {
    try {
      const updated = await sendRequest(() =>
        apiRequest(`/todos/${todo.id}`, {
          method: "PATCH",
          body: { completed: !todo.completed },
        })
      );
      dispatch({ type: "UPDATE", payload: updated });
    } catch (err) {}
  };

  const updateTitleHandler = async (todo) => {
    const newTitle = prompt("עריכת כותרת:", todo.title);
    if (!newTitle || newTitle === todo.title) return;
    try {
      const updated = await sendRequest(() =>
        apiRequest(`/todos/${todo.id}`, {
          method: "PATCH",
          body: { title: newTitle },
        })
      );
      dispatch({ type: "UPDATE", payload: updated });
    } catch (err) {}
  };

  // לוגיקת סינון ומיון - כאן המשתנה שגרם לשגיאה
  const displayedTodos = todos
    .filter(todo => {
      if (!searchValue) return true;
      const val = searchValue.toLowerCase();
      if (searchType === "id") return todo.id.toString().includes(val);
      if (searchType === "completed") {
        if (val === "בוצע" || val === "כן") return todo.completed;
        if (val === "לא" || val === "טרם") return !todo.completed;
        return String(todo.completed).includes(val);
      }
      return todo.title.toLowerCase().includes(val);
    })
    .sort((a, b) => {
      if (sortBy === "title") return a.title.localeCompare(b.title);
      if (sortBy === "completed") return a.completed - b.completed;
      return String(a.id).localeCompare(String(b.id), undefined, { numeric: true });
    });

  return (
    <section className="todos-container">
      <h2>המטלות של {user?.username}</h2>

      <div className="input-group" style={{ marginBottom: '15px' }}>
        <input 
          value={newTodoTitle} 
          onChange={e => setNewTodoTitle(e.target.value)} 
          placeholder="משימה חדשה..." 
        />
        <button onClick={addTodoHandler} disabled={isLoading}>הוסף</button>
      </div>

      <div className="controls" style={{ marginBottom: '15px', display: 'flex', gap: '10px' }}>
        <select value={sortBy} onChange={e => setSortBy(e.target.value)}>
          <option value="id">מיין לפי ID</option>
          <option value="title">מיין לפי א-ב</option>
          <option value="completed">מיין לפי ביצוע</option>
        </select>

        <select value={searchType} onChange={e => setSearchType(e.target.value)}>
          <option value="title">חפש בכותרת</option>
          <option value="id">חפש לפי ID</option>
          <option value="completed">חפש לפי מצב</option>
        </select>
        
        <input 
          value={searchValue} 
          onChange={e => setSearchValue(e.target.value)} 
          placeholder="חפש..." 
        />
      </div>

      {isLoading && <p>טוען...</p>}
      {error && <p style={{color: "red"}} onClick={clearError}>{error} [סגור]</p>}

      <ul className="todo-list" style={{ listStyle: 'none', padding: 0 }}>
        {/* שימוש במשתנה הנכון ובקומפוננטה החדשה */}
        {displayedTodos.map(todo => (
          <TodoItem 
            key={todo.id} 
            todo={todo} 
            onToggle={toggleComplete} 
            onDelete={deleteTodoHandler} 
            onUpdate={updateTitleHandler} 
          />
        ))}
        {displayedTodos.length === 0 && !isLoading && <p>אין משימות להצגה.</p>}
      </ul>
    </section>
  );
}



// import { useEffect, useReducer, useState } from "react";
// import { useHttp } from "../../../hook/useHttp";
// import { apiRequest } from "../../../services/api";
// import { useAuth } from "../../../context/AuthContext";

// // 1. Reducer לניהול הנתונים (דרישת פרק ו')
// const todosReducer = (state, action) => {
//   switch (action.type) {
//     case "SET": return action.payload;
//     case "ADD": return [...state, action.payload];
//     case "DELETE": return state.filter(t => t.id !== action.payload);
//     case "UPDATE": return state.map(t => t.id === action.payload.id ? action.payload : t);
//     default: return state;
//   }
// };

// export default function Todos() {
//   const { user } = useAuth();
//   const [todos, dispatch] = useReducer(todosReducer, []);

//   // States לניהול הממשק
//   const [newTodoTitle, setNewTodoTitle] = useState("");
//   const [sortBy, setSortBy] = useState("id");
//   const [searchType, setSearchType] = useState("title");
//   const [searchValue, setSearchValue] = useState("");

//   const { sendRequest, isLoading, error, clearError } = useHttp();

//   // 2. טעינת המידע של המשתמש הפעיל בלבד (סעיף 50)
//   useEffect(() => {
//     if (!user?.id) return;
//     const fetchTodos = async () => {
//       try {
//         const data = await sendRequest(() => apiRequest(`/todos?userId=${user.id}`));
//         dispatch({ type: "SET", payload: data });
//       } catch (err) { }
//     };
//     fetchTodos();
//   }, [sendRequest, user?.id]);

//   // 3. פעולות CRUD (סעיף 54)
//   const addTodoHandler = async () => {
//     if (!newTodoTitle.trim()) return;
//     try {
//       const created = await sendRequest(() =>
//         apiRequest("/todos", {
//           method: "POST",
//           body: { title: newTodoTitle, completed: false, userId: user.id },
//         })
//       );
//       dispatch({ type: "ADD", payload: created });
//       setNewTodoTitle("");
//     } catch (err) { }
//   };

//   const deleteTodoHandler = async (id) => {
//     try {
//       await sendRequest(() => apiRequest(`/todos/${id}`, { method: "DELETE" }));
//       dispatch({ type: "DELETE", payload: id });
//     } catch (err) { }
//   };

//   const toggleComplete = async (todo) => {
//     try {
//       const updated = await sendRequest(() =>
//         apiRequest(`/todos/${todo.id}`, {
//           method: "PATCH", // עדכון מצב ביצוע בלבד
//           body: { completed: !todo.completed },
//         })
//       );
//       dispatch({ type: "UPDATE", payload: updated });
//     } catch (err) { }
//   };

//   const updateTitleHandler = async (todo) => {
//     const newTitle = prompt("עריכת כותרת:", todo.title);
//     if (!newTitle || newTitle === todo.title) return;
//     try {
//       const updated = await sendRequest(() =>
//         apiRequest(`/todos/${todo.id}`, {
//           method: "PATCH", // עדכון תוכן בלבד 
//           body: { title: newTitle },
//         })
//       );
//       dispatch({ type: "UPDATE", payload: updated });
//     } catch (err) { }
//   };

//   // 4. לוגיקת סינון ומיון 

//   const displayedTodos = todos
//     .filter(todo => {
//       if (!searchValue) return true; // אם התיבה ריקה, הצג הכל

//       const val = searchValue.toLowerCase();

//       // חיפוש לפי ID - עכשיו הוא בודק אם ה-ID *מכיל* את מה שכתבת
//       if (searchType === "id") {
//         return todo.id.toString().includes(val);
//       }

//       // חיפוש לפי מצב (בוצע/לא בוצע)
//       if (searchType === "completed") {
//         const status = todo.completed ? "done" : "pending";
//         return status.includes(val);
//       }

//       // ברירת מחדל: חיפוש לפי כותרת (סעיף 53)
//       return todo.title.toLowerCase().includes(val);
//     })
//     .sort((a, b) => {
//       if (sortBy === "title") return a.title.localeCompare(b.title);
//       if (sortBy === "completed") return a.completed - b.completed;
//       return a.id - b.id;
//     });

//   return (
//     <section className="todos-container">
//       <h2>המטלות של {user?.username}</h2>

//       {/* הוספה */}
//       <div className="input-group">
//         <input
//           value={newTodoTitle}
//           onChange={e => setNewTodoTitle(e.target.value)}
//           placeholder="משימה חדשה..."
//         />
//         <button onClick={addTodoHandler} disabled={isLoading}>הוסף</button>
//       </div>

//       {/* חיפוש ומיון (סעיפים 52, 53) */}
//       <div className="controls">
//         <select value={sortBy} onChange={e => setSortBy(e.target.value)}>
//           <option value="id">מיין לפי ID</option>
//           <option value="title">מיין לפי א-ב</option>
//           <option value="completed">מיין לפי ביצוע</option>
//         </select>

//         <select value={searchType} onChange={e => setSearchType(e.target.value)}>
//           <option value="title">חפש בכותרת</option>
//           <option value="id">חפש לפי ID</option>
//           <option value="completed">חפש לפי מצב</option>
//         </select>

//         <input
//           value={searchValue}
//           onChange={e => setSearchValue(e.target.value)}
//           placeholder="חפש פריטים..."
//         />
//       </div>

//       {isLoading && <p>טוען...</p>}
//       {error && <p style={{ color: "red" }} onClick={clearError}>{error} [סגור]</p>}

//       <ul className="todo-list">
//         {displayedTodos.map(todo => (
//           <li>
//             {displayedTodos.map(todo => (
//               <TodoItem
//                 key={todo.id}
//                 todo={todo}
//                 onToggle={toggleComplete}
//                 onDelete={deleteTodoHandler}
//                 onUpdate={updateTitleHandler}
//               />
//             ))}
//           </li>
//         ))}
//       </ul>
//     </section>
//   );
// }
