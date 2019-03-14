import React from 'react';
import GalleryItem from './GalleryItem/GalleryItem';
import styles from './styles.module.scss';

export default class Gallery extends React.Component {
    state = {
        ready: false,
        items: [],
    };

    async componentDidMount() {
        try {
            const filesList = await fetch('files.json').then(function(response) {
                return response.json();
            });

            const items = [];
            for (let i = 0; i < filesList.length; i++) {
                let file = filesList[i];

                const match = file.match(/([\d]+)_(.*)?/);
                if (match) {
                    let [, num, name] = match;

                    const fileName = file + '.html';

                    const isCamRegexp = /_cam$/;
                    const isCam = isCamRegexp.test(name);

                    const isGameRegexp = /_game$/;
                    const isGame = isGameRegexp.test(name);

                    name = name.replace(/_/gi, ' ');
                    name = name.charAt(0).toUpperCase() + name.slice(1);

                    items.push({
                        id: 'id' + i,
                        number: Number(num),
                        title: name,
                        fileName,
                        image: `preview/${file}.jpg`,
                        smallImage: `preview/small/${file}.jpg`,
                        isCam,
                        isGame,
                    });
                }
            }

            this.setState({ items, ready: true });
        } catch (e) {
            console.warn(e);
        }
    }

    render() {
        const { ready, items } = this.state;

        if (!ready) {
            return <div className={styles.loading}>Loading ...</div>;
        }

        return <div className={styles.gallery}>{items.map(item => <GalleryItem key={item.id} {...item} />)}</div>;
    }
}
