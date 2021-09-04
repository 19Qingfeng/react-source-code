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
		this.state = {
			number: 0,
		};
	}

	handleClick = () => {
		this.setState({ number: this.state.number + 1 });
		console.log(this.state.number);
		this.setState({ number: this.state.number + 1 });
		console.log(this.state.number);
		setTimeout(() => {
			console.log('开启定时器');
			this.setState({ number: this.state.number + 1 });
			console.log(this.state.number, 'number');
			this.setState({ number: this.state.number + 1 });
			console.log(this.state.number, 'number');
			this.setState({ number: this.state.number + 1 });
			console.log(this.state.number, 'number');
		});
	};

	handleClickParent = () => {
		console.log('parent-parent触发');
	};

	handleParent = () => {
		console.log('parent触发', this.state.number);
		this.setState({ number: this.state.number + 1 });
		console.log(this.state.number, 'parent 中的state');
	};

	render() {
		// console.log(this.state.number, 'render');
		return (
			<div onClick={this.handleClickParent}>
				<div onClick={this.handleParent}>
					父亲元素
					<div onClick={this.handleClick}>{this.state.number}</div>
				</div>
			</div>
		);
	}
}

const element = <ClassComponent></ClassComponent>;

ReactDOM.render(element, document.getElementById('root'));
