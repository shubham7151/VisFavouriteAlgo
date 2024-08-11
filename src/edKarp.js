 function bfs(source, sink, parent) {
    let visited = new Array(nodes.length).fill(false);
    let queue = [];
    queue.push(source);
    visited[source] = true;
    parent[source] = -1;

    while (queue.length > 0) {
        let u = queue.shift();

        for (let v = 0; v < nodes.length; v++) {
            if (!visited[v] && capacities[u][v] - flows[u][v] > 0) {
                queue.push(v);
                parent[v] = u;
                visited[v] = true;
            }
        }
    }
    return visited[sink];
}

 function edmondsKarp(source, sink) {
    let parent = new Array(nodes.length);
    let currentMaxFlow = 0;

    while (bfs(source, sink, parent)) {
        let pathFlow = Infinity;
        let path = [];
        for (let v = sink; v != source; v = parent[v]) {
            path.push(v);
            let u = parent[v];
            pathFlow = min(pathFlow, capacities[u][v] - flows[u][v]);
        }
        path.push(source);
        path.reverse();

        for (let v = sink; v != source; v = parent[v]) {
            let u = parent[v];
            flows[u][v] += pathFlow;
            flows[v][u] -= pathFlow;
        }

        currentMaxFlow += pathFlow;
        iterationSteps.push({ flows: JSON.parse(JSON.stringify(flows)), path: path, maxFlow: currentMaxFlow });
        console.log("Path found: ", path, " with flow: ", pathFlow);
    }
    maxFlow = currentMaxFlow;
}