import {FixedSizeTree as Tree} from 'react-vtree';


// Tree component can work with any possible tree structure because it uses an
// iterator function that the user provides. Structure, approach, and iterator
// function below is just one of many possible variants.
const treeNodes = [
  {
    name: 'Root #1',
    id: 'root-1',
    children: [
      {
        children: [
          {id: 'child-2', name: 'Child #2'},
          {id: 'child-3', name: 'Child #3'},
        ],
        id: 'child-1',
        name: 'Child #1',
      },
      {
        children: [{id: 'child-5', name: 'Child #5'}],
        id: 'child-4',
        name: 'Child #4',
      },
    ],
  },
  {
    name: 'Root #2',
    id: 'root-2',
  },
];

// This helper function constructs the object that will be sent back at the step
// [2] during the treeWalker function work. Except for the mandatory `data`
// field you can put any additional data here.
const getNodeData = (node: any, nestingLevel: any) => ({
  data: {
    id: node.id.toString(), // mandatory
    isLeaf: !!node.children?.length,
    isOpenByDefault: true, // mandatory
    name: node.name,
    nestingLevel,
  },
  nestingLevel,
  node,
});

// The `treeWalker` function runs only on tree re-build which is performed
// whenever the `treeWalker` prop is changed.
function* treeWalker(): Generator<any, any, any> {
  // Step [1]: Define the root node of our tree. There can be one or
  // multiple nodes.
  for (let i = 0; i < treeNodes.length; i++) {
    yield getNodeData(treeNodes[i], 0);
  }

  while (true) {
    // Step [2]: Get the parent component back. It will be the object
    // the `getNodeData` function constructed, so you can read any data from it.
    const parent = yield;

    for (let i = 0; i < parent.node.children.length; i++) {
      // Step [3]: Yielding all the children of the provided component. Then we
      // will return for the step [2] with the first children.
      yield getNodeData(parent.node.children[i], parent.nestingLevel + 1);
    }
  }
}

// Node component receives all the data we created in the `treeWalker` +
// internal openness state (`isOpen`), function to change internal openness
// state (`setOpen`) and `style` parameter that should be added to the root div.
const Node = ({data: {isLeaf, name}, isOpen, style, setOpen}: any) => (
  <div style={style}>
    {!isLeaf && (
      <button type="button" onClick={() => setOpen(!isOpen)}>
        {isOpen ? '-' : '+'}
      </button>
    )}
    <div>{name}</div>
  </div>
);


export default function PageTreeViewer() {
  return (
    <div>
      <h1>PageTreeViewer</h1>
      {/*<Tree treeWalker={treeWalker} itemSize={30} height={150} width={300}>*/}
      {/*  {Node}*/}
      {/*</Tree>*/}
    </div>
  )
}
