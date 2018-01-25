import React from 'react';
import Card from './Card';
import axios from 'axios';
import KeyValue from './KeyValue';
import Map from './Map';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import { setTimeout } from 'timers';

class Dashboard1 extends React.Component {

  state = {
    loading: false,
    loadingText: 'Getting Data...',
    modalOpen: false,
    connectedCars: [],
    locations: [],
    selectedCar: undefined,
    interval: undefined,
  }

  clearModal = () => {
    this.setState({
      modalOpen: false,
      selectedCar: undefined,
    })
    clearInterval(this.state.interval)
  }

  setCurrentId = (id) => {
    this.setState({
      modalOpen: true, 
      loadingText:'Getting Car Details...',
    });

    axios.get('https://studentxx-connectedcars-simulator.run.aws-usw02-pr.ice.predix.io/cars/simulator')
    .then(cars => {
      let selectedCar = cars.data.filter(car => car.id === id.slice(15).toUpperCase())[0];
      this.setState({
        selectedCar,
        selectedCarId: id,
      })
    })
    .then(()=>{
      this.setState({interval: setInterval(this.getCurrentInfo,2000)})
    })
  }

  getCurrentInfo = () => {
    const id = this.state.selectedCarId;
    axios.get('https://studentxx-connectedcars-simulator.run.aws-usw02-pr.ice.predix.io/cars/simulator')
    .then(cars => {
      let selectedCar = cars.data.filter(car => car.id === id.slice(15).toUpperCase())[0];
      this.setState({selectedCar})
    })
  }

  getData = () => {
    this.setState({
      loading: true,
      loadingText: 'Getting Cars...'
    });
    axios.get('/api/predix-asset/connected_car')
    .then(res => {
      this.setState({
        connectedCars: res.data,
        loadingText: 'Locating Cars...'
      });
      return res.data;
    })
    .then(cars => {
      axios.get('/api/predix-asset/location')
      .then(locations => {
        this.combineResponses(cars, locations.data)
      })
    })
  }

  // getData = () => {
  //   this.setState({
  //     loading: true,
  //     loadingText: 'Getting Cars...'
  //   });
  //   axios.get('/api/predix-asset/connected_car')
  //   .then(res => {
  //     this.setState({connectedCars: res.data});
  //     return res.data;
  //   });
  //   this.setState({loadingText: 'Locating Cars...'});
  //   axios.get('/api/predix-asset/location')
  //   .then(locations => {
  //     this.setState({locations: locations.data})
  //     this.combineResponses(this.state.connectedCars, this.state.locations)
  //   });
  // }

  combineResponses = (cars, locations) => {
    cars.forEach(car => {
      let loc = locations.filter(location => car.location === location.uri);
      this.setState(state => {
        return {
          ...state,
          connectedCars: this.state.connectedCars.map(cc => {
            return cc.uri === car.uri ? {
              ...cc,
              latitude: loc[0].latitude,
              longitude: loc[0].longitude,
              city: loc[0].city,
            } : cc
          })
        }
      })
    });
    this.setState({loading: false})
  }

  render(){
    const { connectedCars, loading, loadingText, selectedCar }  = this.state;
    const actions = [
      <FlatButton
        label='Close'
        primary={true}
        onClick={()=>this.clearModal()}
      />,
    ];
    return (
      <div>
        {/* Context */}
        <div className='flex view-heading'>
          <h1>Predix Example</h1>
        </div>

        <RaisedButton
          className='container'
          label='Get Data'
          onClick={() => this.getData()}/>

        {loading && 
          <div className = 'spinner'>
            <div style={{flex: 1, alignSelf:'center'}}>
              <px-spinner />
              <div>{loadingText}</div>
            </div>
          </div>
        }

        {!loading && 
          <div style={{margin: '1em', height: '70%'}}>
            <Map
              isMarkerShown
              markers = {this.state.connectedCars}
              googleMapURL='https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=geometry,drawing,places'
              selected = {this.setCurrentId}
            />
          </div>
        }
        
        <Dialog
          title={`Car Details`}
          actions={actions}
          modal={false}
          open={this.state.modalOpen}
          onRequestClose={()=>this.clearModal()}>
          {!selectedCar && 
            <div className = 'spinner'>
              <div style={{flex: 1, alignSelf:'center'}}>
                <px-spinner />
                <div>{loadingText}</div>
              </div>
            </div>
          }
          {selectedCar && Object.keys(selectedCar).length !== 0 && 
            <div className='kpi'>
              <px-gauge
                value={selectedCar.speed}
                min='0'
                max='200'
                bar-width='0'
                unit='MPH'
                error='[[0,12],[79,100]]'
                abnormal='[[12,32],[68,79]]'
                anomaly='[[32,45],[54,68]]'
                normal='[[45,54]]'>
              </px-gauge>
                <KeyValue 
                  valueKey='Car Make' 
                  value={selectedCar.name.split(' ')[0]} 
                  size={'gamma'}/>

                <KeyValue 
                  valueKey='Car Model' 
                  value={selectedCar.name.split(' ')[1]} 
                  size={'gamma'}/>

                <KeyValue 
                  valueKey='Engine Temperature' 
                  value={selectedCar.engineTemp} 
                  uom={'F'}
                  size={'gamma'}/>

                <KeyValue 
                valueKey='Odometer' 
                value={selectedCar.odometerReading} 
                uom={'Miles'}
                size={'gamma'}/>

                <KeyValue 
                  valueKey='Gas Cap' 
                  value={selectedCar.parkingBrakeStatus === 1 ? 'Open' : 'Closed'} 
                  size={'gamma'}/>
            </div>
          }
        </Dialog>

      </div> 
    )
  }
}

export default Dashboard1;