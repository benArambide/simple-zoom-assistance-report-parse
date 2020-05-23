import { h, Component } from 'preact';

import Header from './header';

import ParseAssistance from "./parser-assistance";
// eslint-disable-next-line no-unused-vars
import React from "preact/compat";

export default class App extends Component {
	
	/** Gets fired when the route changes.
	 *	@param {Object} event		"change" event from [preact-router](http://git.io/preact-router)
	 *	@param {string} event.url	The newly routed URL
	 */
	handleRoute = e => {
		this.currentUrl = e.url;
	};

	render() {
		return (
			<div id="app">
				<Header />
				<div className={'ro-main'}>
					<ParseAssistance />
				</div>
			</div>
		);
	}
}
