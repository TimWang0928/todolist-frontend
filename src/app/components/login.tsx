// "use client";
import Button from '@mui/material/Button';
import Link from 'next/link';

const signinButtion: React.FC = () => {

    return (
        <Button
            variant="contained"
        >
            <Link href={'/auth/signin'}>Sign In</Link>
        </Button>
    )
}

export default signinButtion