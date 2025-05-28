import React from 'react'
import Header from './Header'
import Footer from './Footer';
import { Outlet } from 'react-router-dom';

const LayoutFrontend = () => {
    return (
        <>
            <Header />
            <main>
                <Outlet />
            </main>
            <Footer />
        </>
    )
}
export default LayoutFrontend;
