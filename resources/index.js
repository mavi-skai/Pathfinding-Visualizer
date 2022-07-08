import * as bfs from "./PathAlgorithm/bfs.js"
import * as astar from "./PathAlgorithm/astar.js"
import * as dijkstra from "./PathAlgorithm/dijkstra.js"
import * as dfs from "./PathAlgorithm/dfs.js"
import * as gbfs from "./PathAlgorithm/gbfs.js"
import * as prim from "./MazeAlgorithm/prim.js";
import * as ds from "./MazeAlgorithm/ds.js";
import * as rd from "./MazeAlgorithm/rd.js";
import * as spiral from "./MazeAlgorithm/spiral.js";
import Node from "./node.js"


let row = 19;
let col = 54;
var ismousedown = false;
let NODES = ["START", "END", "WEIGHT", "WALL", "UNVISITED", "VISITED", "SHORTEST-PATH", "CURRENT-NODE", "START-PATH", "END-PATH"];
const ALGORITHMS = [];
const default_start = [10, 14];
const default_end = [10, 37];
let gridarray = makeGrid(row, col);
let ms = 10; //8 fast 25 average 50 slow
let current_start = gridarray[default_start[0]][default_start[1]];
let current_end = gridarray[default_end[0]][default_end[1]];
let dragged_node;
let runalgo = -1;
let running = false;
let pred = Array.from(Array(row), () => new Array(col));
export { gridarray, row, col, NODES, ms }
SetDefaultNodes();
mouseHoldListener();
prevenContextMenu();
nodeAddEventListener(row, col, gridarray);



$('#visualize').on('click', function () {
        if (running === true) { return }
        ClearPath();
        setNeighbors(row, col, gridarray);
        RunAlgorithm();
        //makeMaze();
});

$('#title').on('click', function () {
        console.log('title');
        location.reload();
});

$('#pathalgo li').on('click', function () {
        if (running === true) { return }
        var txt = ($(this).text());
        setPathAlgorithm(txt);
});

$('#mazealgo li').on('click', function () {
        if (running === true) { return }
        var txt = ($(this).text());
        ClearPath();
        ClearWalls()
        generateMaze(txt)
});


$('#clearboard').on('click', function () {
        if (running === true) { return }
        ClearBoards();
});

$('#clearwalls').on('click', function () {
        if (running === true) { return }
        ClearWalls();
});

$('#clearpath').on('click', function () {
        if (running === true) { return }
        ClearPath();
});

$('#speed li').on('click', function () {
        if (running === true) { return }
        var txt = ($(this).text());
        document.querySelector('.speedinner').innerHTML = 'Speed: ' + txt;
        console.log(txt)
        setspeed(txt);
});


function setspeed(txt) {
        switch (txt) {
                case 'Fast ':
                        ms = 10;
                        break;
                case 'Average ':
                        ms = 100;
                        break;
                case 'Slow ':
                        ms = 200;
                        console.log(ms)
                        break;
                default:
                        ms = 10;
                        break;
        }
}

async function generateMaze(txt) {
        switch (txt) {
                case 'Randomized Prim\'s algorithm':
                        running = true;
                        running = await prim.prim_maze_algorithm(gridarray, current_start, current_end, row, col);
                        break;
                case 'Spiral':
                        running = true;
                        running = await spiral.spiral_maze(gridarray, current_start, current_end, row, col);
                        break;
                case 'Diagonal Steps':
                        running = true;
                        running = await ds.diagonal_step_maze(gridarray, current_start, current_end, row, col);
                        break;
        }


}

function makeGrid(row, col) {
        let makearr = []

        for (let x = 0; x < row; x++) {
                for (let y = 0; y < col; y++) {
                        makearr[x] = []
                }
        }
        let grid = document.getElementById("grid");
        for (let x = 0; x < row; x++) {
                let myRow = document.createElement("tr");
                myRow.id = "row " + x;
                //myRow.setAttribute('draggable',false); 
                grid.appendChild(myRow);
                makearr[x] = myRow;

                let rowW = document.getElementById("row " + x);
                for (let y = 0; y < col; y++) {
                        let node = new Node(x, y);
                        let myCell = document.createElement("td");
                        myCell.id = + x + "-" + y;
                        myCell.className = NODES[4];
                        node.cell = myCell;
                        node.type = NODES[4];
                        rowW.appendChild(node.cell)
                        makearr[x][y] = node;
                }
        }
        return makearr;
}

export function waitforme(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
}

function mouseHoldListener() {
        window.addEventListener('mousedown', function () {
                ismousedown = !ismousedown;
        });
}

function nodeAddEventListener(row, col, gridarray) {
        for (let x = 0; x < row; x++) {
                for (let y = 0; y < col; y++) {
                        if (gridarray[x][y].cell.className != NODES[0] && gridarray[x][y].cell.className != NODES[1]) {
                                // gridarray[x][y].cell.addEventListener("mousedown",function(e){
                                //         add_mouseDown(e,gridarray[x][y]);
                                // })
                                gridarray[x][y].cell.addEventListener("mousedown", add_mouseDown(gridarray[x][y]));
                                gridarray[x][y].cell.addEventListener("mouseover", add_mouseOver(gridarray[x][y]));
                        }


                        if (gridarray[x][y].cell.className === NODES[0] || gridarray[x][y].cell.className === NODES[1]) {
                                //console.log(gridarray[x][y])
                                gridarray[x][y].cell.addEventListener('dragstart', dragStart);
                                gridarray[x][y].cell.addEventListener('dragend', dragEnd);
                        }

                        gridarray[x][y].cell.addEventListener("dragenter", dragEnter);
                        gridarray[x][y].cell.addEventListener("dragleave", function (e) {
                                e.preventDefault();
                                //console.log("leaving");
                                gridarray[x][y].cell.className = gridarray[x][y].type;
                        })

                        gridarray[x][y].cell.addEventListener("dragover", function (e) {
                                e.preventDefault();
                        })

                        gridarray[x][y].cell.addEventListener("drop", function (e) {
                                e.preventDefault();
                                //console.log("drop listiner");
                                let xy = e.target.id.split("-");
                                //console.log(gridarray[xy[0]][xy[1]]);

                                if (gridarray[xy[0]][xy[1]].type != NODES[1] && gridarray[xy[0]][xy[1]].type != NODES[0]) {
                                        //console.log("checcking what nodes");
                                        if (dragged_node.className === NODES[0]) {
                                                //console.log("inside start")
                                                changeStart(gridarray[x][y]);
                                        }
                                        else if (dragged_node.className === NODES[1]) {
                                                //console.log("inside end")
                                                changeEnd(gridarray[x][y]);
                                        }
                                }
                                else {
                                        console.log("nothing");
                                }
                        })



                }
        }
}

function setPathAlgorithm(txt) {
        switch (txt) {
                case 'Breadth-First Search':
                        runalgo = 0;
                        document.querySelector('#visualize').innerHTML = 'Visualize BFS!';
                        break;
                case 'Depth-First Search':
                        runalgo = 3;
                        document.querySelector('#visualize').innerHTML = 'Visualize DFS!';
                        break;
                case 'A* Search':
                        runalgo = 1;
                        document.querySelector('#visualize').innerHTML = 'Visualize A*!';
                        break;
                case 'Dijkstra\'s Algorithm':
                        runalgo = 2;
                        document.querySelector('#visualize').innerHTML = 'Visualize Dijkstra!';
                        break;
                case 'Greedy Best-First Search':
                        runalgo = 4;
                        document.querySelector('#visualize').innerHTML = 'Visualize Greedy!';
                        break;
                default:
                        runalgo = 0;
                        break;
        }
}

async function RunAlgorithm() {
        let success = false;
        switch (runalgo) {
                case 0:
                        running = true;
                        success = await bfs.BFSalgorithm(gridarray, current_start, current_end, row, col, ms);
                        break;
                case 1:
                        running = true;
                        success = await astar.Astar_algorithm(gridarray, current_start, current_end, row, col, ms);
                        break;
                case 2:
                        running = true;
                        success = await dijkstra.dijkstra_algorithm(gridarray, current_start, current_end, row, col, ms);
                        break;
                case 3:
                        running = true;
                        success = await dfs.dfs_algorithm(gridarray, current_start, current_end, row, col, ms);
                        break;
                case 4:
                        running = true;
                        success = await gbfs.gbfs_algorithm(gridarray, current_start, current_end, row, col, ms);
                        break;
                default:
                        running = false;
                        document.querySelector('#visualize').innerHTML = 'Pick an Algorithm!';
                        break;
        }
        if (success === true) {
                running = false;
        }
        if (success === false) {
                running = false;
                console.log('no path');
        }
}

function dragStart() {
        dragged_node = this;
        //this.style.opacity = "0.5";
}

function dragEnd() {
        //this.style.opacity = "1";
}

function dragEnter() {
        if (this.className != NODES[0] && this.className != NODES[1]) {
                if (dragged_node.className === NODES[0]) {
                        this.className = NODES[0];
                }
                else if (dragged_node.className === NODES[1]) {
                        this.className = NODES[1];
                }
        }
}

function changeStart(node) {
        current_start.cell.className = NODES[0];
        if (current_start === node) { return };
        //sconsole.log("change start function");
        node.cell.className = NODES[0];
        node.type = NODES[0];
        node.cell.setAttribute('draggable', true);
        node.cell.removeEventListener("mousedown", add_mouseDown(node));
        node.cell.removeEventListener("mouseover", add_mouseOver(node));
        node.cell.addEventListener('dragstart', dragStart);
        node.cell.addEventListener('dragend', dragEnd);
        node.cell.opacity = "1";


        current_start.cell.className = "UNVISITED";
        current_start.type = NODES[4];
        current_start.cell.removeAttribute("draggable");

        current_start.cell.addEventListener("mousedown", add_mouseDown(current_start));
        current_start.cell.addEventListener("mouseover", add_mouseOver(current_start));
        current_start.cell.removeEventListener('dragstart', dragStart);
        current_start.cell.removeEventListener('dragend', dragEnd);
        current_start.cell.opacity = '1';


        current_start = node;
}

function changeEnd(node) {
        current_end.cell.className = NODES[1];
        if (current_end === node) { return };
        //console.log("change end function");
        node.cell.className = NODES[1];
        node.type = NODES[1];
        node.cell.setAttribute('draggable', true);
        node.cell.removeEventListener("mousedown", add_mouseDown);
        node.cell.removeEventListener("mouseover", add_mouseOver);
        node.cell.addEventListener('dragstart', dragStart);
        node.cell.addEventListener('dragend', dragEnd);
        node.cell.opacity = "1";

        current_end.cell.className = "UNVISITED";
        current_end.type = NODES[4];
        current_end.cell.removeAttribute("draggable");

        current_end.cell.addEventListener("mousedown", add_mouseDown);
        current_end.cell.addEventListener("mouseover", add_mouseOver);
        current_end.cell.removeEventListener('dragstart', dragStart);
        current_end.cell.removeEventListener('dragend', dragEnd);
        current_end.cell.opacity = '1';

        current_end = node;

}

function add_mouseDown(node) {
        return function inner(event) {
                if (event.buttons === 1) {
                        nodeHandler(node)
                }
                else if (event.buttons === 2) {
                        cleanNode(node);
                }
        }

}

function add_mouseOver(node) {
        return function inner(event) {
                if (event.buttons === 1) {
                        nodeHandler(node);
                }
                else if (event.buttons === 2) {
                        cleanNode(node);
                }
        }


}

function nodeHandler(node) {
        if (running === true) { return }
        if (node.cell.className != 'START' && node.cell.className != 'END' && node.cell.className != 'START-PATH' && node.cell.className != 'END-PATH') {
                node.type = 'WALL';
                node.cell.className = 'WALL';
        }
}

function cleanNode(node) {
        if (running === true) { return }
        if (node.cell.className != 'START' && node.cell.className != 'END' && node.cell.className != 'START-PATH' && node.cell.className != 'END-PATH') {
                node.type = 'UNVISITED';
                node.cell.className = 'UNVISITED';
        }
}

function SetDefaultNodes() {
        //start
        gridarray[default_start[0]][default_start[1]].cell.className = NODES[0];
        gridarray[default_start[0]][default_start[1]].type = NODES[0];
        gridarray[default_start[0]][default_start[1]].cell.setAttribute('draggable', true);
        //end
        gridarray[default_end[0]][default_end[1]].cell.className = NODES[1];
        gridarray[default_end[0]][default_end[1]].type = NODES[1];
        gridarray[default_end[0]][default_end[1]].cell.setAttribute('draggable', true);

}

function ClearBoards() {
        for (let x = 0; x < row; x++) {
                for (let y = 0; y < col; y++) {
                        Reset_Node_Value(gridarray[x][y]);
                        if (gridarray[x][y].type === 'START' || gridarray[x][y].type === 'END') { continue };
                        //console.log("clearing");
                        cleanNode(gridarray[x][y]);
                }
        }

        changeStart(gridarray[default_start[0]][default_start[1]]);
        changeEnd(gridarray[default_end[0]][default_end[1]]);
        current_start.cell.className = 'START';
        current_start.type = 'START';
        current_end.cell.className = 'END';
        current_end.type = 'END';
}

function Reset_Node_Value(node) {
        node.gScore = Infinity;
        node.fScore = Infinity;
        node.hScore = Infinity;
        node.count = 0;
        node.cost = 0;
        node.distance = Infinity;
        node.weight = 0;
}

function ClearWalls() {
        for (let x = 0; x < row; x++) {
                for (let y = 0; y < col; y++) {
                        Reset_Node_Value(gridarray[x][y]);
                        if (gridarray[x][y].type === 'WALL' || gridarray[x][y].type == 'VISITED') {
                                cleanNode(gridarray[x][y]);
                        }
                }
        }
}

function ClearPath() {
        for (let x = 0; x < row; x++) {
                for (let y = 0; y < col; y++) {

                        if (gridarray[x][y].type == 'SHORTEST-PATH' || gridarray[x][y].type == 'VISITED') {
                                gridarray[x][y].cell.className = 'UNVISITED';
                                gridarray[x][y].type = 'UNVISITED';
                        }
                        Reset_Node_Value(gridarray[x][y]);
                }
        }
        current_start.cell.className = 'START';
        current_start.type = 'START';
        current_end.cell.className = 'END';
        current_end.type = 'END';
}

function prevenContextMenu() {
        window.addEventListener('contextmenu', function (e) {
                e.preventDefault();
        }, false);
}

function setNeighbors(row, col, gridarray) {
        for (let x = 0; x < row; x++) {
                for (let y = 0; y < col; y++) {
                        gridarray[x][y].neighbors = findNeighbors(gridarray[x][y], row, col);
                }
        }
}

function findNeighbors(node, row, col) {
        let neighbors = [];
        const r = [0, 1, 0, -1];
        const c = [-1, 0, 1, 0];
        let add = true;

        //console.log("Current Node: "+"Node row: "+node.row +" "+"Node col: "+node.column)
        for (let z = 0; z < r.length; z++) {
                let newr = node.column + r[z];
                let newc = node.row + c[z];
                //console.log(" "+c[z]+" "+r[z])
                //console.log("neighbor node: row "+newc+" col "+newr);
                if (newr < 0 || newc >= row) {
                        //console.log("donot add");
                        continue;
                }
                if (newc < 0 || newr >= col) {
                        //console.log("donot add");
                        continue;
                }

                if (gridarray[newc][newr].type === NODES[3]) {
                        continue;
                }
                // if(gridarray[newc][newr].type === NODES[0] || gridarray[newc][newr].type === NODES[1]){
                //         continue;
                // }
                neighbors.push(gridarray[newc][newr])


        }
        //console.log("---------------------------------------")
        //console.log(neighbors);
        return neighbors;
}

function findStart(row, col, gridarray) {
        for (let x = 0; x < row; x++) {
                for (let y = 0; y < col; y++) {
                        if (gridarray[x][y].type === NODES[0]) {
                                return gridarray[x][y];
                        }
                }
        }
}

function findEnd(row, col, gridarray) {
        for (let x = 0; x < row; x++) {
                for (let y = 0; y < col; y++) {
                        if (gridarray[x][y].type === NODES[1]) {
                                return gridarray[x][y];
                        }
                }
        }
}


export const show_shortest_path = async () => {
        //#region OLD SHOW
        // debugger;
        // console.log(pred);
        // let crawl = pred[current_end.row][current_end.column];
        // while(pred[crawl.row][crawl.column] != -1){
        //         gridarray[crawl.row][crawl.column].cell.className = NODES[6]
        //         gridarray[crawl.row][crawl.column].type = NODES[6];
        //         crawl = pred[crawl.row][crawl.column];
        //         await waitforme(25);
        // }
        // current_start.cell.className = NODES[8];
        //#endregion 
        //debugger;
        //console.log(gridarray);
        current_end.cell.className = NODES[9];
        let current_node = current_end.parents;
        while (current_node.type != 'START') {
                current_node.cell.className = NODES[6];
                current_node.type = NODES[6];
                current_node = current_node.parents;
                await waitforme(25);
        }
        current_start.cell.className = NODES[8];
}

