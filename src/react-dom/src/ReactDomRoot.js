import {
  createContainer,
  updateContainer,
} from "react-reconciler/src/ReactFiberReconclier";

function ReactDomRoot(internalRoot) {
  this._internalRoot = internalRoot;
}

ReactDomRoot.prototype.render = function (children) {
  const root = this._internalRoot; // Dom 元素
  updateContainer(children, root);
};

export function createRoot(container) {
  const root = createContainer(container);
  return new ReactDomRoot(root);
}
