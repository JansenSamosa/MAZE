import React, { Component } from 'react'
import Cell from './Cell'
import CellPerf from './CellPerf'

import './maze.css'

export class Maze extends Component {
    state = {
        wait: false,
        player: {
            x: this.props.columns - 1,
            y: 0,
            canGo: {
                up: true,
                down: true,
                left: true,
                right: true
            }
        }
    }
    shouldComponentUpdate(nextProps, nextState) {
        if(this.props === nextProps && this.state === nextState) return false
        else return true
    }
    componentDidMount() {
        document.addEventListener('keydown', this.handleKeyDown.bind(this))
        this.setState({...this.state, player:{...this.state.player, canGo: this.checkWalls(this.state.player)}})
    }
    componentDidUpdate() {
        if(this.state.wait) {
            this.timeout = setTimeout(() => {
                this.setState({...this.state, wait: false})
            }, 25)
        }
    }
    checkWalls = (player) => {
        try {
            const walls = this.props.grid[player.y][player.x].state
            player.canGo.up = walls[0] == 0 ? true : false
            player.canGo.down = walls[1] == 0 ? true : false
            player.canGo.left = walls[2] == 0 ? true : false
            player.canGo.right = walls[3] == 0 ? true : false
        } catch (error) {
            console.log("Error")
        }
        return player.canGo
    }
    handleKeyDown = e => {
        if(!this.state.wait) {
            let newPlayer = Object.assign({}, this.state.player)
            switch(e.which){
                case 87:
                    if(this.state.player.canGo.up) newPlayer.y--
                    break
                case 65:
                    if(this.state.player.canGo.left) newPlayer.x--
                    break
                case 83:
                    if(this.state.player.canGo.down) newPlayer.y++
                    break
                case 68:
                    if(this.state.player.canGo.right) newPlayer.x++
                    break
                default:
                    break
            }
            newPlayer.canGo = this.checkWalls(newPlayer)
            this.setState({...this.state, wait: true, player:{x: newPlayer.x, y: newPlayer.y, canGo: newPlayer.canGo}})
        }
    }
    renderMaze = () => {
        if(this.props.finishedGen) {
            return <React.Fragment>
                        {this.props.grid.map(row => (
                            row.map(column => (
                                <CellPerf 
                                    borderWidth={this.props.borderWidth} 
                                    setWin={this.props.setWin} 
                                    rows={this.props.rows} 
                                    columns={this.props.columns} 
                                    cell={column} 
                                    key={column.id} 
                                    player={this.state.player} 
                                    finishedGen={this.props.finishedGen}
                                    nodes={this.props.nodes}
                                    showNodes={this.props.showNodes}/>
                            ))
                        ))}
                    </React.Fragment>
        }else {
            return <React.Fragment>
                {this.props.grid.map(row => (
                    row.map(column => (
                        <Cell 
                            borderWidth={this.props.borderWidth} 
                            cell={column} key={column.id} 
                            player={this.state.player} 
                            finishedGen={this.props.finishedGen} 
                            stackLast={this.props.stack[this.props.stack.length-1]}
                            key={column.id}/>
                    ))
                ))}
            </React.Fragment>
        }
    }
    render() {
        return (
            <div className='parent' style={{zoom:`${this.props.zoom}%`}}>
                <div className='grid' style={{width:`${30 * this.props.columns + 100}px`}}>
                    {this.renderMaze()}
                </div>
            </div>
        )
    }
}

export default Maze
