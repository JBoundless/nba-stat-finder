import React, {Component} from 'react';
import axios from "axios";
import "./style.css";

class App extends Component {
  constructor(props){
    super(props)
    this.state={
      playerName: null,
      playerStats: {}
    }
  }

handleSubmit = (e) => {
  e.preventDefault();
  this.getPlayerId()
  console.log(this.state.playerName)
}

handleChange = (event) => {
  const replace = event.target.value.split(" ").join("_");
  if(replace.length > 0){
    this.setState({playerName: replace})
  } else {
    alert("Please type players name!")
  }
}

  getPlayerId = () => {
    axios.get(`https://www.balldontlie.io/api/v1/players?search=${this.state.playerName}`)
    .then(async res => {
      // console.log(res.data.data)
      if(res.data.data[0] === undefined){
        alert("This player is either injured or hasn't played yet!")
      } else if(res.data.data.length > 1){
        alert("Pleases specify the name more!")
      } else{
        await this.getPlayerStats(res.data.data[0].id)

      }
    }).catch(err => {
      console.log(err)
    })
  }

  getPlayerStats = (playerId) => {
    axios.get(`https://www.balldontlie.io/api/v1/season_averages?season=2020&player_ids[]=${playerId}`)
    .then(async res => {
      console.log(res.data.data)
      this.setState({ playerStats: res.data.data[0]})
    }).catch(err => {
      console.log(err)
    })
  }
  
  render(){
  return (
    <div className="App">
    <h1>NBA Stat Finder</h1>
    <p>Search for a player's stats from the 2020-21 season.</p>
     <form onSubmit={this.handleSubmit} style={{backgroundColor: "blue", color: "white", padding: "15px"}}>
       <label>
         Name
         <input 
          type="text"
          value={this.state.value}
          onChange={this.handleChange}
          placeholder="please enter players name"
         />
       </label>
       <input type="submit" value="Submit"/>
     </form>
     <div style={{textAlign: "center", backgroundColor: "#d3d3d3", color: "blue"}}>
     <h2>Games Played: {this.state.playerStats["games_played"]}</h2>
     <br />
     <h3>PPG: {this.state.playerStats["pts"]}</h3>
     <br />
     <h3>RPG: {this.state.playerStats["reb"]}</h3>
     <br />
     <h3>APG: {this.state.playerStats["ast"]}</h3>
     </div>
    </div>
  );
}
}
export default App;