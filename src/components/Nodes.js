import React, { Component } from 'react'
import './maze.css'

export class Nodes extends Component {
    shouldComponentUpdate(nextProps) {
        if(this.props.showNodes !== nextProps.showNodes) {
            return true
        }else if(this.props.nodes !== nextProps.nodes) {
            return true
        }else if(this.props.colors !== nextProps.colors) {
            return true
        }else if(this.props.path === nextProps.path && this.props.zoom === nextProps.zoom) {
            return false
        } else return true
    }
    getCellPosition = cellid => {
        const x = document.getElementsByClassName(cellid)[0].getBoundingClientRect().left
        const y = document.getElementsByClassName(cellid)[0].getBoundingClientRect().top
        return {x, y}
      }
    renderPath = () => {
        const path = this.props.path
        return path.map((node, index) => {
            if(index > 0) {
                const node2 = path[index-1]
                const cell1Pos = this.getCellPosition(`CELL${node.row}-${node.column}`)
                const cell2Pos = this.getCellPosition(`CELL${node2.row}-${node2.column}`)
                let cells = [cell2Pos]

                if(cell1Pos.x === cell2Pos.x) { //VERTICAL relationship
                    //console.log(node, node2)
                    for(let i = 0; i < Math.abs(node.row - node2.row) - 1; i++) {
                        const min = Math.min(node.row, node2.row)
                        const newCell = this.getCellPosition(`CELL${min + i + 1}-${node.column}`)
                        //console.log(newCell)
                        cells.push(newCell)
                    }
                } 
                if(cell1Pos.y === cell2Pos.y) { //HORIZONTAL relationship
                    //console.log('v')
                    for(let i = 0; i < Math.abs(node.column - node2.column) - 1; i++) {
                        const min = Math.min(node.column, node2.column)
                        const newCell = this.getCellPosition(`CELL${node.row}-${min + i + 1}`)
                        cells.push(newCell)
                    }
                } 
                return cells.map(cell => {
                    return <div className='node' style={{position: 'absolute', left: cell.x, top:cell.y, backgroundColor:this.props.colors.path}}/>
                })
            }
        })
    }
    renderNodes = () => {
        if(this.props.showNodes) {
            if(this.props.path !== null) {
                return this.renderPath()
            }
        }
    }
    render() {
        return (
            <div>
                {this.renderNodes()}
            </div>
        )
    }
}

export default Nodes
