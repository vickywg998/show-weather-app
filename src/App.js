import React, { Component } from "react";
import "./styles/global.scss";
import Skycons from "react-skycons";
import axios from "axios";

const weatherURL = `https://cors-anywhere.herokuapp.com/https://api.darksky.net/forecast/`;
const weatherAPI = "d3135eb8e134061565fcb7fe736dd07e/";
console.log(weatherAPI);

const getLocation = new Promise((resolve, reject) => {
  if (navigator.geolocation) {
    console.log("Location aquired");
    navigator.geolocation.getCurrentPosition(pos => {
      const coords = {
        lat: pos.coords.latitude,
        long: pos.coords.longitude
      };
      resolve(coords);
    });
  } else {
    alert("Sorry, you need to enable location services in your browser");
  }
});

class App extends Component {
  state = {
    loading: true,
    myLocation: null,
    weatherData: null
  };

  componentDidMount() {
    getLocation
      .then(response => {
        console.log(response);
        this.setState({ myLocation: response });
      })
      .then(() => {
        const { lat, long } = this.state.myLocation;
        axios.get(`${weatherURL}${weatherAPI}${lat},${long}`).then(response => {
          console.log(response.data);
          const {
            summary,
            apparentTemperature,
            icon
          } = response.data.currently;
          const { timezone } = response.data;
          this.setState({
            weatherData: response.data,
            summary: summary,
            timezone: timezone,
            apparentTemperature: apparentTemperature,
            icon: icon.toUpperCase(),
            loading: false
          });
        });
      });
  }

  render() {
    return (
      <div className="App">
        <h1>Vicky's Awesome Weather App</h1>
        <h2>Current City: {this.state.timezone}</h2>
        <div>The weather right now is: {this.state.summary}</div>
        <div>{this.state.icon}</div>/<div>{this.state.apparentTemperature}</div>
        <Skycons color="black" icon="CLEAR_NIGHT" autoplay={false} />
      </div>
    );
  }
}

export default App;
