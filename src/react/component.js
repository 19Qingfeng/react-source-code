class Component {
	constructor(props) {
		this.props = props;
	}
}

/* 
  区分FC和Class Component的区别
  源码中ClassComponent prototype中存在isReactComponent
  class组件子元素可以通过此属性鉴别是否是ClassComponent
*/

Component.prototype.isReactComponent = {};

export default Component;
