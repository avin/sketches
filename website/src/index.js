import React from 'react';
import ReactDOM from 'react-dom';
import './styles/index.scss';
import Root from './components/Root/Root';
import * as serviceWorker from './serviceWorker';

ReactDOM.render(<Root />, document.getElementById('root'));

serviceWorker.unregister();
