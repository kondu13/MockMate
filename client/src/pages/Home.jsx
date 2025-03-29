// src/pages/Home.jsx
import { Link } from 'react-router-dom';
import {useAuth} from '../hooks/useAuth';

export default function Home() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gray-100">
      <main className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-4xl font-bold text-gray-800 mb-6">Welcome to MentorMatch</h1>
        <p className="text-xl text-gray-600 mb-8">
          Connect with mentors and mentees to share knowledge and grow together.
        </p>
        
        {user ? (
          <div className="space-x-4">
            <Link
              to="/dashboard"
              className="inline-block px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
            >
              Go to Dashboard
            </Link>
          </div>
        ) : (
          <div className="space-x-4">
            <Link
              to="/login"
              className="inline-block px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="inline-block px-6 py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition"
            >
              Register
            </Link>
          </div>
        )}
      </main>
    </div>
  );
}