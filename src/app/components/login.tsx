// "use client";
import Button from '@mui/material/Button';
import Link from 'next/link';

const signinButtion: React.FC = () => {

    return (
        <Button
            variant="contained"
            className='px-6 py-3 text-white rounded-lg shadow-md hover:bg-blue-700 w-64 h-16 text-xl'
        >
            <Link href={'/auth/signin'}>Get Started</Link>
        </Button>
    )
}

export default signinButtion