import { GetServerSideProps, NextPage } from 'next';
import Head from 'next/head';

interface Item {
    id: number;
    name: string;
}

interface HomePageProps {
    data: Item[];
}

const HomePage: NextPage<HomePageProps> = ({ data }) => {
    return (
        <>
            <Head>
                <title>Homepage - My Website</title>
                <meta name="description" content="This is a homepage description for SEO." />
                <meta name="keywords" content="nextjs, server-side rendering, homepage" />
            </Head>
            <div>
                <h1>Welcome to My Website</h1>
                <ul>
                    {data.map((item) => (
                        <li key={item.id}>{item.name}</li>
                    ))}
                </ul>
            </div>
        </>
    );
};

// SSR 获取数据
export const getServerSideProps: GetServerSideProps<HomePageProps> = async () => {
    // 模拟从 API 获取数据
    const data: Item[] = await fetch('https://api.example.com/data').then((res) =>
        res.json()
    );

    return {
        props: {
            data, // 通过 props 传递给页面组件
        },
    };
};

export default HomePage;
