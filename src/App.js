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
    weatherData: null,
    showCelsius: false
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
            icon: icon.toUpperCase().replace(/-/g, "_"),
            loading: false
          });
        });
      });
  }
  handleToggleVisibility = event => {
    event.preventDefault();
    this.setState(prevState => {
      return {
        showCelsius: !prevState.showCelsius
      };
    });
  };

  setCelcius = () => {
    var cel = ((this.state.apparentTemperature - 32) * 5) / 9;
    return cel + "° C";
  };

  render() {
    const styles = {
      width: "50%",
      height: "50%"
    };
    console.log(this.state.icon);
    return (
      <div className="bg__container">
        <div className="weather__container">
          <div className="weather__wrapper">
            <h1>Weather App</h1>
            <Skycons
              color="black"
              icon={this.state.icon}
              autoplay={false}
              style={styles}
            />
            <h2>Current City: {this.state.timezone}</h2>
            <div className="weather__summary--padding">The weather right now is: {this.state.summary}</div>

            <div>
              {this.state.showCelsius && (
                <div>
                 <p>Celcius= {this.setCelcius(this.state.apparentTemperature)}</p>
                </div>
              )}
              {!this.state.showCelsius && (
                <div>
                  <p>Fahrenheit={this.state.apparentTemperature}° F</p>
                </div>
              )}
            </div>
            <button
              onClick={this.handleToggleVisibility}
              className="toggle__button--style"
            >
              {this.state.showCelsius === true
                ? "There you go non-Americans!"
                : "Change to Celsius"}
            </button>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
