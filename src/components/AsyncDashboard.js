import React from 'react';
import Card from './Card';
import axios from 'axios';
import KeyValue from './KeyValue';
import Map from './Map';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import { setTimeout } from 'timers';

class AsyncDashboard extends React.Component {

  state = {
    loading: false,
    loadingText: 'Getting Data...',
    modalOpen: false,
    connectedCars: [],
    selectedCar: {}
  }

  // input = (data) => {
  //   console.log("uploading")
  //   this.setState({uploadingFile: true})
  //   var formData = new FormData();
  //   formData.append('file', data[0], data[0].name);
  //   axios.post('https://blobstore-predix-studio.run.aws-usw02-pr.ice.predix.io/v1/blob', formData)
  //   .then(response => {
  //     this.setState({
  //       uploadingFile: false,
  //     });
  //   })
  //   .catch(err => {
  //     this.setState({uploadingFile: false,})
  //     console.log("ERROR")
  //   });
  // }

  selectedCar = (id) => {
    this.setState({modalOpen: true})
    let selectedCar = this.state.connectedCars.filter(car => car.uri === id)[0];
    this.setState({selectedCar})
  }

  getData = () => {
    this.setState({loading: true});
    axios.get('/api/predix-asset/connected_car')
    .then(res => {
      this.setState({connectedCars: res.data});
      return res.data;
    })
    .then(cars => {
      axios.get('/api/predix-asset/location')
      .then(locations => {
        this.combineResponses(cars, locations.data)
      })
    })
  }

  combineResponses = (cars, locations) => {
    cars.forEach(car => {
      let loc = locations.filter(location => car.location === location.uri)
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
        label="Close"
        primary={true}
        onClick={()=>this.setState({modalOpen: false})}
      />,
    ];
    return (
      <div>
        {/* Context */}
        <div className='flex view-heading container'>
          <px-key-value-pair value='Predix Asynchronous Example' size='gamma'/>
        </div>
        <div className='description container'>
          <p>
            Try uploading a file to the Blobstore. If the upload is succesful, the dashboard will show additional KPIs.
          </p>
          <p>
            The KPIs do NOT depend on the blobstore. Make them async.
          </p>
        </div>

        <button
          className='container'
          style={{color: 'black', marginBottom: '2em'}}
          onClick={() => this.getData()}>
          Get KPIs
        </button>

        {loading && 
          <div className = 'spinner'>
            <px-overlay>
            <px-spinner />
            <div>{loadingText}</div>
            </px-overlay>
          </div>
        }

        {!loading && 
          <div style={{margin: '1em', height: '75%'}}>
            <Map
              isMarkerShown
              markers = {this.state.connectedCars}
              googleMapURL="https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=geometry,drawing,places"
              selected = {this.selectedCar}
            />
          </div>
        }
        
        <Dialog
          title={`Car Details: ${selectedCar.make} ${selectedCar.model}`}
          actions={actions}
          modal={false}
          open={this.state.modalOpen && Object.keys(selectedCar).length !== 0}
          onRequestClose={()=>this.setState({modalOpen: false})}>
          <div className='kpi flex'>
            <px-gauge
              value="30"
              min="0"
              max="100"
              bar-width="0"
              unit="unit"
              error='[[0,12],[79,100]]'
              abnormal='[[12,32],[68,79]]'
              anomaly='[[32,45],[54,68]]'
              normal='[[45,54]]'>
            </px-gauge>
            <div>
              <KeyValue valueKey="Customer" value={10} size={'alpha'}/>
            </div>
          </div>
        </Dialog>

      </div> 
    )
  }
}

export default AsyncDashboard;