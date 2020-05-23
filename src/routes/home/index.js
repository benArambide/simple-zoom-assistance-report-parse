import { h } from 'preact';
import style from './style.css';
import ParseAssistance from '../../components/parser-assistance';
// eslint-disable-next-line no-unused-vars
import React from "preact/compat";

const Home = () => (
	<div class={style.home}>
		<ParseAssistance />
	</div>
);

export default Home;
