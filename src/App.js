import React, { Component } from 'react'
import seedrandom from 'seedrandom'

import Settings from './components/Settings'
import MazeGenerator from './components/MazeGenerator.js'
import Pathfinding from './components/Pathfinding'

import './App.css';
import './components/maze.css'

import zoominIcon from './icons/zoomin-icon.png'
import zoomoutIcon from './icons/zoomout-icon.png'

export class App extends Component {
  state = {
    seed: '',
    rows: 10,
    columns: 10,
    showProcess: true,
    zoom: '100',
    borderWidth: 1,
    startGen: true,
    win: false,
    grid: null,
    nodes: null,
    path: null,
    showNodes: true,
    pathfinding: false,
    doneFilling: false,
    colors: {
      player: '#ffff00',
      goal: '#66ff66',
      path: '#ffb3b3',
      cell: '#ffb3b3',
      stackcell: '#ccd9ff',
      visitedcell: '#e6ffe6'
    },
    player: null,
    findPath: false 
  }
  setSettings = newState => {
     this.setState({...this.state, ...newState})
  }
  setGrid = grid => {
    this.setState({...this.state, grid, pathfinding: true})
  }
  setNodes = (nodes, path) => {
    if(path) path = new Array(...path)
    this.setState({...this.state, nodes, path})
  }
  setPlayer = player => {
    this.setState({...this.state, player})
  }
  setWin = () => {
    this.setState({...this.state, win: true})
  }
  renderWin = () => {
    if(this.state.win) {
      return <p>You win!</p>
    }
  }
  zoom = zoomfactor => {
    if(parseInt(this.state.zoom) + zoomfactor > 0) {
      this.setState({...this.state, zoom: `${parseInt(this.state.zoom) + zoomfactor}`, showNodes: false}, () => {
        this.setState({...this.state, showNodes:true})
      })
    }
  }
  startZoom = zoomfactor => {
    this.zoominterval = setInterval(() => {
      this.zoom(zoomfactor)
    },1)
  }
  endZoom = () => {
    clearInterval(this.zoominterval)
  }
  generateMaze = () => {
    if(this.state.startGen) {
      return <MazeGenerator 
            setGrid={this.setGrid.bind(this)} 
            setWin={this.setWin}
            setPlayer={this.setPlayer}
            seed={this.state.seed}
            columns={this.state.columns} 
            rows={this.state.rows} 
            showProcess={this.state.showProcess}
            zoom={this.state.zoom}
            borderWidth={this.state.borderWidth}
            nodes={this.state.nodes}
            path={this.state.path}
            showNodes={this.state.showNodes}
            colors={this.state.colors}/>
    }
  }
  startPathfinding = () => {
    if(this.state.grid !== null && this.state.pathfinding) {
      return <Pathfinding 
              grid={this.state.grid} 
              rows={this.state.rows} 
              columns={this.state.columns}
              setNodes={this.setNodes.bind(this)}
              setSettings={this.setSettings}
              findPath={this.state.findPath}
              player={this.state.player}/>
    }
  }
  
  generate = e => {
    e.preventDefault()
    this.setState({...this.state, startGen: true})
  }
  restart = e => {
    e.preventDefault()
    this.setState({...this.state, startGen: false, win: false, grid: null, nodes: null, pathfinding: false, path: null, doneFilling: false})
    this.timeout = setTimeout(() => {
      this.generate(e)
    }, 50)
  }
  findPath = () => {
    this.setState({...this.state, findPath: true})
  }
  render() {
    return (
      <div>
        <Settings 
            setSettings={this.setSettings.bind(this)}
            seed={this.state.seed}
            columns={this.state.columns} 
            rows={this.state.rows} 
            borderWidth={this.state.borderWidth}
            colors={this.state.colors}
            restart={this.restart}
            findPath={this.findPath}
            doneFilling={this.state.doneFilling}
        />
        <div className='screenbtns'>
          <img src={zoominIcon} name='zoomin' alt='' 
                onMouseDown={this.startZoom.bind(this, 2)}
                onMouseUp={this.endZoom}
                onMouseOut={this.endZoom}
                onTouchStart={this.startZoom.bind(this, 2)}
                onTouchEnd={this.endZoom}/>
          <img src={zoomoutIcon} name='zoomout' alt='' 
                onMouseDown={this.startZoom.bind(this, -2)}
                onMouseUp={this.endZoom}
                onMouseOut={this.endZoom}
                onTouchStart={this.startZoom.bind(this, -2)}
                onTouchEnd={this.endZoom}/>
        </div>
        {this.renderWin()}
        {this.generateMaze()}
        {this.startPathfinding()}
      </div>
    )
  }
}

export default App

