import { BrowserRouter as Router, Link } from 'react-router-dom'
import Navbar from './components/Navbar'
import PageRoutes from './PageRoutes'
import { UserContext } from './Context/UserContext'
import React, { useContext } from 'react';



export default function HomePage() {
    const { currentUser, signInUser } = useContext(UserContext);

    return (
        <Router>
            <div>
                <PageRoutes />
            </div>
        </Router>
    )
}