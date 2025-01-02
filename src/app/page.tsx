import Image from "next/image";
import Login from '@/app/components/login';

const Home: React.FC = () => {
    const title = 'A simple to do list\nto manage you life'

    return (
        <div className="">
            <header>

            </header>
            <main className="">
                <Image
                    aria-hidden
                    src="/Work.svg"
                    alt="File icon"
                    width={160}
                    height={160}
                />
                <div>
                    <pre>
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