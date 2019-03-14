import React from 'react';
import Header from '../Header/Header';
import Gallery from '../Gallery/Gallery';
import Footer from '../Footer/Footer';

export default class Root extends React.Component {
    render() {
        return (
            <div>
                <Header />
                <Gallery />
                <Footer />
            </div>
        )
    }
}
