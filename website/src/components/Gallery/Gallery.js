import React from 'react';
import GalleryItem from './GalleryItem/GalleryItem';
import styles from './styles.module.scss';

// const files = [
//     '001_maze_lines',
//     '002_mountain',
//     '003_wires',
//     '004_lines_cleft',
//     '005_mountains_lines',
//     '006_circles_collection',
//     '007_circles_pack',
//     '008_circles_pack_animate',
//     '009_triangular_mesh',
//     '010_rainbow_pencil',
//     '011_smears',
//     '012_raw_3d',
//     '013_cells_machine',
//     '014_rainbow_worm',
//     '015_hypno',
//     '016_maze',
//     '017_rope',
//     '018_hair',
//     '019_lines_planet',
//     '020_schiz_square',
//     '021_color_daub',
//     '022_broken_space',
//     '023_space_interaction',
//     '024_space_balls',
//     '025_caffeine_web',
//     '026_fern',
//     '027_gradient_waves',
//     '028_book_page',
//     '029_nagative_pixel_cam',
//     '030_vinyl_cam',
//     '031_dots_cam',
//     '032_ball_of_hair',
//     '033_branch_planet',
//     '034_tree',
//     '035_color_chaos',
//     '036_tadpole_colony',
//     '037_dla',
//     '038_dla_in',
//     '039_bloody_canvas_game',
//     '040_radial_segments',
//     '041_hypno_multi_spiral',
//     '042_flower',
//     '043_stars_tunnel',
//     '044_infinity',
//     '045_infinity2',
//     '046_corridor',
//     '047_hypno_square',
//     '048_chalk_spiral',
//     '049_circles_madness',
//     '050_wave',
//     '051_pixel_mania_game',
//     '052_wave_cam',
//     '053_sands_cam',
//     '054_tornado_cam',
//     '055_ragged_canvas',
//     '056_nums_cam',
//     '057_carnival_mirror_cam',
//     '058_toxic_cam',
//     '059_vhs_glitch_cam',
//     '060_star',
//     '061_star2',
//     '062_draw',
//     '063_draw_conway',
//     '064_lines_artifact',
//     '065_lines_rain',
//     '066_fun_text',
//     '067_text_particles',
//     '068_plopping_trash',
// ];

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
                    if (isCam) {
                        name = name.replace(isCamRegexp, '');
                    }

                    const isGameRegexp = /_game$/;
                    const isGame = isGameRegexp.test(name);
                    if (isGame) {
                        name = name.replace(isGameRegexp, '');
                    }

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
