import { useState, useEffect } from "react"
import { auth, db } from "./firebase"
import { onAuthStateChanged, signOut } from "firebase/auth"
import {
collection, addDoc, deleteDoc,
doc, onSnapshot, updateDoc
} from "firebase/firestore"
import Auth from "./components/Auth"

function App() {
const [todayTasks, setTodayTasks] = useState([])
const [tomorrowTasks, setTomorrowTasks] = useState([])
const [note, setNote] = useState("")
const [todayInput, setTodayInput] = useState("")
const [tomorrowInput, setTomorrowInput] = useState("")
const [user, setUser] = useState(null)
const [dark, setDark] = useState(false)

useEffect(() => {
onAuthStateChanged(auth, setUser)
}, [])

useEffect(() => {
if (!user) return
const todayRef = collection(db, "users", user.uid, "today")
const unsubToday = onSnapshot(todayRef, (snap) => {
setTodayTasks(snap.docs.map(d => ({ id: d.id, ...d.data() })))
})
const tomorrowRef = collection(db, "users", user.uid, "tomorrow")
const unsubTomorrow = onSnapshot(tomorrowRef, (snap) => {
setTomorrowTasks(snap.docs.map(d => ({ id: d.id, ...d.data() })))
})
return () => { unsubToday(); unsubTomorrow() }
}, [user])

const addToday = async () => {
if (!todayInput.trim()) return
await addDoc(collection(db, "users", user.uid, "today"), {
text: todayInput, done: false
})
setTodayInput("")
}

const addTomorrow = async () => {
if (!tomorrowInput.trim()) return
await addDoc(collection(db, "users", user.uid, "tomorrow"), {
text: tomorrowInput, done: false
})
setTomorrowInput("")
}

const toggleTask = async (col, id, done) => {
await updateDoc(doc(db, "users", user.uid, col, id), { done: !done })
}

const deleteTask = async (col, id) => {
await deleteDoc(doc(db, "users", user.uid, col, id))
}

const doneTodayCount = todayTasks.filter(t => t.done).length
const totalToday = todayTasks.length
const progress = totalToday === 0 ? 0 : Math.round((doneTodayCount / totalToday) * 100)

if (!user) return <Auth />

return (
<div style={{
backgroundColor: dark ? "#1E1E2E" : "#fde8e8",
minHeight: "100vh",
padding: "20px",
fontFamily: "Segoe UI, sans-serif"
}}>
{/* Top bar */}
<div style={{
display: "flex",
justifyContent: "space-between",
alignItems: "center",
maxWidth: "800px",
margin: "0 auto 20px"
}}>
<h1 style={{
fontSize: "18px",
letterSpacing: "3px",
textTransform: "uppercase",
color: dark ? "#fff" : "#555"
}}>Get It Done</h1>
<div style={{ display: "flex", gap: "8px" }}>
<button onClick={() => setDark(!dark)} style={{
background: "white", border: "none", padding: "8px 14px",
borderRadius: "20px", cursor: "pointer", fontSize: "13px", color: "#555"
}}>
{dark ? "☀ Light" : "🌙 Dark"}
</button>
<button onClick={() => signOut(auth)} style={{
background: "white", border: "none", padding: "8px 14px",
borderRadius: "20px", cursor: "pointer", fontSize: "13px", color: "#555"
}}>Logout</button>
</div>
</div>

{/* Grid */}
<div style={{
display: "grid",
gridTemplateColumns: "1fr 1fr",
gap: "16px",
maxWidth: "800px",
margin: "0 auto"
}}>
{/* TODAY */}
<div style={{
background: dark ? "#2D2D3F" : "#fce4ec",
borderRadius: "16px",
border: "2px dashed #e0b4b4",
padding: "20px"
}}>
<h2 style={{ textAlign: "center", letterSpacing: "2px", color: "#888", fontSize: "13px", marginBottom: "14px" }}>TODAY</h2>
<div style={{ display: "flex", gap: "8px", marginBottom: "12px" }}>
<input
value={todayInput}
onChange={e => setTodayInput(e.target.value)}
placeholder="Add a task..."
style={{ flex: 1, padding: "8px 12px", borderRadius: "20px", border: "1px solid #ddd", fontSize: "13px", outline: "none" }}
/>
<button onClick={addToday} style={{
padding: "8px 14px", background: "white", border: "1px solid #ddd",
borderRadius: "20px", cursor: "pointer", fontSize: "13px"
}}>Add</button>
</div>
{todayTasks.map(task => (
<div key={task.id} style={{ display: "flex", alignItems: "center", gap: "8px", padding: "6px 0", borderBottom: "1px solid #f0e0e0" }}>
<input type="checkbox" checked={task.done}
onChange={() => toggleTask("today", task.id, task.done)} />
<span style={{ flex: 1, fontSize: "13px", color: dark ? "#ddd" : "#555", textDecoration: task.done ? "line-through" : "none" }}>
{task.text}
</span>
<button onClick={() => deleteTask("today", task.id)}
style={{ background: "none", border: "none", color: "#e57373", cursor: "pointer" }}>✕</button>
</div>
))}
</div>

{/* TRACKER */}
<div style={{
background: dark ? "#2D2D3F" : "#e8f5e9",
borderRadius: "16px",
border: "2px dashed #a5d6a7",
padding: "20px"
}}>
<h2 style={{ textAlign: "center", letterSpacing: "2px", color: "#888", fontSize: "13px", marginBottom: "14px" }}>TRACKER</h2>
<p style={{ fontSize: "13px", color: "#666", marginBottom: "8px" }}>
Total: {totalToday} &nbsp; Done: {doneTodayCount} &nbsp; Progress: {progress}%
</p>
<div style={{ background: "#ddd", borderRadius: "10px", height: "10px" }}>
<div style={{
width: `${progress}%`, background: "#81c784",
height: "10px", borderRadius: "10px", transition: "width 0.3s"
}} />
</div>
</div>

{/* IMPORTANT NOTES */}
<div style={{
background: dark ? "#2D2D3F" : "#fffde7",
borderRadius: "16px",
border: "2px dashed #fff176",
padding: "20px"
}}>
<h2 style={{ textAlign: "center", letterSpacing: "2px", color: "#888", fontSize: "13px", marginBottom: "14px" }}>IMPORTANT NOTES</h2>
<textarea
value={note}
onChange={e => setNote(e.target.value)}
placeholder="Write your important notes here..."
style={{
width: "100%", height: "80px", border: "none", background: "transparent",
resize: "none", fontSize: "13px", color: dark ? "#ddd" : "#555", outline: "none"
}}
/>
</div>

{/* TOMORROW */}
<div style={{
background: dark ? "#2D2D3F" : "#ede7f6",
borderRadius: "16px",
border: "2px dashed #b39ddb",
padding: "20px"
}}>
<h2 style={{ textAlign: "center", letterSpacing: "2px", color: "#888", fontSize: "13px", marginBottom: "14px" }}>TOMORROW</h2>
<div style={{ display: "flex", gap: "8px", marginBottom: "12px" }}>
<input
value={tomorrowInput}
onChange={e => setTomorrowInput(e.target.value)}
placeholder="Add a task..."
style={{ flex: 1, padding: "8px 12px", borderRadius: "20px", border: "1px solid #ddd", fontSize: "13px", outline: "none" }}
/>
<button onClick={addTomorrow} style={{
padding: "8px 14px", background: "white", border: "1px solid #ddd",
borderRadius: "20px", cursor: "pointer", fontSize: "13px"
}}>Add</button>
</div>
{tomorrowTasks.map(task => (
<div key={task.id} style={{ display: "flex", alignItems: "center", gap: "8px", padding: "6px 0", borderBottom: "1px solid #e8d5f5" }}>
<input type="checkbox" checked={task.done}
onChange={() => toggleTask("tomorrow", task.id, task.done)} />
<span style={{ flex: 1, fontSize: "13px", color: dark ? "#ddd" : "#555", textDecoration: task.done ? "line-through" : "none" }}>
{task.text}
</span>
<button onClick={() => deleteTask("tomorrow", task.id)}
style={{ background: "none", border: "none", color: "#e57373", cursor: "pointer" }}>✕</button>
</div>
))}
</div>
</div>
</div>
)
}
export default App
