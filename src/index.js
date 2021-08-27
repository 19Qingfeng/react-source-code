import React from './react/react';
import ReactDOM from './react/react-dom';

const element = (
	<div id="hello" style={{ color: 'red', backgroundColor: 'blue' }}>
		<p>hello</p>
		<p>!</p>
		<p>world!</p>
	</div>
);

console.log(element, 'element');

ReactDOM.render(element, document.getElementById('root'));
