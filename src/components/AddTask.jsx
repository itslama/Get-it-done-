import { useState } from "react"

function AddTask({ onAdd }) {
const [text, setText] = useState("")

const handleSubmit = () => {
if (!text.trim()) return
onAdd(text)
setText("")
}

return (
<div className="add-task">
<input
value={text}
onChange={(e) => setText(e.target.value)}
placeholder="Add a new task..."
/>
<button onClick={handleSubmit}>Add</button>
</div>
)
}
export default AddTask
