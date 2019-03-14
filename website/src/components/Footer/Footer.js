import React from 'react';
import GitHubLink from '../common/GitHubLink/GitHubLink';
import styles from './styles.module.scss';

export default class Footer extends React.Component {
    render() {
        return (
            <div className={styles.footer}>
                <GitHubLink />
            </div>
        )
    }
}
