import React, { Component } from 'react';
import DataTable from './components/DataTable.js';
import Select from './components/Select.js';
import './App.css';



class App extends Component {
  
  constructor(props) {
    super(props);
    this.state = {
      gambinaData: [],
      viewableCity:'Turku',
    }
    

    this.fetchData = this.fetchData.bind(this);
    this.parseData = this.parseData.bind(this);
    this.filterData = this.filterData.bind(this);
    this.search = this.search.bind(this);
    this.setViewableCity = this.setViewableCity.bind(this);

    this.fetchData();

  }

  fetchData() {
    const url = "https://cors-anywhere.herokuapp.com/https://www.alko.fi/INTERSHOP/web/WFS/Alko-OnlineShop-Site/fi_FI/-/EUR/ViewProduct-Include?SKU=319027";
    const Entities = require('html-entities').AllHtmlEntities;
    const entities = new Entities();
    fetch(url, {redirect:'follow'})
      .then((data) => {return data.text()})
      .then((data) => this.parseData(entities.decode(data)))
      .then((data) => {

        this.setState({
          gambinaData: data,
        })
      }).catch((error) => {
        console.error(error);
      });
  }

  parseData(data) {
    let id,city,alko,quantity;
    let store = [];

    let lista = data.split("relative store-item stockInStore");
    lista.shift();

    for (var i = 0 ; i < lista.length ; i++) {
      id = lista[i].substr(lista[i].indexOf("StoreID=")+8,4);

      alko = lista[i].substring(lista[i].indexOf('Alko ')+5,lista[i].indexOf('</span>'));

      if (alko.indexOf(" ") !== -1) city = alko.substring(0,alko.indexOf(" "));
      else city = alko.toString();

      quantity = lista[i].substring(lista[i].indexOf('StoreStock=')+11,lista[i].indexOf('" h'));

      store.push({id:id,city:city,alko:alko,quantity:quantity});
    }

    return store;
  }

  filterData() {
    let store = [];
    this.state.gambinaData.forEach((index) => {
      if (index.city === this.state.viewableCity) store.push(index);
    })
    return store;
  }

  search() {
    let store = [];
    this.state.gambinaData.forEach((index) => {
      if (!store.includes(index.city)) store.push(index.city);
    })
    return store;
  }

  setViewableCity(event) {
    console.log(event);
    this.setState(
      {viewableCity:event.target.value}
    );
  }

  render() {
    return (
      (this.state.gambinaData.length > 0) ? 
        <div className='main'>
          <Select cities={this.search()} current={this.state.viewableCity} onChange={this.setViewableCity} />
          <DataTable data={this.filterData()} />
        </div>
      :
        <h3>Loading data from API...</h3>            
    );
  }
}



export default App;
