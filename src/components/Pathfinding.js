import React, { Component } from 'react'

export class Pathfinding extends Component {
    constructor(props) {
        super(props)
        
        this.state = {
            nodes: [],
            queue: [],
            path: []
        }
    }
    componentDidMount() { 
        this.setState({...this.state, nodes: this.createNodes()})
        const delay = setTimeout(() => {
            this.startFloodfill()
        }, 1000)
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
        for(let i = 0; i < cells.length; i++) {
            const state = cells[i].state
            const vertOpen = state[0] == 0 || state[1] == 0 ? true : false
            const horizOpen = state[2] == 0 || state[3] == 0 ? true : false
            let createNode = vertOpen && horizOpen ? true : false

            //if(cells[i].row === 1 && cells[i].column === this.props.columns) createNode = true //starting node
            //if(cells[i].row === this.props.rows && cells[i].column === 1) createNode = true //goal node
            //console.log(cells[i], createNode)
            
            if(createNode) {
                const h = Math.floor(Math.sqrt(  
                    (cells[i].column - 1)*(cells[i].column - 1) + (cells[i].row - this.props.rows)*(cells[i].row - this.props.rows) 
                ) * 10)
                nodes.push( {
                    id: `NODE${cells[i].row}-${cells[i].column}`,
                    row: cells[i].row,
                    column: cells[i].column,
                    connections: [],
                    distance: null, //FLOODFILL ALG - distance from goal node
                    highlighted: false
                })
            }
        }
        nodes.push( { //Start
            id: `NODE1-${this.props.columns}`,
            row: 1,
            column: parseInt(this.props.columns),
            connections: [],
            distance: null, //FLOODFILL ALG - distance from goal node
            highlighted: false
        })
        nodes.push( {
            id: `NODE${this.props.rows}-1`,
            row: parseInt(this.props.rows),
            column: 1,
            connections: [],
            distance: null, //FLOODFILL ALG - distance from goal node
            highlighted: false
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
        let nodes = new Array(...this.state.nodes)

        for(let i = 0; i < nodes.length; i++) {
            if(nodes[i].id === nodeid) {
                nodes[i].distance = d
                this.setState({...this.state, nodes})
                return null
            }
        }
    }
    highlightNode = (nodeid, one) => {
        const nodes = new Array(...this.state.nodes)
        for(let i = 0; i < nodes.length; i++) {
            if(nodes[i].id === nodeid) {
                nodes[i].highlighted = true
            } else {
                if(one) {
                    nodes[i].highlighted = false
                }
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
        this.alg = setInterval(() => {
            console.log(num)
            let queue = new Array(...this.state.queue)
            if(queue.length > 0) {
                console.log('this.state.nodes.filter(node => node.id === `NODE${this.props.rows}-1`)[0]', this.state.nodes.filter(node => node.id === `NODE${this.props.rows}-1`)[0])
                console.log('this.state', this.state)
                console.log('this.state.queue',this.state.queue)
                console.log('queue',queue)
                const currentNode = queue[0]
                console.log('currentnode',currentNode)
                this.highlightNode(currentNode.id, true)
                const neighbors = currentNode.connections.filter(node => this.getNode(node.nodeid).distance === null)
                for(let i = 0; i < neighbors.length; i++) {
                    this.setNodeDistance(neighbors[i].nodeid, currentNode.distance + neighbors[i].distance)
                    queue.push(this.getNode(neighbors[i].nodeid))
                }
                queue.shift()
                this.setState({...this.state, queue: queue})
            }
            if(queue.length === 0) {
                this.highlightNode('asd', true)
                this.delay = setTimeout(() => {
                    this.getQuickestPath(`NODE1-${this.props.columns}`)
                }, 1000)
                
                clearInterval(this.alg)
            }
            num++
            this.props.setNodes(this.state.nodes)
            this.forceUpdate()
        }, 1)
    }
    getQuickestPath = (startNodeid) => {
        const startNode = this.state.nodes.filter(node => node.id === startNodeid)[0]
        console.log(this.state.nodes)
        console.log(startNode)
        let path = [startNode]

        this.highlightNode('asd', true)

        let num = 0
        this.alg2 = setInterval(() => {
            console.log(num)
            console.log('this.state',this.state)
            console.log('this.state.nodes',this.state.nodes)
            console.log('startnode',startNode)
            console.log('path',path)
            const currentNode = path[path.length-1]
            console.log(currentNode)
            const neighbors = currentNode.connections
            let lowest = {distance: 999999}
            for(let i = 0; i < neighbors.length; i++) {
                const node = this.getNode(neighbors[i].nodeid)
                if(node.distance < lowest.distance) {
                    lowest = node
                }
            }
            path.push(lowest)
            if(lowest.distance === 0) {
                console.log("Done! :D")
                this.setState({...this.state, path})
                this.highlightPath()
                clearInterval(this.alg2)
            }
            num++
        }, 1)
    }
    highlightPath = () => {
        const path = this.state.path
        console.log(path)
        let i = 0
        this.highlightP = setInterval(() => {
            if(i >= path.length - 1) {
                console.log(i)
                clearInterval(this.highlightP)
            }
            this.highlightNode(path[i].id, false)
            this.props.setNodes(this.state.nodes)
            i++
        }, 1)
    }
    render() {
        return (
            <div>
                
            </div>
        )
    }
    componentWillUnmount() {
        console.log("ASFOIHSAD")
        clearInterval(this.alg)
        clearInterval(this.alg2)
        clearInterval(this.highlightP)
    }
}
export default Pathfinding
