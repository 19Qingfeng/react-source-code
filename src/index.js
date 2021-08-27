import React from './react/react';
import ReactDOM from './react/react-dom';

// 普通div渲染
// const element = (
// 	<div id="hello" style={{ color: 'red', backgroundColor: 'blue' }}>
// 		<p>hello</p>
// 		<p>!</p>
// 		<p>world!</p>
// 	</div>
// );

// function component 渲染
// function FunctionComponent(props) {
// 	return (
// 		<div id="wang.haoyu">
// 			<p>hello.My name is wang.haoyu</p>
// 			<p>{props.children}</p>
// 		</div>
// 	);
// }

// const element = <FunctionComponent>React Study</FunctionComponent>;

// console.log(element, 'element');

// class Component地址
class ClassComponent extends React.Component {
	constructor() {
		super();
	}

	render() {
		return <div>hello</div>;
	}
}

const element = <ClassComponent></ClassComponent>;

ReactDOM.render(element, document.getElementById('root'));
