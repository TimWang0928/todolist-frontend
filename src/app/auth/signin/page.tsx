"use client";

import { useEffect, useState } from 'react'
import style from './signin.module.scss'
import { Input } from '@mui/material';
import Button from '@mui/material/Button';
import { fetcher } from '@/app/utils/request';
import { useRouter } from 'next/navigation';

type response = {
    message: string,
    token: string,
    userId:string
}

const Signin: React.FC = () => {
    const [username, setUsername] = useState('admin')
    const [password, setPassword] = useState('12345')
    const router = useRouter();

    useEffect(() => {

    })
    const signin = async () => {
        const body = {
            username: username,
            password: password
        }
        const result = await fetcher<response>('auth/login', 'post', body)
        localStorage.setItem('token', result.data.token)
        localStorage.setItem('userId', result.data.userId)
        router.push('/home')
    }

    const changeUsername = (event: any) => {
        setUsername(event.target.value)
    }
    const changePassword = (event: any) => {
        setPassword(event.target.value)
    }

    return (
        <div className={style.main}>
            <Input value={username} onChange={changeUsername} />
            <Input value={password} type='password' onChange={changePassword} />
            <Button onClick={signin}>Sing In</Button>
        </div>
    )
}

export default Signin