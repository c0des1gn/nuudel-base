/* eslint-disable */
export const breadthFirstRecursion = (treeData, params?) => {
  /**
   * Tree structure breadth-first traversal
   * @param treeData tree structure array data, type = array
   * @params params: parameters used to describe the name of the parent and child nodes in _menus, type = object
   **/
  params = {
    sortCodeName:
      params && params.sortCodeName ? params.sortCodeName : 'sortCode',
    parentName: params && params.parentName ? params.parentName : 'parent',
    childrenName:
      params && params.childrenName ? params.childrenName : 'children',
  };
  let childrenNodes = [],
    children = params.childrenName,
    nodes = treeData;
  for (let item in treeData) {
    if (treeData[item][children]) {
      let temp = treeData[item][children];
      childrenNodes = childrenNodes.concat(temp);
    }
  }
  if (childrenNodes.length > 0) {
    nodes = nodes.concat(breadthFirstRecursion(childrenNodes, params));
  }
  return nodes;
};
