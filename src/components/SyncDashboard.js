import React from 'react';
import Card from './Card';
import axios from 'axios';
// import 'bootstrap/dist/css/bootstrap.css';

class SyncDashboard extends React.Component {

  state = {
    loading: false,
    loadingText: '',
    data: [],
    gotData: false
  }

  getData = () => {
    this.setState({
      loading: true,
      loadingText: 'Getting Asset Data',
    });
    axios.get('/api/datagrid/asset/compressor-2017')
    .then(res => {
      return res.data.tableData;
    })
    .then((res) => {
      axios.get('/mock-api/datagrid/group/plant-richmond-refinery')
      .then(response => {
        response.data.tableData.forEach(val => {
          console.log(res)
          res.forEach(dat => {
            if(dat.tag === val.tag){
              dat.asset = val.asset;
            }
          })
        }); //forEach close

        this.setState({data: res})

        this.setState({
          loading: false,
          gotData: true
        })
      })
    })
  }

  render(){
    const { loading, loadingText, data, gotData } = this.state;
    return (
      <div>

        <div className='flex view-heading container'>
          <px-key-value-pair value='Predix Synchronous Example' size='gamma'/>
        </div>

        <div className='description container'>
          <p>
            Click on the button below to get asset data. The application fetches data from different REST endpoints, combines them, and displays in the table.
          </p>
          <p>
            Since the second is depends on the first one, we have to make them synchronous.
          </p>
        </div>

        <button
          style={{color: 'black', margin: '0em 0em 2em 3em'}}
          onClick={() => this.getData()}>
          Get Asset Data
        </button>

        {loading && 
          <div className = 'center'>
            <px-spinner />
            <div>{loadingText}</div>
          </div>
        }
        {!loading && gotData &&
          <Card 
            icon={'linode'} 
            headerText={'Asset Status'}
            background={'#ebeff2'}>
            <px-data-table
              table-data={`${JSON.stringify(data)}`}
              language="en"
              show-column-chooser>
              <px-data-table-column
              name='first'
              sortable
              editable
              filterable>
              </px-data-table-column>
            </px-data-table>
          </Card>
        }
      </div> 
    )
  }
}

export default SyncDashboard;