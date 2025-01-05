"use client";

import { useEffect, useState } from 'react'
import style from './signin.module.scss'
import { FormControl, Input, TextField } from '@mui/material';
import Button from '@mui/material/Button';
import { fetcher } from '@/app/utils/request';
import { useRouter } from 'next/navigation';
import toast, { Toaster } from 'react-hot-toast';

type response = {
    message: string,
    token: string,
    userId: string,
    userName: string
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
        const result = await fetcher<response>('auth/login', 'post', body).catch((res)=>{
            toast('Login failed')
        })

        if(result){
            localStorage.setItem('token', result.data.token)
            localStorage.setItem('userId', result.data.userId)
            localStorage.setItem('userName', result.data.userName)
            router.push('/home')
        }
    }

    const changeUsername = (event: any) => {
        setUsername(event.target.value)
    }
    const changePassword = (event: any) => {
        setPassword(event.target.value)
    }

    return (
        <div className={style.main}>
            <div className={style.loginContainer}>
                <h2>Login</h2>
                <FormControl className='w-[320px]'>
                    <TextField className={style.inputField} value={username} onChange={changeUsername} required />
                    <TextField className={style.inputField} value={password} type='password' onChange={changePassword} required />
                    <Button onClick={signin} className={style.loginButton}>Sing In</Button>
                </FormControl>
                <Toaster/>
            </div>
        </div>
    )
}

export default Signin