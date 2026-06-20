import { useState } from "react"
import { auth } from "../firebase"
import {
createUserWithEmailAndPassword,
signInWithEmailAndPassword
} from "firebase/auth"

function Auth() {
const [email, setEmail] = useState("")
const [password, setPassword] = useState("")
const [isLogin, setIsLogin] = useState(true)
const [error, setError] = useState("")

const handleSubmit = async () => {
setError("")
try {
if (isLogin) {
await signInWithEmailAndPassword(auth, email, password)
} else {
await createUserWithEmailAndPassword(auth, email, password)
}
} catch (err) {
if (err.code === "auth/email-already-in-use") {
setError("You already have an account! Please login.")
} else if (err.code === "auth/wrong-password") {
setError("Wrong password, try again.")
} else if (err.code === "auth/user-not-found") {
setError("No account found. Please sign up.")
} else if (err.code === "auth/weak-password") {
setError("Password must be at least 6 characters.")
} else {
setError("Something went wrong. Please try again.")
}
}
}

return (
<div className="auth">
<h2>{isLogin ? "Login" : "Sign Up"}</h2>
<input placeholder="Email"
onChange={e => setEmail(e.target.value)} />
<input type="password" placeholder="Password"
onChange={e => setPassword(e.target.value)} />
{error && <p style={{ color: "red" }}>{error}</p>}
<button onClick={handleSubmit}>
{isLogin ? "Login" : "Sign Up"}
</button>
<p onClick={() => setIsLogin(!isLogin)}>
{isLogin ? "Need an account? Sign up" : "Have an account? Login"}
</p>
</div>
)
}
export default Auth
