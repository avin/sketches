import React from 'react';
import styles from './styles.module.scss';

export default class Header extends React.Component {
    render() {
        return (
            <div className={styles.header}>
                <h1 className={styles.mainHeader}>Sketches</h1>
                <h2 className={styles.subHeader}>by Avin Grape</h2>
            </div>
        )
    }
}
