import React, { Component } from 'react'

export class CellPerf extends Component {
    clearFloat = () => {
        if(this.props.cell.rowstart) {
            return {clear: 'left'}
        } else {
            return null
        }
    }
    shouldComponentUpdate(nextProps) {
        let isPlayer = this.props.player.x === this.props.cell.column - 1 && this.props.player.y === this.props.cell.row - 1 ? true : false
        let willBePlayer = nextProps.player.x === nextProps.cell.column - 1 && nextProps.player.y === nextProps.cell.row - 1 ? true : false
        
        
        if(isPlayer || willBePlayer) {
            return true
        } else if(this.props.borderWidth !== nextProps.borderWidth) {
            return true
        } else if (this.props.nodes !== nextProps.nodes && this.props.showNodes) {
            return true
        } else if (this.props.showNodes !== nextProps.showNodes) {
            return true
        } else return false
    }
    componentDidUpdate() {
        
    }
    walls = () => { 
        let style = null
        const player = this.props.player
        let isPlayer = player.x === this.props.cell.column - 1 && player.y === this.props.cell.row - 1 ? true : false
        let isWin = this.props.cell.column === 1 && this.props.cell.row == this.props.rows ? true : false

        let backgroundColor = 'white'
        backgroundColor = isWin === true ? 'lightgreen' : backgroundColor
        backgroundColor = isPlayer === true ? 'yellow' : backgroundColor
        
        if(isWin && isPlayer) {
            console.log("Win!")
            this.props.setWin()
        }
        const borderTop =  this.props.cell.state[0] === '1' ? `${this.props.borderWidth}px solid black`: `2px hidden white`
        const borderBottom = this.props.cell.state[1] === '1' ? `${this.props.borderWidth}px solid black` : `2px hidden white`
        const borderLeft = this.props.cell.state[2] === '1' ? `${this.props.borderWidth}px solid black` : `2px hidden white`
        const borderRight = this.props.cell.state[3] === '1' ? `${this.props.borderWidth}px solid black` : `2px hidden white`

        
        style = {backgroundColor, borderTop, borderBottom, borderLeft, borderRight, ...this.clearFloat()}
        return style
    }
    renderNode = () => {
        if(this.props.showNodes) {    
            const nodes = this.props.nodes
            if(nodes !== null) {
                for(let i = 0; i < nodes.length; i++) {
                    if(nodes[i].id === `NODE${this.props.cell.row}-${this.props.cell.column}`) {
                        if(nodes[i].highlighted) {
                            return <div className='node' style={{backgroundColor: 'black', zIndex:'2'}} onMouseOver={() => console.log(nodes[i])}/>
                        } else {
                            return null
                            //<div className='node' onMouseOver={() => console.log(nodes[i])}/>
                        }
                    }
                }
            } else return null
        }
    }
    render() {
        return (
            <div className='grid-cell' style={this.walls()}>
                {this.renderNode()}
            </div>
        )
    }
}

export default CellPerf
