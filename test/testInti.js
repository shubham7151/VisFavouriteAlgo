// integration.test.js
import { edmondsKarp } from './edmondsKarp.js';
import { addVertex, addEdge, deleteNode, deleteEdge, updateCapacitiesMatrix } from './graphManipulation.js';

let nodes;
let edges;
let capacities;
let flows;
let source;
let sink;
let iterationSteps;

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
    const update = updateCapacitiesMatrix(nodes, edges, []);
    capacities = update.capacities;
    flows = update.flows;
    source = 0;
    sink = 3;
    iterationSteps = [];
}

beforeEach(() => {
    resetGraph();
});

test('edmondsKarp calculates max flow correctly after adding nodes and edges', () => {
    const expectedMaxFlow = 20;
    const result = edmondsKarp(source, sink, capacities, nodes, iterationSteps);
    expect(result).toBe(expectedMaxFlow);
});

test('edmondsKarp updates correctly after deleting a node', () => {
    deleteNode(1, nodes, edges, capacities, flows, source, sink);
    const update = updateCapacitiesMatrix(nodes, edges, capacities);
    capacities = update.capacities;
    flows = update.flows;
    const expectedMaxFlow = 10;
    const result = edmondsKarp(source, sink, capacities, nodes, iterationSteps);
    expect(result).toBe(expectedMaxFlow);
});

test('edmondsKarp updates correctly after deleting an edge', () => {
    const edge = edges.find(e => e.from === 0 && e.to === 1);
    edges = deleteEdge(edge, edges, capacities, flows);
    const update = updateCapacitiesMatrix(nodes, edges, capacities);
    capacities = update.capacities;
    flows = update.flows;
    const expectedMaxFlow = 10;
    const result = edmondsKarp(source, sink, capacities, nodes, iterationSteps);
    expect(result).toBe(expectedMaxFlow);
});

test('edmondsKarp calculates max flow correctly after modifying capacities', () => {
    capacities[0][1] = 5;
    capacities[0][2] = 15;
    const expectedMaxFlow = 20;
    const result = edmondsKarp(source, sink, capacities, nodes, iterationSteps);
    expect(result).toBe(expectedMaxFlow);
});

test('integration test for complete graph modification', () => {
    addVertex(nodes, 400, 0);
    addEdge(edges, 3, 4, 10);
    const update1 = updateCapacitiesMatrix(nodes, edges, capacities);
    capacities = update1.capacities;
    flows = update1.flows;

    source = 0;
    sink = 4;
    const expectedMaxFlow = 10;
    const result = edmondsKarp(source, sink, capacities, nodes, iterationSteps);
    expect(result).toBe(expectedMaxFlow);
});
