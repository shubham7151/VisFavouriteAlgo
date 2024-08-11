
document.addEventListener('contextmenu', event => event.preventDefault());

let nodes = [];
let edges = [];
let capacities = [];
let flows = [];
let source = -1;
let sink = -1;
let maxFlow = 0;
let iterationSteps = [];
let stepIndex = 0;
let isDragging = false;
let startNodeIndex = -1;
let selectedNode = -1;
let selectedEdge = null;
let showStepsInterval;


function mousePressed() {
    if (mouseButton === RIGHT) {
        addVertex(mouseX, mouseY);
    } else if (mouseButton === LEFT) {
        if (mouseX > 0 && mouseX < width && mouseY > 0 && mouseY < height) {
            let nodeIndex = getNodeIndexAtPosition(mouseX, mouseY);
            if (nodeIndex !== -1) {
                isDragging = true;
                startNodeIndex = nodeIndex;
                selectedNode = nodeIndex;
                selectedEdge = null;
                updateSelectedItemDisplay();
            } else {
                let edgeIndex = getEdgeIndexAtPosition(mouseX, mouseY);
                if (edgeIndex !== -1) {
                    selectedEdge = edges[edgeIndex];
                    selectedNode = -1; 
                    updateSelectedItemDisplay();
                } else {
                    selectedNode = -1;
                    selectedEdge = null;
                    updateSelectedItemDisplay();
                }
            }
            redraw();
        }
    }
}

function mouseReleased() {
    if (isDragging && mouseButton === LEFT) {
        let endNodeIndex = getNodeIndexAtPosition(mouseX, mouseY);
        if (startNodeIndex !== -1 && endNodeIndex !== -1 && startNodeIndex !== endNodeIndex) {
            addEdge(startNodeIndex, endNodeIndex, 0); // Add edge with initial capacity 0
        }
        isDragging = false;
        startNodeIndex = -1;
        redraw();
    }
}

function doubleClicked() {
    let nodeIndex = getNodeIndexAtPosition(mouseX, mouseY);
    if (nodeIndex !== -1) {
        source = nodeIndex;
        redraw();
    }
}

function keyPressed() {
    if (key === 'S' && keyIsDown(SHIFT)) {
        let nodeIndex = getNodeIndexAtPosition(mouseX, mouseY);
        if (nodeIndex !== -1) {
            source = nodeIndex;
            redraw();
        }
    } else if (key === 'T' && keyIsDown(SHIFT)) {
        let nodeIndex = getNodeIndexAtPosition(mouseX, mouseY);
        if (nodeIndex !== -1) {
            sink = nodeIndex;
            redraw();
        }
    } else if (key === 'D' && keyIsDown(SHIFT)) {
        if (selectedNode !== -1) {
            deleteNode(selectedNode);
            selectedNode = -1;
        } else if (selectedEdge !== null) {
            deleteEdge(selectedEdge);
            selectedEdge = null;
        }
        updateSelectedItemDisplay();
        redraw();
    }
}

function addVertex(x, y) {
    nodes.push({ x: x, y: y });
    updateCapacitiesMatrix();
    redraw();
}

function addEdge(from, to, capacity) {
    capacities[from][to] = capacity;
    edges.push({ from: from, to: to, capacity: capacity });
    redraw();
}

function setCapacity() {
    if (selectedEdge !== null) {
        let capacity = document.getElementById('capacityInput').value;
        if (capacity !== null && capacity !== "") {
            capacities[selectedEdge.from][selectedEdge.to] = parseInt(capacity);
            selectedEdge.capacity = parseInt(capacity);
            redraw();
        }
    } else {
        alert("Please select an edge to set the capacity.");
    }
}

function startAlgorithm() {
    if (source === -1 || sink === -1) {
        alert("Please set both a source and a sink.");
        return;
    }
    maxFlow = 0;
    flows = capacities.map(row => row.map(val => 0));
    iterationSteps = [];
    console.log("Starting Edmonds-Karp Algorithm...");
    edmondsKarp(source, sink);
    document.getElementById('maxFlowDisplay').innerText = "Max Flow: " + maxFlow;
    console.log("Max Flow: " + maxFlow);
}

function updateCapacitiesMatrix() {
    capacities = Array(nodes.length).fill().map(() => Array(nodes.length).fill(0));
    flows = Array(nodes.length).fill().map(() => Array(nodes.length).fill(0));
    edges.forEach(edge => {
        capacities[edge.from][edge.to] = edge.capacity;
    });
}


function getNodeIndexAtPosition(x, y) {
    for (let i = 0; i < nodes.length; i++) {
        let node = nodes[i];
        let d = dist(x, y, node.x, node.y);
        if (d < 20) {
            return i;
        }
    }
    return -1;
}

function getEdgeIndexAtPosition(x, y) {
    for (let i = 0; i < edges.length; i++) {
        let edge = edges[i];
        let fromNode = nodes[edge.from];
        let toNode = nodes[edge.to];

        let distance = distToSegment({ x, y }, fromNode, toNode);
        if (distance < 10) { // Tolerance for selecting edge
            return i;
        }
    }
    return -1;
}

function distToSegment(p, v, w) {
    let l2 = distSq(v, w);
    if (l2 === 0) return dist(p.x, p.y, v.x, v.y);
    let t = ((p.x - v.x) * (w.x - v.x) + (p.y - v.y) * (w.y - v.y)) / l2;
    t = max(0, min(1, t));
    return dist(p.x, p.y, v.x + t * (w.x - v.x), v.y + t * (w.y - v.y));
}

function distSq(v, w) {
    return (v.x - w.x) * (v.x - w.x) + (v.y - w.y) * (v.y - w.y);
}

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

function updateSelectedItemDisplay() {
    let selectedItemDisplay = document.getElementById('selectedItemDisplay');
    if (selectedNode !== -1) {
        selectedItemDisplay.innerText = "Selected Item: Node " + selectedNode;
    } else if (selectedEdge) {
        selectedItemDisplay.innerText = "Selected Item: Edge (" + selectedEdge.from + " -> " + selectedEdge.to + ")";
    } else {
        selectedItemDisplay.innerText = "Selected Item: None";
    }
}

function toggleStepView() {
    document.getElementById('canvasWrapper').style.display = 'none';
    document.getElementById('iterationsWrapper').style.display = 'block';
    displayIterations();
}

function toggleEditorView() {
    document.getElementById('canvasWrapper').style.display = 'flex';
    document.getElementById('iterationsWrapper').style.display = 'none';
}

function showIterationsGraphically() {
    if (iterationSteps.length === 0) {
        console.log("No iterations to display. Please run the algorithm first.");
        return;
    }
    toggleStepView();
}


function deleteNode(index) {
    nodes.splice(index, 1);
    
    edges = edges.filter(edge => edge.from !== index && edge.to !== index);
    
    capacities = capacities.filter((row, rowIndex) => rowIndex !== index).map(row => row.filter((col, colIndex) => colIndex !== index));
    flows = flows.filter((row, rowIndex) => rowIndex !== index).map(row => row.filter((col, colIndex) => colIndex !== index));

    edges.forEach(edge => {
        if (edge.from > index) edge.from--;
        if (edge.to > index) edge.to--;
    });
    // Update source and sink
    if (source > index) source--;
    if (sink > index) sink--;
}

function deleteEdge(edge) {
    edges = edges.filter(e => e !== edge);
    capacities[edge.from][edge.to] = 0;
    flows[edge.from][edge.to] = 0;
}

function downloadGraph() {
    const graphData = {
        nodes: nodes,
        edges: edges,
        source: source,
        sink: sink
    };
    const blob = new Blob([JSON.stringify(graphData)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'graph.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}

function uploadGraph(event) {
    const file = event.target.files[0];
    if (!file) {
        return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
        const graphData = JSON.parse(e.target.result);
        nodes = graphData.nodes;
        edges = graphData.edges;
        source = graphData.source;
        sink = graphData.sink;
        updateCapacitiesMatrix();
        redraw();
    };
    reader.readAsText(file);
}
