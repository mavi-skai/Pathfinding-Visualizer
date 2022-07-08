export default class Node{
    constructor(row,column){
        this.type = "DEFAULT";
        this.row = row;
        this.column = column;
        this.neighbors = [];
        this.cell = undefined;
        this.parents = undefined;


        //DFS algorithm
        this.cost = 0;

        //Dijkstra algorithm
        this.distance = Infinity;
        this.weight = 0;

        //A* algorithm
        this.fScore = Infinity;
        this.gScore = Infinity;
        this.hScore = Infinity;
        this.count = 0;
        

    }
}