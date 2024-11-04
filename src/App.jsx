import { useState, useRef } from 'react'
import './App.css'
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { http, createConfig, WagmiProvider, useConnect, useAccount, useBalance, useDisconnect, useEnsAvatar, useEnsName, useSendTransaction } from 'wagmi'
import { mainnet, base } from 'wagmi/chains'
import { injected } from 'wagmi/connectors'
import { parseEther } from 'viem'


const queryclient = new QueryClient();

export const config = createConfig({
  chains: [mainnet, base],
  connectors: [
    injected()
  ],
  transports: {
    [mainnet.id]: http()
  },
})

function App() {

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryclient}>
        <WalletConnector />
        <EthSend />
        <Account />
        <SendTransaction />
      </ QueryClientProvider>
    </WagmiProvider>
  )
}

function WalletConnector() {
  const { connectors, connect } = useConnect();
  return (
    <div className='flex justify-center my-10 space-x-2'>
      <span className="space-x-2 mt-1">Wallet:</span>
      {connectors.map((connector) => (
        <Button key={connector.uid} onClick={() => connect({ connector })}>
          {connector.name}
        </Button>
      ))}
    </div>
  )
}

function EthSend() {
  return (
    <div className='flex flex-col justify-center items-center  gap-y-2'>
      <Input className="w-[15rem]" type="text" placeholder="Address"></Input>
      <Button className="w-[7rem]">Send 0.1 ETH</Button>
    </div>
  )
}

export function Account() {
  const { address } = useAccount()
  const { disconnect } = useDisconnect()

  const balance = useBalance({
    address
  })
  return (
    <div className="flex flex-col items-center justify-center space-y-2 mt-5 max-sm:text-sm">

      {address && <div>
        Your address - {address} <br />
        Your balance - {balance.data?.formatted}
      </div>}

      <Button onClick={() => disconnect()}>Disconnect</Button>
    </div>
  )
}

export function SendTransaction() {
  const { data: hash, sendTransaction } = useSendTransaction()
  const toRef = useRef(null);
  const valueRef = useRef(null);

  async function sendTx() {
    const to = toRef.current.value;
    const value = valueRef.current.value;
    sendTransaction({ to, 
    value: parseEther(value) });
  }

  return (
    <div className='flex flex-col items-center justify-center space-y-2 mt-5'>
      <Input className="w-[15rem]" ref={toRef} placeholder="0xA0Cf…251e" required />
      <Input className="w-[15rem]" ref={valueRef} placeholder="0.05" required />
      <Button className="w-[7rem]" onClick={sendTx}>Send</Button>
      {hash && <div>Transaction Hash: {hash}</div>}
    </div>
  )
}

export default App
