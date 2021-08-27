const React = {
	createElement(type, props, children) {
		console.log('进入', type, props, children);
		console.log('createElement');
	},
};

export default React;
