import React, { useState } from 'react';
import axios from 'axios'
import './App.css'

const SalesTracker = () => {
  const [contractAddress, setcontractAddress] = useState('');
  const [blockchain, setBlockchain] = useState('eth-main');
  const [collection, setCollection] = useState(null)
  const [error, setError] = useState(false)
  const [loading, setLoading] = useState(false)
  const [hasClicked, setHasClicked] = useState(false)

  const periods = ['one_day', 'seven_day', 'thirty_day', 'total']

  const getCollection = async () => {
    setHasClicked(true)
    setCollection(null)
    setLoading(true)
    const url = `https://api.blockspan.com/v1/collections/contract/${contractAddress}?chain=${blockchain}`;
    const headers = {
      accept: 'application/json',
      'X-API-KEY': 'YOUR_BLOCKSPAN_API_KEY',
    };

    try {
      const response = await axios.get(url, { headers });
      setCollection(response)
      console.log('response:', response)
      setError(null);
      setLoading(false)
    } catch (error) {
      console.error(error);
      setError('No NFTs found on this chain in this contract address!');
      setCollection(null);
      setLoading(false)
    }
  };

  const checkData = (data) => {
    if (data === null || isNaN(data)) {
        return 'N/A'
    } 
    return data
  }

  return (
    <div>
      <h1 className="title">Collection Sales Tracker</h1>
      <p className="message">
          Select a blockchain and input a contract address to see collection sales data.
      </p>
      <div className="inputContainer">
        <select name="blockchain"
          value={blockchain}
          onChange={e => setBlockchain(e.target.value)}>
          <option value="eth-main">eth-main</option>
          <option value="arbitrum-main">arbitrum-main</option>
          <option value="optimism-main">optimism-main</option>
          <option value="poly-main">poly-main</option>
          <option value="bsc-main">bsc-main</option>
          <option value="eth-goerli">eth-goerli</option>
        </select>
        <input type="text" placeholder="Contract Address" onChange={e => setcontractAddress(e.target.value)}/>
        <button onClick={getCollection}>Get Collection</button>
      </div>
      {loading && (
        <p className='message'>Loading...</p>
      )}
      {error && !loading && (
        <p className='errorMessage'>Error: verify chain and contract address are valid</p>
      )}
      {collection && collection.data && collection.data.exchange_data && collection.data.exchange_data[0].stats ? (
        <p style={{ fontWeight: 'bold', textAlign: 'center' }}>
          Floor Price: {checkData(collection.data.exchange_data[0].stats.floor_price)} | 
          Market Cap: {checkData(parseFloat(collection.data.exchange_data[0].stats.market_cap).toFixed(3))}
        </p>
      ) : !error && hasClicked && (
        <p className='message'>No sales data found for this collection!</p>
      )}
      {collection && collection.data && collection.data.exchange_data && (
        <div>
          <table className='tableContainer'>
            <thead>
              <tr style={{ backgroundColor: '#f2f2f2' }}>
                <th>Time Period</th>
                <th>Average Price</th>
                <th>Sales</th>
                <th>Volume</th>
              </tr>
            </thead>
            <tbody>
              {periods.map((period) => ( 
                <tr style={{ backgroundColor: '#f2f2f2' }} key={period}>
                  <td>{period}</td>
                  <td>{checkData(parseFloat(collection.data.exchange_data[0].stats[`${period}_average_price`]).toFixed(5))}</td>
                  <td>{checkData(collection.data.exchange_data[0].stats[`${period}_sales`])}</td>
                  <td>{checkData(parseFloat(collection.data.exchange_data[0].stats[`${period}_volume`]).toFixed(5))}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

export default SalesTracker;
