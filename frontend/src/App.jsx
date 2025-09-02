import { Outlet, Link } from 'react-router-dom'

export default function App() {
  return (
    <div className="app-shell">
      <nav className="glass">
        <Link to="/">Home</Link>
        <Link to="/community">Community</Link>
        <Link to="/community/new">Write</Link>
        <Link to="/login">Login</Link>
      </nav>
      <main>
        <Outlet />
      </main>
    </div>
  )
}


