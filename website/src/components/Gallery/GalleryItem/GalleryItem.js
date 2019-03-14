import React from 'react';
import styles from './styles.module.scss';
import LazyLoad from 'react-lazy-load';
import CamIcon from '../../common/icons/CamIcon';
import GameIcon from '../../common/icons/GameIcon';

export default class GalleryItem extends React.Component {
    render() {
        const { title, fileName, image, smallImage, isCam, isGame } = this.props;

        return (
            <a href={`./${fileName}`} className={styles.item}>
                <div className={styles.back} style={{ backgroundImage: ` url("${smallImage}")` }} />

                <LazyLoad height={200} className={styles.image}>
                    <img src={image} alt="" />
                </LazyLoad>

                <div className={styles.head}>
                    <div>{title}</div>
                    {isCam ? (
                        <div>
                            <CamIcon size={16} color={'#FFF'} />
                        </div>
                    ) : null}
                    {isGame ? (
                        <div>
                            <GameIcon size={16} color={'#FFF'} />
                        </div>
                    ) : null}
                </div>
            </a>
        );
    }
}
