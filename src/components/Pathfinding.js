import React, { Component } from 'react'

export class Pathfinding extends Component {
    constructor(props) {
        super(props)
        
        this.state = {
            nodes: this.createNodes(),
            queue: []
        }
    }
    componentDidMount() { 
        this.props.setNodes(this.state.nodes)
        this.startFloodfill()
    }
    shouldComponentUpdate(nextProps) {
        if(this.props.grid !== nextProps.grid) return true
        else return false
    }
    createNodes = () => {
        let nodes = []
        let cells = []

        for(let i = 0; i < this.props.grid.length; i++) {
            cells = cells.concat(...this.props.grid[i])
        }
        nodes = cells.map(cell => {
            const state = cell.state
            const vertOpen = state[0] == 0 || state[1] == 0 ? true : false
            const horizOpen = state[2] == 0 || state[3] == 0 ? true : false
            let createNode = vertOpen && horizOpen ? true : false

            if(cell.row === 1 && cell.column === this.props.columns) createNode = true //starting node
            if(cell.row === this.props.rows && cell.column === 1) createNode = true //goal node

            if(createNode) {
                const h = Math.floor(Math.sqrt(  
                    (cell.column - 1)*(cell.column - 1) + (cell.row - this.props.rows)*(cell.row - this.props.rows) 
                ) * 10)
                return {
                    id: `NODE${cell.row}-${cell.column}`,
                    row: cell.row,
                    column: cell.column,
                    connections: [],
                    distance: null, //FLOODFILL ALG - distance from goal node
                    highlighted: false
                }
            }
        })
        nodes = nodes.filter(node => node !== undefined)
        nodes = this.createNodeConnections(nodes)
        return nodes
    }
    createNodeConnections = nodes => {
        let newNodes = nodes
        newNodes = newNodes.map(node => {
            let connections = []

            for(let i = 0; i < newNodes.length; i++) {
                const hasConn = this.determineConnection(node, newNodes[i])
                if(hasConn) connections.push({
                    nodeid: newNodes[i].id,
                    distance: Math.sqrt(  
                        (node.column - newNodes[i].column)*(node.column - newNodes[i].column) + (node.row - newNodes[i].row)*(node.row - newNodes[i].row) 
                    ) * 10
                })
            }

            return {...node, connections}
        })
        return newNodes
    }
    determineConnection = (node1, node2) => {
        let hasConn = true
        if(node1.row === node2.row || node1.column === node2.column) {
            const horizConn = node1.row === node2.row ? true : false
            const vertConn = node1.column === node2.column ? true : false

            if(vertConn && horizConn) hasConn = false // Return false is node1 and node2 are the same node
            if(!vertConn && !horizConn) hasConn = false
            let cells = []

            for(let i = 0; i < this.props.grid.length; i++) {
                cells = cells.concat(...this.props.grid[i])
            }
            
            if(horizConn) {
                cells.forEach(cell => {
                    if(cell.row === node1.row) {
                        const min = Math.min(node1.column, node2.column)
                        const max = Math.max(node1.column, node2.column)
                        if(cell.column < max && cell.column > min) {
                            if(cell.state[2] == 1 || cell.state[3] == 1) {
                                hasConn = false
                            }
                        }
                        if(max - min === 1) { //if nodes are next to each other
                            
                            const leftNode = node1.column === min ? node1 : node2
                            if(leftNode.column === cell.column) {
                                if(cell.state[3] == 1) {
                                    hasConn = false
                                }
                            }
                        }
                    }
                })
            }
            if(vertConn) {
                cells.forEach(cell => {
                    if(cell.column === node1.column) {
                        const min = Math.min(node1.row, node2.row)
                        const max = Math.max(node1.row, node2.row)
                        if(cell.row < max && cell.row > min) {
                            if(cell.state[0] == 1 || cell.state[1] == 1) {
                                hasConn = false
                            }
                        }
                        if(max - min === 1) { //if nodes are next to each other
                            const topNode = node1.row === min ? node1 : node2
                            if(topNode.row === cell.row) {
                                if(cell.state[1] == 1) {
                                    hasConn = false
                                }
                            }
                        }
                    }
                })
            }
        } else {
            hasConn = false
        }
        return hasConn
    }
    setNodeDistance = (nodeid, d) => {
        const nodes = new Array(...this.state.nodes)

        for(let i = 0; i < nodes.length; i++) {
            if(nodes[i].id === nodeid) {
                nodes[i].distance = d
                this.setState({...this.state, nodes})
                return null
            }
        }
    }
    highlightNode = (nodeid) => {
        const nodes = new Array(...this.state.nodes)
        for(let i = 0; i < nodes.length; i++) {
            if(nodes[i].id === nodeid) {
                nodes[i].highlighted = true
            } else {
                nodes[i].highlighted = false
            }
        }
        this.setState({...this.state, nodes})
    }
    getNode = (nodeid) => {
        const nodes = this.state.nodes
        for(let i = 0; i < nodes.length; i++) {
            if(nodes[i].id === nodeid) {
                return nodes[i]
            }
        }
    }
    startFloodfill = () => {
        this.setNodeDistance(`NODE${this.props.rows}-1`, 0)
        const newQueue = [this.state.nodes.filter(node => node.id === `NODE${this.props.rows}-1`)[0]] //sets goal node as only value in queue

        this.setState({...this.state, queue: newQueue})

        let num = 0
        const alg = setInterval(() => {
            let newQueue = new Array(...this.state.queue)
            const currentNode = newQueue[0]
            this.highlightNode(currentNode.id)
            console.log(newQueue)
            const neighbors = currentNode.connections.filter(node => this.getNode(node.nodeid).distance === null)
            for(let i = 0; i < neighbors.length; i++) {
                this.setNodeDistance(neighbors[i].nodeid, currentNode.distance + neighbors[i].distance)
                newQueue.push(this.getNode(neighbors[i].nodeid))
            }
            newQueue.shift()
            this.setState({...this.state, queue: newQueue})
            if(newQueue.length === 0) {
                clearInterval(alg)
                this.highlightNode('asd')
            }
            num++
            this.props.setNodes(this.state.nodes)
            this.forceUpdate()
        }, 1)
    }
    render() {
        return (
            <div>
                
            </div>
        )
    }
}

export default Pathfinding
