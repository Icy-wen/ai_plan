import { BrowserRouter, Navigate, useRoutes } from 'react-router-dom'
import React from 'react'
import MainLayout from '@/components/MainLayout';

const Login = React.lazy(() => import('@/page/Login'))
const Register = React.lazy(() => import('@/page/Register'))
const Home = React.lazy(() => import('@/page/Home'))
const Start=React.lazy(()=>import('@/page/Start'))
const Create=React.lazy(()=>import('@/page/Create'))
const Plan=React.lazy(()=>import('@/page/Plan'))
const Profile=React.lazy(()=>import('@/page/Profile'))
const EditIfo=React.lazy(()=>import('@/page/EditIfo'))
const Setting=React.lazy(()=>import('@/page/Setting'))
const Summary=React.lazy(()=>import('@/page/Summary'))
const AIChatPage=React.lazy(()=>import('@/page/AIChatPage'))

const routes = [
    { path: '/', element: <Navigate to="/home" /> },
    { path: '/start', element: <Start /> },
    { path: '/login', element: <Login /> },
    { path: '/register', element: <Register /> },
    // 使用 MainLayout 包裹需要底部标签的页面
    { path: '/home', element: <MainLayout><Home /></MainLayout> },
    { path: '/create', element: <MainLayout><Create /></MainLayout> },
    { path: '/plan', element: <MainLayout><Plan /></MainLayout> },
    { path: '/profile', element: <MainLayout><Profile /></MainLayout> },
    { path: '/editifo', element: <MainLayout><EditIfo /></MainLayout> },
    { path: '/setting', element: <MainLayout><Setting /></MainLayout> },
    { path: '/summary', element: <MainLayout><Summary /></MainLayout> },
    { path: '/ai-chat', element: <AIChatPage /> },
    // 可以添加一个通配符路由，处理404情况
    { path: '*', element: <Navigate to="/home" /> }
]

function WrapperRoutes() {
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