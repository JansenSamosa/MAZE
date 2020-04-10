import React, { Component } from 'react'

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
        if(isCurrent || willBeCurrent || this.props.cell !== nextProps.cell || this.props.borderWidth !== nextProps.borderWidth) {
            return true
        } else {
            return false
        }
    }
    walls = () => { 
        let style = null
        const isCurrent = this.props.cell === this.props.stackLast ? true : false
        let borderColor = '#e60000'
        let backgroundColor = '#ffb3b3'

        if(this.props.cell.inStack) {borderColor='#809fff'; backgroundColor='#ccd9ff'}
        if(this.props.cell.visited) {borderColor='#1aff1a'; backgroundColor='#e6ffe6'}
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
