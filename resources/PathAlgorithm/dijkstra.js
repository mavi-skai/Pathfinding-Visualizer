import * as structure from "../structure.js"


let queue = new structure.Queue();
const timer = ms => new Promise(res => setTimeout(res, ms));


export const dijkstra_algorithm = async (gridarray,start,end,row,col,ms) => {
    //debugger;
    queue.clearArray();
    const nodesToAnimate = [];
    let visited = Array.from({ length: row }, () => Array.from({ length: col }, () => false));
    visited[start.row][start.column] = true;
    let [currentRow,currentCol] = [start.row,start.column];
    start.distance = 0;
    const [goalRow,goalCol] = [end.row,end.column];
    queue.dijkstra_priorityenqueue(start);
    while(!queue.isEmpty()){
        //#region OLD CODES
        // let current_node = queue.dequeue();
        // for(let x=0;x<current_node.neighbors.length;x++){
        //     if(current_node.neighbors[x].type === 'END'){
        //         current_node.neighbors[x].parents = current_node;
        //         return true;
        //     }
        //     if(current_node.neighbors[x].type === NODES[5] || current_node.neighbors[x].type === NODES[0]){continue;}
        //     let temp_distance = current_node.distance + 1 + current_node.neighbors[x].weight;
        //     if(temp_distance < current_node.neighbors[x].distance){
        //         current_node.neighbors[x].type = NODES[7];
        //         current_node.neighbors[x].cell.className = NODES[7]; //currentnode
        //         await timer(ms);
        //         current_node.neighbors[x].type = NODES[5];
        //         current_node.neighbors[x].cell.className = NODES[5]; //visited
        //         current_node.neighbors[x].distance = temp_distance;
        //         current_node.neighbors[x].parents = current_node;
        //         queue.dijkstra_priorityenqueue(current_node.neighbors[x]);
        //         await timer(ms);
        //     }
        // }
        //#endregion
        let current_node = queue.dequeue();
        [currentRow,currentCol] = [current_node.row,current_node.column];

        visited[currentRow][currentCol] = true;
        if(current_node.type != 'START' && current_node.type != 'END'){
            nodesToAnimate.push(current_node);
        }

        if(currentRow === goalRow && currentCol === goalCol){
            await animateNodes(nodesToAnimate,'VISITED',ms);
            let shortestPath = await backtrackPath(end,gridarray);
            start.type = 'START-PATH';
            start.cell.className = 'START-PATH';
            await animateNodes(shortestPath,'SHORTEST-PATH',20);
            end.type = 'END-PATH';
            end.cell.className = 'END-PATH';
            return true;
        }

        for(let x=0;x<current_node.neighbors.length;x++){
            let [n_row,n_col] = [current_node.neighbors[x].row,current_node.neighbors[x].column];
            if(visited[n_row][n_col]){continue};
            let temp_distance = current_node.distance + 1 + current_node.neighbors[x].weight;
                if(temp_distance < current_node.neighbors[x].distance){
                    current_node.neighbors[x].distance = temp_distance;
                    current_node.neighbors[x].parents = current_node;
                    queue.dijkstra_priorityenqueue(current_node.neighbors[x]);
                }
        }
    }
    return false;
}


async function animateNodes(nodes,cellType,ms){
    for(let x=0;x<nodes.length;x++){
        const current_node = nodes[x];
        if(current_node.type === 'START' || current_node.type === 'END'){continue};
            current_node.cell.className = cellType;
            current_node.type = cellType;
        await timer(ms);
    }
}


async function backtrackPath(end,gridarray){
    let shortestPath = [];
    let [currentRow,currentCol] = [end.row,end.column];
    let current_node = gridarray[currentRow][currentCol];
    while(current_node.type != 'START'){
            shortestPath.push(current_node);
            [currentRow,currentCol] = [current_node.parents.row,current_node.parents.column];
            current_node = gridarray[currentRow][currentCol];
    }
    return shortestPath.reverse();
}


