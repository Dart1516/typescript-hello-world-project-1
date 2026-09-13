interface NumberNode {
    value: number;
    children: NumberNode[];
}

// Example 1: Visit every node in a recursive tree.
function printNode(node: NumberNode): void {
    console.log(`Node: ${node.value}`);

    for (let index = 0; index < node.children.length; index++) {
        const child = node.children[index];
        if (child) {
            printNode(child);
        }
    }
}

const firstTree: NumberNode = {
    value: 1,
    children: [
        { value: 2, children: [] },
        { value: 3, children: [] }
    ]
};
printNode(firstTree);

// Example 2: Stop recursion at a selected depth.
function countLevels(node: NumberNode, depth: number = 0): number {
    if (node.children.length === 0) {
        return depth;
    }

    let deepestLevel = depth;
    for (const child of node.children) {
        deepestLevel = Math.max(deepestLevel, countLevels(child, depth + 1));
    }

    return deepestLevel;
}

console.log(`Tree depth: ${countLevels(firstTree)}`);
