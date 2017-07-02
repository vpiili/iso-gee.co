import React, { Component } from 'react';
import './App.css';

class Data extends Component {
  constructor(props) {
    super(props);

    this.makeView = this.makeView.bind(this);
  }

  makeView() {
    let alkos = [];
    let quantities = [];
    /*
      let alko = "<li><a target='blank' href='https://www.alko.fi/myymalat-palvelut/ID?referMethod=StoreFinder-List'>ALKO</a></li>";
      let quantity = "<li class='maara' id='maara'>MAARA</li>";
    */
    this.props.data.forEach((index) => {
      alkos.push(<li><a className='alko' href={'https://www.alko.fi/myymalat-palvelut/'+index.id}>{index.alko}</a></li>);
      quantities.push(<li className='quantity'>{index.quantity}</li>);
    })
    return (<div className='dataContainer'><ul className='alko'>{alkos}</ul><ul className='quantity'>{quantities}</ul></div>);
  }

  render() {
    return (
      this.makeView()
    );
  }
}

class App extends Component {
  
  constructor(props) {
    super(props);
    this.state = {
      gambinaData: [],
      alkoApi:"https://cors-anywhere.herokuapp.com/https://www.alko.fi/INTERSHOP/web/WFS/Alko-OnlineShop-Site/fi_FI/-/EUR/ViewProduct-Include?SKU=319027",
      viewableCity:'Turku',
      loadingScreenDisplay:'block'
    }
    

    this.fetchData = this.fetchData.bind(this);
    this.parseData = this.parseData.bind(this);
    this.filterData = this.filterData.bind(this);
    this.search = this.search.bind(this);
    this.setViewableCity = this.setViewableCity.bind(this);

    this.fetchData();

  }

  fetchData() {
    const Entities = require('html-entities').AllHtmlEntities;
    const entities = new Entities();
    fetch(this.state.alkoApi,{redirect:'follow'})
      .then((data) => {return data.text()})
      .then((data) => this.parseData(entities.decode(data)))
      .then((data) => {

        this.setState({
          gambinaData: data,
          loadingScreenDisplay:'none'
        })
      }).catch((error) => {
        console.error(error);
      });
  }

  parseData(data) {
    let id = "";
    let city = "";
    let alko = "";
    let quantity = "";
    let store = [];

    let lista = data.split("relative store-item stockInStore");
    lista.shift();

    for (var i = 0 ; i < lista.length ; i++) {
      id = lista[i].substr(lista[i].indexOf("StoreID=")+8,4);

      alko = lista[i].substring(lista[i].indexOf('Alko ')+5,lista[i].indexOf('</span>'));

      if (alko.indexOf(" ") != -1) city = alko.substring(0,alko.indexOf(" "));
      else city = alko.toString();

      quantity = lista[i].substring(lista[i].indexOf('StoreStock=')+11,lista[i].indexOf('" h'));

      store.push({id:id,city:city,alko:alko,quantity:quantity});
    }

    return store;
  }

  filterData() {
    let store = [];
    this.state.gambinaData.forEach((index) => {
      if (index.city == this.state.viewableCity) store.push(index);
    })
    return store;
  }

  search() {
    let store = [];
    this.state.gambinaData.forEach((index) => {
      if (!store.includes(index.city)) store.push(index.city);
    })
    store = store.map((index) => {
      return <option value={index}>{index}</option>
    })
    return store;
  }

  setViewableCity(event) {
    this.setState(
      {viewableCity:event.target.value}
    );
  }



  render() {
    return (
      <div className='main'>
        <form className='search'>
          <select className='searchMenu' value={this.state.viewableCity} onChange={this.setViewableCity}>{this.search()}</select>
        </form>
        <h2 style={{display:this.state.loadingScreenDisplay}}>Loading data from API...</h2>
        <Data data={this.filterData()} />        
      </div>
    );
  }
}



export default App;
