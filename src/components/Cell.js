import React, { Component } from 'react'
import chroma from 'chroma-js'

export class Cell extends Component {
    clearFloat = () => {
        if(this.props.cell.rowstart) {
            return {clear: 'left'}
        } else {
            return null
        }
    }
    shouldComponentUpdate(nextProps) {
        const isCurrent = this.props.cell === this.props.stackLast ? true : false
        const willBeCurrent = nextProps.cell === nextProps.stackLast ? true : false
        if(isCurrent || willBeCurrent || this.props.cell !== nextProps.cell || 
            this.props.borderWidth !== nextProps.borderWidth || this.props.colors !== nextProps.colors) {
            return true
        } else {
            return false
        }
    }
    walls = () => { 
        let style = null        
        const isCurrent = this.props.cell === this.props.stackLast ? true : false
        console.log(this.props.colors)
        let borderColor = chroma(this.props.colors.cell).darken(1.5).saturate(2)
        if(this.props.colors.cell==='#000000') {
            borderColor = '#000000'
        }
        let backgroundColor = this.props.colors.cell//'#ffb3b3'
        
        if(this.props.cell.inStack) {borderColor=chroma(this.props.colors.stackcell).darken(1.5).saturate(2); backgroundColor=this.props.colors.stackcell}
        if(this.props.cell.visited) {borderColor=chroma(this.props.colors.visitedcell).darken(1.5).saturate(2); backgroundColor=this.props.colors.visitedcell}
        if(isCurrent) {borderColor='black'; backgroundColor='white'}
        if(this.props.finishedGen) {
            borderColor='black'
            backgroundColor='white'
        }
        const borderTop =  this.props.cell.state[0] === '1' ? `${this.props.borderWidth}px solid ${borderColor}`: `.5px hidden ${backgroundColor}`
        const borderBottom = this.props.cell.state[1] === '1' ? `${this.props.borderWidth}px solid ${borderColor}` : `.5px hidden ${backgroundColor}`
        const borderLeft = this.props.cell.state[2] === '1' ? `${this.props.borderWidth}px solid ${borderColor}` : `.5px hidden ${backgroundColor}`
        const borderRight = this.props.cell.state[3] === '1' ? `${this.props.borderWidth}px solid ${borderColor}` : `.5px hidden ${backgroundColor}`

        
        style = {backgroundColor, borderTop, borderBottom, borderLeft, borderRight, ...this.clearFloat()}
        return style
    }
    render() {
        return (
            <div className='grid-cell' style={this.walls()}>
            </div>
        )
    }
}

export default Cell
