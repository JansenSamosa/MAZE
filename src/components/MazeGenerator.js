import React, { Component } from 'react'
import seedrandom from 'seedrandom'
import Maze from './Maze'

//rows is left to right
//columns are top to bottom

export class MazeGenerator extends Component {
    constructor(props) {
        super(props)

        const rows = props.rows
        const columns = props.columns

        let grid = []

        for(let r = 0; r < rows; r++) {
            for(let c = 0; c < columns; c++) {
                if(!grid[r]) grid[r] = []
                const rowstart = true ? c === 0: false
                grid[r][c] = {
                    id: `r${r+1}c${c+1}`,
                    row: r+1,
                    column: c+1,
                    visited: false,
                    state: '1111', //up, down, left, right // 0 = nothing, 1 = wall
                    rowstart,
                    inStack: false,
                }
            }
        }
        this.state = {
            stack: [grid[0][0]],
            grid,
            finishedGen: false,
            rng: new seedrandom(this.props.seed)
        }
    }
    shouldComponentUpdate(nextProps) {
        if(this.props.zoom !== nextProps.zoom || this.props.borderWidth !== nextProps.borderWidth) {
            return true
        } else {
            return false
        }
    }
    componentDidMount() {
        this.algorithm()
    }
    setWalls = (r, c, top, bottom, left, right) => {
        top = top === -1 ? this.state.grid[r][c].state[0] : top
        bottom = bottom === -1 ? this.state.grid[r][c].state[1] : bottom
        left = left === -1 ? this.state.grid[r][c].state[2] : left
        right = right === -1 ? this.state.grid[r][c].state[3] : right

        const newWallState = `${top}${bottom}${left}${right}`
        const newGrid = this.state.grid
        newGrid[r][c].state = newWallState
        this.setState({...this.state, grid: newGrid})
    }
    openWall = (r1, c1, r2, c2) => {
        const cell1 = this.state.grid[r1][c1]
        const cell2 = this.state.grid[r2][c2]
        const direction = c1 === c2 ? 'vertical' : r1 === r2 ? 'horizontal' : 'error'
        let vertDir = null //from cell1 -> cell2
        let horizDir = null //from cell1 -> cell2
        
        if(direction === 'vertical') {
            vertDir = r1 > r2 ? 'top' : 'bottom' 
            if(vertDir === 'top') {
                this.setWalls(r1, c1, 0, -1, -1, -1)
                this.setWalls(r2, c2, -1, 0, -1, -1)
            }
            else if(vertDir === 'bottom') {
                this.setWalls(r1, c1, -1, 0, -1, -1)
                this.setWalls(r2, c2, 0, -1, -1, -1)
            }
        }
        else if(direction === 'horizontal') {
            horizDir = c1 > c2 ? 'left' : 'right' 
            if(horizDir === 'left') {
                this.setWalls(r1, c1, -1, -1, 0, -1)
                this.setWalls(r2, c2, -1, -1, -1, 0)
            }
            else if(horizDir === 'right') {
                this.setWalls(r1, c1, -1, -1, -1, 0)
                this.setWalls(r2, c2, -1, -1, 0, -1)
            }
            
        } else return null

    }
    setVisited = (r, c, visited) => {
        const newGrid = this.state.grid
        newGrid[r][c].state.visited = visited
        this.setState({...this.state, grid: newGrid})
    }
    getNeighbors = (r, c) => {
        let topN = null
        let bottomN = null
        let leftN = null
        let rightN = null
        try {
            topN = this.state.grid[r-1][c]
            if(topN.visited) topN = null       
            for(let i = 0; i < this.state.stack.length; i++) {
                if(this.state.stack[i] === topN) {
                    topN = null
                }
            }
        } catch(err) {}
        try {
            bottomN = this.state.grid[r+1][c]
            if(bottomN.visited) bottomN = null
            for(let i = 0; i < this.state.stack.length; i++) {
                if(this.state.stack[i] === bottomN) {
                    bottomN = null
                }
            }
        } catch(err) {}
        try {
            leftN =  this.state.grid[r][c-1]
            if(leftN.visited) leftN = null
            for(let i = 0; i < this.state.stack.length; i++) {
                if(this.state.stack[i] === leftN) {                 
                    leftN = null
                }
            }
            
        } catch(err) {}
        try {
            rightN = this.state.grid[r][c+1]
            if(rightN.visited) rightN = null
            for(let i = 0; i < this.state.stack.length; i++) {
                if(this.state.stack[i] === rightN) {
                    rightN = null
                }
            }
        } catch(err) {}

        let neighbors = [topN, bottomN, leftN, rightN]
        neighbors = neighbors.filter(cell => cell !== null && cell !== undefined)
        return neighbors
    }
    randomNum = (max) => {
        if(this.props.seed === '') {
            return Math.floor(Math.random() * (max+1))
        } else {
            return Math.floor(this.state.rng() * (max+1))
        }
    }
    
    algorithm = () => {
        //RECURSIVE BACKTRACKER ALGORITHM
        let num = 0
        const alg = setInterval(() => {
            console.log(num)
            for(let i=0;i<1;i++) {
            let stack = this.state.stack
            let currentCell = stack[stack.length - 1]
            let neighbors = this.getNeighbors(currentCell.row - 1, currentCell.column - 1)
            if(neighbors.length === 0) {
                stack.pop()    
                let grid = this.state.grid
                for(let r = 0; r < grid.length; r++) {
                    for(let c = 0; c < grid[r].length; c++) {
                        if(grid[r][c] === currentCell) {
                            grid[r][c].visited = true
                        }
                    }
                }
                this.setState({...this.state, grid})
            } else if(neighbors.length > 0) {
                const randNeighbor = neighbors[this.randomNum(neighbors.length - 1)]
                randNeighbor.inStack = true
                stack.push(randNeighbor)
                this.openWall(currentCell.row - 1, currentCell.column - 1, randNeighbor.row - 1, randNeighbor.column - 1)
            }
            this.setState({...this.state, stack})
            if(this.state.stack.length === 0) {
                this.setState({...this.state, finishedGen: true})
                clearInterval(alg)
            }
            num++
            }
            this.forceUpdate()
        }, 1);
    }
    sendGridToApp = () => {
        const grid = this.state.grid.map(row => {
            return [row.map(column => {
                return {
                    row: column.row,
                    column: column.column,
                    state: column.state, //up, down, left, right // 0 = nothing, 1 = wall
                }
            })]
        })
        if(this.state.finishedGen) {
            this.props.setGrid(grid)
        }
    }
    renderMaze = () => {
        if(this.state.finishedGen || this.props.showProcess) {
            return <Maze borderWidth={this.props.borderWidth} zoom={this.props.zoom} setWin={this.props.setWin} stack={this.state.stack} grid={this.state.grid} rows={this.props.rows} columns={this.props.columns} finishedGen={this.state.finishedGen}/> 
        } else {
            return null
        }
    }
    render() {
        return (
            <div>
                {this.renderMaze()}             
                {this.sendGridToApp()}
            </div>
        )
    }
}

export default MazeGenerator
