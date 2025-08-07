import { BrowserRouter, Navigate, useRoutes } from 'react-router-dom'
import React from 'react'

const Login = React.lazy(() => import('@/page/Login'))
const Register = React.lazy(() => import('@/page/Register'))
const Home = React.lazy(() => import('@/page/Home'))

const routes = [
    {
        path: '/',
        element: <Navigate to="/home" />
    },
    {
        path: '/login',
        element: <Login />
    }, {
        path: '/home',
        element: <Home />
    }, {
        path: '/register',
        element: <Register />
    }
]
function WrapperRoutes() {
    //useRoutes 不能被抛出
    let ele = useRoutes(routes)
    return ele

}
export default function WrapperRouter() {
    return (
        <BrowserRouter>
            <WrapperRoutes />
        </BrowserRouter>
    )
}