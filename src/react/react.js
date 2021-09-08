import { wrapTextNode } from '../utils/index';
import Component from './component';
import { createRef } from './ref';

const React = {
	// 通过createElement将jsx转化成为vdom
	createElement(type, config, children) {
		let ref; // 额外定义Ref属性
		if (config) {
			// 他们并不属于props
			ref = config.ref;
		}
		const props = {
			...config,
		};
		if (arguments.length > 3) {
			props.children = Array.prototype.slice
				.call(arguments, 2)
				.map((i) => wrapTextNode(i));
		} else {
			props.children = wrapTextNode(children);
		}
		return {
			type,
			props,
			ref,
		};
	},
	// FunctionComponent的ref转发
	forwardRef(functionComponent) {
		return class extends Component {
			render() {
				return functionComponent(this.props, this.props.ref);
			}
		};
	},
	createRef,
	// 类组件
	Component,
};

export default React;
