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
    let swipeoutBtns = [
      {
        component: (<Icon name="md-create" size={30} color="white" style={styles.btnIcons}/>),
        backgroundColor: 'orange',
        onPress: () => { this.pressCell(dataRow) }
      },
      {
        component: (<Icon name="ios-trash-outline" size={30} color="white" style={styles.btnIcons} />),
        backgroundColor: "red",
        onPress: () => { this.pressCell(dataRow) }
      }

    ]
    return (
      <Swipeout right={swipeoutBtns} autoClose={true} backgroundColor="white"> 
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
  render(){
    const {state} = this.props.navigation;
    return(
      <View style={styles.containerDetails}>
        <Text>{state.params.details.data}</Text>
        <Text>{state.params.details.name}</Text>
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
  actionButtonIcon: {
    fontSize: 20,
    height: 22,
    color: 'white',
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
    paddingTop: 10
  }
});


const RootNavigator = StackNavigator({
  Home: { screen: listViewMovie },
  AddMovie: { screen: addMovie },
  Details: { screen: newView },
  EditDetails: { screen: editDetails },
})

export default RootNavigator;