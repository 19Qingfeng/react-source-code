import { wrapTextNode } from '../utils/index';

const React = {
	// 通过createElement将jsx转化成为vdom
	createElement(type, config, children) {
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
		};
	},
};

export default React;
