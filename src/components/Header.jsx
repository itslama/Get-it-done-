function Header({ dark }) {
return (
<header style={{
color: dark ? "#ffffff" : "#000000",
padding: "20px",
textAlign: "center",
}}>
    <h1 style={{ color: dark ? "#ffffff" : "#000000" }}>Get It Done</h1>
</header>
)
}

export default Header
