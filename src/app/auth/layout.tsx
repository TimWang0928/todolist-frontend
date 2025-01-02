import React from 'react';
const Layout = ({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) => {
    return (
        <div>
            <header></header>
            <nav></nav>
            <main>
                {children}
            </main>
            <footer></footer>
        </div>);
};
export default Layout;