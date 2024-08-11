import { edmondsKarp } from "../src/edKarp";


// Sample data for testing
let nodes;
let edges;
let capacities;
let flows;
let source;
let sink;

// Helper function to reset the graph
function resetGraph() {
    nodes = [{x: 0, y: 0}, {x: 100, y: 0}, {x: 200, y: 0}, {x: 300, y: 0}];
    edges = [
        {from: 0, to: 1, capacity: 10},
        {from: 0, to: 2, capacity: 10},
        {from: 1, to: 2, capacity: 5},
        {from: 1, to: 3, capacity: 10},
        {from: 2, to: 3, capacity: 10}
    ];
    capacities = [
        [0, 10, 10, 0],
        [0, 0, 5, 10],
        [0, 0, 0, 10],
        [0, 0, 0, 0]
    ];
    flows = [
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0]
    ];
    source = 0;
    sink = 3;
}

beforeEach(() => {
    resetGraph();
});

test('bfs finds an augmenting path', () => {
    const parent = new Array(nodes.length).fill(-1);
    const result = bfs(source, sink, parent);
    expect(result).toBe(true);
    expect(parent[sink]).not.toBe(-1);
});

test('bfs does not find a path when there is no residual capacity', () => {
    capacities = [
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0]
    ];
    const parent = new Array(nodes.length).fill(-1);
    const result = bfs(source, sink, parent);
    expect(result).toBe(false);
    expect(parent[sink]).toBe(-1);
});

test('edmondsKarp calculates max flow correctly', () => {
    const expectedMaxFlow = 20;
    edmondsKarp(source, sink);
    expect(maxFlow).toBe(expectedMaxFlow);
});

test('edmondsKarp handles disconnected graph', () => {
    capacities = [
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0]
    ];
    const expectedMaxFlow = 0;
    edmondsKarp(source, sink);
    expect(maxFlow).toBe(expectedMaxFlow);
});

test('edmondsKarp handles single path graph', () => {
    nodes = [{x: 0, y: 0}, {x: 100, y: 0}, {x: 200, y: 0}];
    edges = [
        {from: 0, to: 1, capacity: 10},
        {from: 1, to: 2, capacity: 5}
    ];
    capacities = [
        [0, 10, 0],
        [0, 0, 5],
        [0, 0, 0]
    ];
    flows = [
        [0, 0, 0],
        [0, 0, 0],
        [0, 0, 0]
    ];
    source = 0;
    sink = 2;
    const expectedMaxFlow = 5;
    edmondsKarp(source, sink);
    expect(maxFlow).toBe(expectedMaxFlow);
});
