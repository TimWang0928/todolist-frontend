import Image from "next/image";
import Login from '@/app/components/login';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

const Home: React.FC = () => {
    const title = 'A simple to do list\nto manage you life!'

    return (
        <div className="">
            <header className="h-[50px] border-b border-gray-400 bg-gray-50 flex items-center justify-between pr-8 pl-8">
                <div className="todo-logo">TODO</div>
                <AccountCircleIcon className="h-[40px] w-[40px]"/>
            </header>
            <main className="flex w-full h-[calc(100vh-50px)] justify-center items-center bg-gray-50">
                <Image
                    aria-hidden
                    src="/Work.svg"
                    alt="File icon"
                    width={500}
                    height={500}
                />
                <div className="flex flex-col items-center h-[500px] justify-evenly ml-7">
                    <pre className="text-5xl font-bold text-gray-800 leading-snug font-serif">
                        {title}
                    </pre>
                    <Login></Login>
                </div>
            </main>
            <footer className="">

            </footer>
        </div>
    );
}

export default Home