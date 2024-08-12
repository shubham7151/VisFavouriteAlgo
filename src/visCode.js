function setup() {
    console.log("Setup from vscode.js")
    let canvas = createCanvas(1000, 700);
    canvas.parent('algorithmCanvas');
    noLoop();
    canvas.elt.addEventListener('contextmenu', event => event.preventDefault());
}


function draw() {
    background(255);
    drawGraph();
    drawBoundary();
}

function drawBoundary() {
    noFill();
    stroke(0);
    rect(0, 0, width - 1, height - 1);
}


function showSteps() {
    if (iterationSteps.length === 0) {
        // console.log("No steps recorded. Please run the algorithm first.");
        alert("No steps recorded. Please run the algorithm first.");
        return;
    }
    stepIndex = 0;
    clearInterval(showStepsInterval);
    showStepsInterval = setInterval(() => {
        if (stepIndex < iterationSteps.length) {
            flows = iterationSteps[stepIndex].flows;
            highlightPath(iterationSteps[stepIndex].path);
            
            setTimeout(() => {
                console.log("Step " + (stepIndex + 1) + ": Path - ", iterationSteps[stepIndex].path);
                stepIndex++;
                redraw();
            }, 1000);
        } else {
            clearInterval(showStepsInterval);
        }
    }, 2000);
}

function drawGraph() {
    noStroke();
    for (let edge of edges) {
        let fromNode = nodes[edge.from];
        let toNode = nodes[edge.to];
        
        let directionX = toNode.x - fromNode.x;
        let directionY = toNode.y - fromNode.y;
        let edgeLength = sqrt(directionX * directionX + directionY * directionY);
        let unitX = directionX / edgeLength;
        let unitY = directionY / edgeLength;

        let arrowSize = 10;
        let arrowX = toNode.x - unitX * arrowSize * 2;
        let arrowY = toNode.y - unitY * arrowSize * 2;

        if (edge === selectedEdge) {
            stroke(255, 0, 0); // Highlight selected edge in red
        } else {
            stroke(0, 100, 200);
        }
        strokeWeight(2);
        line(fromNode.x, fromNode.y, toNode.x, toNode.y);

        push();
        translate(arrowX, arrowY);
        rotate(atan2(directionY, directionX));
        if (edge === selectedEdge) {
            fill(255, 0, 0); // Highlight arrow of selected edge in red
        } else {
            fill(0, 100, 200);
        }
        triangle(-arrowSize, -arrowSize / 2, -arrowSize, arrowSize / 2, 0, 0);
        pop();

        let midX = (fromNode.x + toNode.x) / 2;
        let midY = (fromNode.y + toNode.y) / 2;
        noStroke();
        fill(0);
        textSize(14); // Default text size for non-highlighted edges
        textStyle(NORMAL);
        text(flows[edge.from][edge.to] + "/" + capacities[edge.from][edge.to], midX + 10, midY + 10); // Display flow/capacity
    }

    for (let i = 0; i < nodes.length; i++) {
        let node = nodes[i];
        fill(255);
        stroke(0);
        strokeWeight(1);
        if (i === source) {
            fill(0, 255, 0);
        } else if (i === sink) {
            fill(255, 0, 0);
        } else {
            fill(255);
        }
        ellipse(node.x, node.y, 40, 40);
    }

    if (isDragging && startNodeIndex !== -1) {
        let startNode = nodes[startNodeIndex];
        stroke(150);
        line(startNode.x, startNode.y, mouseX, mouseY);
    }
}


function highlightPath(path) {
    for (let i = 0; i < path.length - 1; i++) {
        let fromNode = nodes[path[i]];
        let toNode = nodes[path[i + 1]];
        
        let directionX = toNode.x - fromNode.x;
        let directionY = toNode.y - fromNode.y;
        let edgeLength = sqrt(directionX * directionX + directionY * directionY);
        let unitX = directionX / edgeLength;
        let unitY = directionY / edgeLength;

        let arrowSize = 10;
        let arrowX = toNode.x - unitX * arrowSize * 2;
        let arrowY = toNode.y - unitY * arrowSize * 2;

        stroke(255, 0, 255); 
        strokeWeight(4);
        line(fromNode.x, fromNode.y, toNode.x, toNode.y);

        push();
        translate(arrowX, arrowY);
        rotate(atan2(directionY, directionX));
        fill(0, 255, 0); 
        triangle(-arrowSize, -arrowSize / 2, -arrowSize, arrowSize / 2, 0, 0);
        pop();

        let midX = (fromNode.x + toNode.x) / 2;
        let midY = (fromNode.y + toNode.y) / 2;
        noStroke();
        fill(0);
        textSize(16); 
        textStyle(BOLD);
        text(flows[path[i]][path[i + 1]] + "/" + capacities[path[i + 1]][path[i + 1]], midX + 10, midY + 10);
    }
}


function displayIterations() {
    const iterationsWrapper = document.getElementById('iterationsWrapper');
    iterationsWrapper.innerHTML = '';
    iterationSteps.forEach((step, index) => {
        const iterationDiv = document.createElement('div');
        iterationDiv.className = 'iteration-item';
        iterationDiv.innerHTML = `<h4>Iteration ${index + 1}</h4><p>Max Flow: ${step.maxFlow}</p>`;

        const iterationCanvas = document.createElement('canvas');
        iterationCanvas.width = 1000;
        iterationCanvas.height = 700;
        iterationDiv.appendChild(iterationCanvas);
        iterationsWrapper.appendChild(iterationDiv);

        const ctx = iterationCanvas.getContext('2d');
        drawIterationGraph(ctx, step);
    });
}


function drawIterationGraph(ctx, step) {
    
    ctx.clearRect(0, 0, 1000, 700);

    nodes.forEach((node, index) => {
        ctx.fillStyle = (index === source) ? 'green' : (index === sink) ? 'red' : 'white';
        ctx.strokeStyle = 'black';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(node.x, node.y, 20, 0, 2 * Math.PI);
        ctx.fill();
        ctx.stroke();
    });


    edges.forEach((edge) => {
        const fromNode = nodes[edge.from];
        const toNode = nodes[edge.to];

        const directionX = toNode.x - fromNode.x;
        const directionY = toNode.y - fromNode.y;
        const edgeLength = Math.sqrt(directionX * directionX + directionY * directionY);
        const unitX = directionX / edgeLength;
        const unitY = directionY / edgeLength;

        const arrowSize = 10;
        const arrowX = toNode.x - unitX * arrowSize * 2;
        const arrowY = toNode.y - unitY * arrowSize * 2;

        ctx.strokeStyle = 'blue';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(fromNode.x, fromNode.y);
        ctx.lineTo(toNode.x, toNode.y);
        ctx.stroke();

        ctx.fillStyle = 'blue';
        ctx.beginPath();
        ctx.moveTo(arrowX, arrowY);
        ctx.lineTo(arrowX - arrowSize, arrowY - arrowSize / 2);
        ctx.lineTo(arrowX - arrowSize, arrowY + arrowSize / 2);
        ctx.fill();

        const midX = (fromNode.x + toNode.x) / 2;
        const midY = (fromNode.y + toNode.y) / 2;
        ctx.fillStyle = 'black';
        ctx.font = '14px Arial';
        ctx.fillText(`${step.flows[edge.from][edge.to]}/${capacities[edge.from][edge.to]}`, midX + 10, midY + 10);
    });

    
    step.path.forEach((node, i) => {
        if (i < step.path.length - 1) {
            const fromNode = nodes[step.path[i]];
            const toNode = nodes[step.path[i + 1]];

            const directionX = toNode.x - fromNode.x;
            const directionY = toNode.y - fromNode.y;
            const edgeLength = Math.sqrt(directionX * directionX + directionY * directionY);
            const unitX = directionX / edgeLength;
            const unitY = directionY / edgeLength;

            const arrowSize = 10;
            const arrowX = toNode.x - unitX * arrowSize * 2;
            const arrowY = toNode.y - unitY * arrowSize * 2;

            ctx.strokeStyle = 'purple';
            ctx.lineWidth = 4;
            ctx.beginPath();
            ctx.moveTo(fromNode.x, fromNode.y);
            ctx.lineTo(toNode.x, toNode.y);
            ctx.stroke();

            ctx.fillStyle = 'green';
            ctx.beginPath();
            ctx.moveTo(arrowX, arrowY);
            ctx.lineTo(arrowX - arrowSize, arrowY - arrowSize / 2);
            ctx.lineTo(arrowX - arrowSize, arrowY + arrowSize / 2);
            ctx.fill();
        }
    });
}


