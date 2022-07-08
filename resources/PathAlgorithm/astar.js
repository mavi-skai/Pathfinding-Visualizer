import * as structure from "../structure.js"



let queue = new structure.Queue();
const timer = ms => new Promise(res => setTimeout(res, ms))


export const Astar_algorithm = async (gridarray,start,end,row,col,ms) => {
    //debugger;
    queue.clearArray();
    const nodesToAnimate = [];
    let visited = Array.from({ length: row }, () => Array.from({ length: col }, () => false));
    visited[start.row][start.column] = true;
    let [currentRow,currentCol] = [start.row,start.column];
    start.gScore = 0;
    start.hScore = manhatan_distance(start,end);
    const [goalRow,goalCol] = [end.row,end.column]
    let count = 0;
    queue.enqueue(start);
    while(!queue.isEmpty()){
        let current_node = queue.dequeue();
        //#region OLD CODES
        // if(current_node.type != NODES[5] && current_node.type != NODES[0]){
        //     current_node.type = NODES[7];
        //     current_node.cell.className = NODES[7];
        //     await timer(ms);
        //     current_node.type = NODES[5];
        //     current_node.cell.className = NODES[5];
        //     await timer(ms);
        // }        
        // for(let x=0;x<current_node.neighbors.length;x++){
        //     if(current_node.neighbors[x].type === 'END'){
        //         current_node.neighbors[x].parents = current_node;
        //         return true;
        //     }
        //                      
        //     let temp_gscore = current_node.gScore + 1;
        //     if(temp_gscore < current_node.neighbors[x].gScore){
        //         current_node.neighbors[x].gScore = temp_gscore;
        //         current_node.neighbors[x].hScore = manhatan_distance(current_node.neighbors[x],end);
        //         current_node.neighbors[x].fScore = temp_gscore + current_node.neighbors[x].hScore;
        //         if(current_node.neighbors[x].type != NODES[5]){
        //             current_node.neighbors[x].parents = current_node;
        //             count = count + 1;
        //             current_node.neighbors[x].count = count;
        //             queue.astar_priorityenqueue(current_node.neighbors[x]);
        //         }
                
        //     }
        // }
        //#endregion
        [currentRow,currentCol] = [current_node.row,current_node.column];
        visited[currentRow][currentCol] = true;
        if(current_node.type != 'START' && current_node.type != 'END'){
            nodesToAnimate.push(current_node);
        }

        if(currentRow===goalRow && currentCol === goalCol){
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
            let [n_row,n_col] = [current_node.neighbors[x].row,current_node.neighbors[x].column]
            if(visited[n_row][n_col]){continue};
            let temp_gscore = current_node.gScore + 1; //1 === weights;
            if(temp_gscore<current_node.neighbors[x].gScore){
                current_node.neighbors[x].parents = current_node;
                current_node.neighbors[x].gScore = temp_gscore;
                current_node.neighbors[x].hScore = manhatan_distance(current_node.neighbors[x],end);
                current_node.neighbors[x].fScore = temp_gscore + current_node.neighbors[x].hScore;
                count = count + 1;
                current_node.neighbors[x].count = count;
                queue.astar_priorityenqueue(current_node.neighbors[x]);
            }
            
        }
    }
    return false;
}

function manhatan_distance(node1,node2){
    return Math.abs(node2.row-node1.row) + Math.abs(node2.column-node1.column);
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

