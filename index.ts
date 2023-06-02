/**
 * 任务依赖可以视作有向图，而任务不能有循环依赖证明它
 * 是一个有向无环图，则问题的本质是判断有向图中是否有环，
 * 如果无环，则找出一种可能的拓扑排序
 */
type Task = {
  symbol: string; // 任务标识
  children: Task[]; // 任务依赖
}
/**
 * 
 * @param tasks 任务列表
 * @returns 
 */
function canTasksBeDone(tasks: Task[]): string | string[] {
  // 用map实现临接表
  const graph = {
    graph: new Map(),
    hasCircle: false
  };
  const visited = new Map();
  // 记录路径
  const path: string[] = [];
  const topo: string[] = [];
  for (const task of tasks) {
    // 简化一下，邻接表只存储任务标识
    graph.graph.set(task.symbol, task.children.map(({ symbol }) => symbol));
  }
  for (const [symbol, _] of graph.graph.entries()) {
    traverse(graph, symbol, visited, path, topo);
  }
  if (graph.hasCircle) {
    return '无法完成';
  }
  return topo;
}

/**
 * 
 * @param graph 图
 * @param symbol 当前遍历的节点
 * @param visited 访问列表
 * @param path 递归路径列表
 * @param topo 拓扑顺序
 * @returns 
 */
function traverse(
  graph: { graph: Map<string, string[]>, hasCircle: boolean },
  symbol: string,
  visited: Map<string, boolean>,
  path: string[],
  topo: string[],
) {
  if (visited.get(symbol)) {
    return;
  }
  if (path.includes(symbol)) {
    // 标记有环
    graph.hasCircle = true;
    return;
  }
  visited.set(symbol, true);
  const children = graph.graph.get(symbol);
  if (!children) {
    return;
  }
  path.push(symbol);
  for (const subSymbol of children) {
    traverse(graph, subSymbol, visited, path, topo);
  }
  topo.push(symbol);
  path.pop();
}
