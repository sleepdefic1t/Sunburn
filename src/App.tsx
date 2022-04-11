import * as React from 'react'
import './App.css'
import { useState, useEffect } from 'react';

// TODO: Use Solar packages
import fetch from 'cross-fetch';
import { ethers, BigNumber } from "ethers";

export default function App() {

  const apiBlockchain: string = "https://sxp.mainnet.sh/api/blockchain";
  const [height, setHeight] = useState("");
  const [burned, setBurned] = useState("");
  const [supply, setSupply] = useState("");

  // TODO: Use Solar packages
  const getInfo = async () => {
    try {
      const response = await fetch(apiBlockchain);

      if (response.status >= 400) {
        throw new Error("Bad response from server");
      }

      const result = await response.json();

      const heightStr: string = result.data.block.height;
      setHeight(ethers.utils.commify(heightStr));

      const totalSupply: BigNumber = BigNumber.from(result.data.supply);
      const supplyStr: string = String(ethers.utils.formatUnits(totalSupply, 8));
      setSupply(ethers.utils.commify(supplyStr));

      const totalBurned: BigNumber = BigNumber.from(result.data.burned.total);
      const burnStr: string = ethers.utils.formatUnits(totalBurned, 8);
      setBurned(ethers.utils.commify(burnStr));
    } catch (err) {
      console.error(err);
    }
  }
 
  // Timer (getInfo at page load and every 8 seconds)
  const [count, setCount] = useState(0);

  useEffect(() => {
    const update = async () => {
      try {
        await getInfo();
        const timer: ReturnType<typeof setInterval> = setInterval(async () => {
          await getInfo();
          setCount(prevCount => prevCount + 1);
        }, 8000);

        return () => clearInterval(timer);
      } catch (error) {
        console.error(error);
      }
    }

    update();
  }, [setCount]);

  return (
    <main>
      <span className="logo">
        <img src="https://gateway.pinata.cloud/ipfs/QmPQbgNq8vdxpbacYpqFRFvapCdhXMcYwRP3qEFqinyn6z" width="300px" alt="solar logo" />
      </span><br />
      <span className="totals"><b>Block Height:</b> {height}</span><br />
      <span className="totals"><b>Total Supply:</b> {supply}</span><br />
      <span className="totals"><b>Total Burned:</b> {burned}</span><br />
      <span className="footer">
        dreamed by <a href="https://delegates.solar.org/sxp/delegates/sl33p" target="_blank" rel="noopener noreferrer">₴Ⱡ33₱</a> | 🔌 by <a href="https://solar.org" target="_blank" rel="noopener noreferrer">Solar</a>
      </span>
    </main>
  )
}
