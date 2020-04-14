import React, { Component } from 'react'

import './settings.css'
import settingsIcon from '../icons/settings-icon.png'

export class Settings extends Component {
    constructor(props) {
        super(props)
        
        this.state = {
            open: false,
            rows: this.props.rows,
            columns: this.props.columns,
            seed: this.props.seed,
            borderWidth: this.props.borderWidth,
            colors: {
                player: this.props.colors.player,
                goal: this.props.colors.goal,
                path: this.props.colors.path,
                cell: this.props.colors.cell,
                stackcell: this.props.colors.stackcell,
                visitedcell: this.props.colors.visitedcell,
            }
        }
    }
    onChange = e => {
        this.setState({...this.state,[e.target.name]: e.target.value},() => {
            this.props.setSettings(this.state)
        })
    }
    onChangeColor = e => {
        this.setState({...this.state, colors:{...this.state.colors,[e.target.name]: e.target.value}},() => {
            this.props.setSettings(this.state)
        })
    }
    openclose = () => {
        if(this.state.open) return 'opened'
        else return 'closed'
    }
    renderPathfindBtn = () => {
        if(this.props.doneFilling) {
            return <button onClick={this.props.findPath} className='pathfindbtn'>PATHFIND</button>
        } else return null
    }
    render() {
        return (
            <div>
                <div className='navbar'>
                    <h1 className='title'>Maze Generator</h1>
                    <button onClick={this.props.restart.bind(this)} className='regeneratebtn'>REGENERATE</button>
                    {this.renderPathfindBtn()}
                </div>
                
                <div className={`container ${this.openclose()}`}>
                    <img src={settingsIcon} alt='' className='settings-openbtn' onClick={() => this.setState({...this.state, open: !this.state.open})}/>
                    <h1>Settings</h1>
                    <form className='settings-form'>
                        <label for='rows' >Maze Size: </label>
                        <input type='number' name='rows' value={`${this.state.rows}`} onChange={this.onChange.bind(this)}></input>x
                        <input type='number' name='columns' value={`${this.state.columns}`} onChange={this.onChange.bind(this)}></input>
                        <pre style={{clear:'both'}}></pre>

                        <label for='seed' >Seed: </label>
                        <input type='text' name='seed' placeholder='*optional' value={this.state.seed} onChange={this.onChange.bind(this)}></input>

                        <div style={{marginTop:'60px'}}></div>

                        <label for='borderWidth' >Wall Width: </label>
                        <input type='number' name='borderWidth' value={`${this.state.borderWidth}`}onChange={this.onChange.bind(this)}></input>
                        <pre style={{clear:'both'}}></pre>

                        <label for='player' >Player Color: </label>
                        <input type='color' name='player' value={this.state.colors.player} onChange={this.onChangeColor.bind(this)}></input>
                        <pre style={{clear:'both'}}></pre>

                        <label for='goal' >Goal Color: </label>
                        <input type='color' name='goal' value={this.state.colors.goal} onChange={this.onChangeColor.bind(this)}></input>
                        <pre style={{clear:'both'}}></pre>

                        <div style={{marginTop:'60px'}}></div>

                        <label for='path' >Path Color: </label>
                        <input type='color' name='path' value={this.state.colors.path} onChange={this.onChangeColor.bind(this)}></input>
                        <pre style={{clear:'both'}}></pre>

                        <label for='cell' >Cell Color: </label>
                        <input type='color' name='cell' value={this.state.colors.cell} onChange={this.onChangeColor.bind(this)}></input>
                        <pre style={{clear:'both'}}></pre>
                        <label for='stackcell' >Stack Cell Color: </label>
                        <input type='color' name='stackcell' value={this.state.colors.stackcell} onChange={this.onChangeColor.bind(this)}></input>
                        <pre style={{clear:'both'}}></pre>
                        <label for='visitedcell' >Visited Cell Color: </label>
                        <input type='color' name='visitedcell' value={this.state.colors.visitedcell} onChange={this.onChangeColor.bind(this)}></input>
                        <pre style={{clear:'both'}}></pre>
                    </form>
                </div>
            </div>
        )
    }
}

export default Settings
