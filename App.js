import React, {Component} from 'react';
import {
  StyleSheet,
  Text,
  View,
  ListView,
  TouchableHighlight,
  Alert,
  NavigatorIOS,
  Button
} from 'react-native';
import {StackNavigator} from 'react-navigation';
import Swipeout from 'react-native-swipeout';
import Icon from 'react-native-vector-icons/Ionicons';

import MapView from 'react-native-maps';

function randomColor() {
  return `#${Math.floor(Math.random() * 16777215).toString(16)}`;
}

export class listViewMovie extends Component {


  static navigationOptions = ({ navigation, screenProps}) => ({
    title: 'Home',
    headerRight: <Button
        title="Add"
        color="red"
        onPress={() => navigation.navigate("AddMovie")} />
  });

  constructor(){
    super();

    let ds = new ListView.DataSource({rowHasChanged: (r1,r2)=> r1 != r2 });

    this.state = {
      dataSource: ds.cloneWithRows([])
    }


  }

  componentDidMount(){
    let titles = [];
    fetch('https://facebook.github.io/react-native/movies.json')
    .then((rep) => { return rep.json()})
    .then((repJson) => {
      let movies = repJson.movies;
      for (let i = 0; i < movies.length; i++) {
        titles.push(movies[i].title);
      }
      this.setState({
        dataSource: this.state.dataSource.cloneWithRows(titles)
      })
    })
  }

  clicked(){
    this.setState({
      status: !this.state.status
    })
  }

  render() {
    return (
      <View style={styles.container}>
        <ListView
          enableEmptySections={true}
          dataSource={this.state.dataSource}
          renderRow={this.renderRow.bind(this)}
        />

      </View>
    );
  }

  pressCell(dataRow) {
    this.props.navigation.navigate('Details',{details: {data:dataRow,name: "GIL"}});
  }

  renderRow(dataRow){

    // Buttons
    let swBtnRight = [
      {
        component: (<Icon name="md-create" size={30} color="white" style={styles.btnIcons}/>),
        backgroundColor: 'orange',
        onPress: () => { this.pressCell(dataRow) }
      }
    ]

    let swBtnLeft = [
      {
        component: (<Icon name="ios-trash-outline" size={30} color="white" style={styles.btnIcons} />),
        backgroundColor: "red",
        onPress: () => { this.pressCell(dataRow) }
      }
    ]
    return (
      <Swipeout right={swBtnRight} left={swBtnLeft} autoClose={true} backgroundColor="white" buttonWidth={54}>
        <TouchableHighlight onPress={ ()=> this.pressCell(dataRow)}>
            <View style={styles.cell}>
              <Text>{dataRow}</Text>
            </View>
        </TouchableHighlight>
      </Swipeout>
    )
  }
}

export class newView extends Component{
  static navigationOptions = ({ navigation, screenProps }) => ({
    title: `Details ${navigation.state.params.details.data}`,
    headerRight: <Button title="Edit" onPress={() => navigation.navigate("EditDetails")}/>
  });

  constructor() {
    super();
    this.state = {
      stateNav: {},
      markers:[],
      initialRegion: {
        latitude: 10.9838942,
        longitude: -74.8531227,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      }
    }
  }

  componentWillMount(){
    let listRestaurant = []
    fetch('https://maps.googleapis.com/maps/api/place/nearbysearch/json?key=AIzaSyBVcy4mmskrCYjV6lWuoX8sG4YTZo9lFQI&location=11.0101667,-74.8117972&radius=500&type=restaurant')
    .then((res) => { return res.json() })
    .then((resJson) => {
      let restaurants = resJson.results;
      console.log(restaurants);
      for (let index = 0; index < restaurants.length; index++) {

        let obj = {
          latlng: { latitude: restaurants[index].geometry.location.lat, longitude: restaurants[index].geometry.location.lng },
          title: restaurants[index].name,
          description: restaurants[index].vicinity,
          color: 'yellow'
        }

        listRestaurant.push(obj);
      }
      this.setState({ markers: listRestaurant})

    })

    this.watchId = navigator.geolocation.getCurrentPosition(
      (position) => {
            this.setState({
              initialRegion:{
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421
              }
            });
            let myPos = {
              latlng: { latitude: position.coords.latitude, longitude: position.coords.longitude },
              title: "Me",
              color: "#029e74"
            }
            listRestaurant.push(myPos);
          },
          (error) => this.setState({ error: error.message }),
          { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 },
    );

    this.setState({
      stateNav: this.props.navigation.state
    });

  }

  componentWillUnmount() {
      navigator.geolocation.clearWatch(this.watchId);
  }

  render(){
    return(
      <View style={styles.containerDetails}>
        <Text>{this.state.stateNav.params.details.data}</Text>
        <Text>{this.state.stateNav.params.details.name}</Text>
        <MapView
          style={styles.map}
          initialRegion={this.state.initialRegion}
        >
          {this.state.markers.map((marker,key) => (
            <MapView.Marker
              key={key}
              coordinate={marker.latlng}
              title={marker.title}
              description={marker.description}
              pinColor={marker.color}
            />
          ))}
        </MapView>
      </View>
    )
  }
}

export class addMovie extends Component{
  render(){
    return(
      <Text>addMovie</Text>
    )
  }
}

export class editDetails extends Component {
  render() {
    return (
      <Text>HOLA MUNDO</Text>
    )
  }
}

const styles = StyleSheet.create({
  containerDetails:{
    flex: 1
  },
  cell:{
    borderBottomWidth: 1,
    borderBottomColor: 'grey',
    paddingTop: 20,
    paddingBottom: 20,
    alignItems: 'center'
  },
  container: {
    flex: 1,
    backgroundColor: 'white'
  },
  text:{
    color: "white"
  },
  on:{
    width: 100,
    height: 100,
    backgroundColor: "yellow"
  },
  off:{
    width: 100,
    height: 100,
    backgroundColor: "black"
  },
  btnIcons:{
    textAlign: 'center',
    paddingTop: 15
  },
  map:{
    width: "100%",
    height: 450
  }
});


const RootNavigator = StackNavigator({
  Home: { screen: listViewMovie },
  AddMovie: { screen: addMovie },
  Details: { screen: newView },
  EditDetails: { screen: editDetails },
})

export default RootNavigator;
