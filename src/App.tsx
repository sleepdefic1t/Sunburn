import * as React from 'react'
import './App.css'
import { useState, useEffect } from 'react';

import fetch from 'cross-fetch';
import { ethers, BigNumber } from "ethers";

import logo from "./logo.png";

export default function App() {
  const apiBlockchain: string = "https://sxp.mainnet.sh/api/blockchain";
  const [height, setHeight] = useState("");
  const [burned, setBurned] = useState("");
  const [supply, setSupply] = useState("");

  useEffect(() => {
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

    getInfo();
  }, [setHeight, setSupply, setBurned]);

  return (
    <main>
      <span className="logo">
        <img src={logo} width="300px" alt="solar logo" />
      </span><br />
      <span className="totals"><b>Block Height:</b> {height}</span><br />
      <span className="totals"><b>Total Supply:</b> {supply}</span><br />
      <span className="totals"><b>Total Burned:</b> {burned}</span>
    </main>
  )
}
