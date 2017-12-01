import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import 'url-search-params-polyfill';
import Promise from 'promise-polyfill';
if (!window.Promise) {
	window.Promise = Promise;
}

ReactDOM.render(
	<App/>,
	document.getElementById('root')
);
registerServiceWorker();
