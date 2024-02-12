import React, { Component } from 'react';

import { useParams } from 'react-router-dom';

function withParams(Component) {
  return props => <Component {...props} params={useParams()} />;
}

class JewelryForm extends Component {

  render() {
    
    const { id } = this.props.params; // Az URL-ből származó ID
    const gemId = id; 

    return (
      <div id="content" className='pt-5'>
        <h1>Add jewelry</h1>
        <form onSubmit={(event) => {
          event.preventDefault()
          const name = this.name.value
          const price = window.web3.utils.toWei(this.price.value.toString(), 'Ether')
          const depth = this.depth.value
          const height = this.height.value
          const width = this.width.value
          const metal = this.metal.value
          const date = this.date.value
          const size = this.size.value
          this.props.jewelryMaking(name, gemId, metal, depth, height, width, size, date, false, price);

         }}>
          <div className="form-group mr-sm-2">
            <input
              id="name"
              type="text"
              ref={(input) => { this.name = input }}
              className="form-control"
              placeholder="name"
              required />
          </div>
          <div className="form-group mr-sm-2">
            <input
              id="price"
              type="text"
              ref={(input) => { this.price = input }}
              className="form-control"
              placeholder="Price"
              required />
          </div>
          <div className="form-group mr-sm-2">
            <input
              id="depth"
              type="text"
              ref={(input) => { this.depth = input }}
              className="form-control"
              placeholder="depth"
              required />
          </div>
          <div className="form-group mr-sm-2">
            <input
              id="height"
              type="text"
              ref={(input) => { this.height = input }}
              className="form-control"
              placeholder="height"
              required />
          </div>
          <div className="form-group mr-sm-2">
            <input
              id="width"
              type="text"
              ref={(input) => { this.width = input }}
              className="form-control"
              placeholder="width"
              required />
          </div>
          <div className="form-group mr-sm-2">
            <input
              id="size"
              type="text"
              ref={(input) => { this.size = input }}
              className="form-control"
              placeholder="size"
              required />
          </div>
          <div className="form-group mr-sm-2">
            <input
              id="date"
              type="text"
              ref={(input) => { this.date = input }}
              className="form-control"
              placeholder="date"
              required />
          </div>
          <div className="form-group mr-sm-2">
            <input
              id="metal"
              type="text"
              ref={(input) => { this.metal = input }}
              className="form-control"
              placeholder="metal"
              required />
          </div>
       
       

          <button type="submit" className="btn btn-primary">Make jewelry</button>
        </form>
       
      </div>
    );
  }
}

export default withParams(JewelryForm);
