import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import Web3 from 'web3';
import type { AbiItem } from 'web3-utils';
import type { Contract } from 'web3-eth-contract';
import Ownership from '../contracts/Ownership.json';

declare global {
  interface Window {
    ethereum?: any;
  }
}

interface EthereumContextValue {
  web3: Web3 | null;
  account: string | null;
  isConnected: boolean;
  contract: Contract | null;
  connectWallet: () => Promise<void>;
  uploadMetadata: (fileName: string, fileHash: string) => Promise<void>;
  grantAccess: (fileHash: string, user: string) => Promise<void>;
  revokeAccess: (fileHash: string, user: string) => Promise<void>;
  hasAccess: (fileHash: string, user: string) => Promise<boolean>;
  getMyFilesCount: () => Promise<number>;
  getMyFile: (index: number) => Promise<{ fileName: string; fileHash: string; timestamp: number }>;
  getMyFiles: () => Promise<Array<{ fileName: string; fileHash: string; timestamp: number; txHash?: string }>>;
  hasAccessAsOwner: (owner: string, fileHash: string, user: string) => Promise<boolean>;
  getSharedWithMe: () => Promise<Array<{ owner: string; fileName: string; fileHash: string; timestamp: number; txHash?: string }>>;
  getMyShares: () => Promise<Array<{ user: string; fileName: string; fileHash: string; timestamp: number; txHash?: string }>>;
}

const EthereumContext = createContext<EthereumContextValue | undefined>(undefined);

const resolveContractInfo = async (web3: Web3) => {
  const chainId = await web3.eth.getChainId(); // number
  console.log(`⚙️ Connected to Ganache network (ID: ${chainId})`);

  const abi = (Ownership as any).abi as AbiItem[];
  const networks = (Ownership as any).networks || {};
  const chainIdStr = String(chainId);

  const candidate =
    networks[chainIdStr] ||
    networks['1337'] ||
    networks['5777'] ||
    null;

  if (!candidate?.address) {
    throw new Error(
      `Ownership contract not found in artifact networks for chainId ${chainId}. Please migrate the contract.`
    );
  }

  return { abi, address: candidate.address as string, chainId };
};

export const EthereumProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [web3, setWeb3] = useState<Web3 | null>(null);
  const [account, setAccount] = useState<string | null>(null);
  const [contract, setContract] = useState<Contract | null>(null);
  const [isConnected, setIsConnected] = useState<boolean>(false);

  const connectWallet = useCallback(async () => {
    if (!window.ethereum) {
      throw new Error('MetaMask not found. Please install MetaMask.');
    }
    const provider = window.ethereum;

    // Request account access
    const accounts: string[] = await provider.request({ method: 'eth_requestAccounts' });
    const selected = accounts[0];
    if (!selected) {
      throw new Error('No account available');
    }

    const w3 = new Web3(provider);
    setWeb3(w3);
    setAccount(selected);
    setIsConnected(true);
    console.log(`🔗 MetaMask connected: ${selected}`);

    // Load contract
    const { abi, address } = await resolveContractInfo(w3);
    const instance = new w3.eth.Contract(abi, address);
    setContract(instance);
    console.log(`📜 Contract loaded: ${address}`);
  }, []);

  // Auto-setup listeners when ethereum exists
  useEffect(() => {
    const provider = window.ethereum;
    if (!provider) return;

    const handleAccountsChanged = (accounts: string[]) => {
      const selected = accounts?.[0] || null;
      setAccount(selected);
      setIsConnected(!!selected);
      if (selected) {
        console.log(`🔗 MetaMask connected: ${selected}`);
      }
    };

    const handleChainChanged = () => {
      // Reload to pick up the new network/contract
      window.location.reload();
    };

    provider.on('accountsChanged', handleAccountsChanged);
    provider.on('chainChanged', handleChainChanged);

    return () => {
      if (!provider.removeListener) return;
      provider.removeListener('accountsChanged', handleAccountsChanged);
      provider.removeListener('chainChanged', handleChainChanged);
    };
  }, []);

  const uploadMetadata = useCallback(
    async (fileName: string, fileHash: string) => {
      if (!web3 || !account || !contract) throw new Error('Ethereum not initialized');
      await contract.methods.uploadFile(fileName, fileHash).send({ from: account });
    },
    [web3, account, contract]
  );

  const grantAccess = useCallback(
    async (fileHash: string, user: string) => {
      if (!web3 || !account || !contract) throw new Error('Ethereum not initialized');
      await contract.methods.grantAccess(fileHash, user).send({ from: account });
    },
    [web3, account, contract]
  );

  const revokeAccess = useCallback(
    async (fileHash: string, user: string) => {
      if (!web3 || !account || !contract) throw new Error('Ethereum not initialized');
      await contract.methods.revokeAccess(fileHash, user).send({ from: account });
    },
    [web3, account, contract]
  );

  const hasAccess = useCallback(
    async (fileHash: string, user: string): Promise<boolean> => {
      if (!web3 || !account || !contract) throw new Error('Ethereum not initialized');
      // Call from the owner context (current account) as required by the contract
      const allowed: boolean = await contract.methods.hasAccess(fileHash, user).call({ from: account });
      return allowed;
    },
    [web3, account, contract]
  );

  const getMyFilesCount = useCallback(async (): Promise<number> => {
    if (!web3 || !account || !contract) throw new Error('Ethereum not initialized');
    const countStr: string = await contract.methods.getMyFilesCount().call({ from: account });
    return Number(countStr);
  }, [web3, account, contract]);

  const getMyFile = useCallback(async (index: number): Promise<{ fileName: string; fileHash: string; timestamp: number }> => {
    if (!web3 || !account || !contract) throw new Error('Ethereum not initialized');
    const res: any = await contract.methods.getFile(index).call({ from: account });
    const fileName: string = res[0] ?? res.fileName;
    const fileHash: string = res[1] ?? res.fileHash;
    const timestampRaw: any = res[2] ?? res.timestamp;
    const timestamp = typeof timestampRaw === 'string' ? Number(timestampRaw) : Number(timestampRaw);
    return { fileName, fileHash, timestamp };
  }, [web3, account, contract]);

  const getMyFiles = useCallback(async (): Promise<Array<{ fileName: string; fileHash: string; timestamp: number; txHash?: string }>> => {
    if (!web3 || !account || !contract) throw new Error('Ethereum not initialized');
    const n = await getMyFilesCount();
    const items: Array<{ fileName: string; fileHash: string; timestamp: number; txHash?: string }> = [];
    // map topic -> txHash from FileUploaded events for this owner
    const uploaded = await contract.getPastEvents('FileUploaded', { filter: { owner: account }, fromBlock: 0, toBlock: 'latest' });
    const txByTopic = new Map<string, string>();
    for (const ev of uploaded) {
      const fh = (ev.returnValues as any).fileHash as string;
      const hashKey = fh.toLowerCase();
      const topic = web3.utils.keccak256(fh).toLowerCase();
      const txh = (ev as any).transactionHash as string;
      txByTopic.set(hashKey, txh);
      txByTopic.set(topic, txh);
    }
    for (let i = 0; i < n; i++) {
      // eslint-disable-next-line no-await-in-loop
      const item = await getMyFile(i);
      const topic = web3.utils.keccak256(item.fileHash).toLowerCase();
      const txHash = txByTopic.get(topic);
      items.push({ ...item, txHash });
    }
    return items;
  }, [web3, account, contract, getMyFilesCount, getMyFile]);

  const value = useMemo<EthereumContextValue>(
    () => ({
      web3,
      account,
      isConnected,
      contract,
      connectWallet,
      uploadMetadata,
      grantAccess,
      revokeAccess,
      hasAccess,
      getMyFilesCount,
      getMyFile,
      getMyFiles,
      hasAccessAsOwner: async (owner: string, fileHash: string, user: string) => {
        if (!web3 || !contract) throw new Error('Ethereum not initialized');
        const allowed: boolean = await contract.methods.hasAccess(fileHash, user).call({ from: owner });
        return allowed;
      },
      getSharedWithMe: async () => {
        if (!web3 || !account || !contract) throw new Error('Ethereum not initialized');
        // Use event reductions (grants - revokes) to determine current access, no eth_call 'from' tricks.
        const [grants, revokes] = await Promise.all([
          contract.getPastEvents('AccessGranted', { filter: { user: account }, fromBlock: 0, toBlock: 'latest' }),
          contract.getPastEvents('AccessRevoked', { filter: { user: account }, fromBlock: 0, toBlock: 'latest' })
        ]);

        type Key = string;
        // fileHash in these events is indexed string (topic hash). We'll keep the topic and tx hash of the last grant.
        type Ev = { key: Key; owner: string; fileHashTopic: string; kind: 'grant' | 'revoke'; blockNumber: number; logIndex: number; txHash?: string };
        const all: Ev[] = [];
        for (const g of grants) {
          const owner = (g.returnValues as any).owner as string;
          const fileHashTopic = (g.returnValues as any).fileHash as string;
          all.push({ key: `${owner}|${fileHashTopic}`.toLowerCase(), owner, fileHashTopic, kind: 'grant', blockNumber: g.blockNumber!, logIndex: g.logIndex!, txHash: (g as any).transactionHash });
        }
        for (const r of revokes) {
          const owner = (r.returnValues as any).owner as string;
          const fileHashTopic = (r.returnValues as any).fileHash as string;
          all.push({ key: `${owner}|${fileHashTopic}`.toLowerCase(), owner, fileHashTopic, kind: 'revoke', blockNumber: r.blockNumber!, logIndex: r.logIndex! });
        }
        all.sort((a, b) => (a.blockNumber - b.blockNumber) || (a.logIndex - b.logIndex));
        const state = new Map<Key, Ev>();
        for (const e of all) state.set(e.key, e);

        const current = Array.from(state.values()).filter((e) => e.kind === 'grant');
        if (current.length === 0) return [];

        // Build metadata by calling owner's view methods (sets msg.sender=owner via eth_call)
        const owners = Array.from(new Set(current.map((e) => e.owner)));
        const metaMap = new Map<string, { fileName: string; timestamp: number; fileHash: string; txHash?: string }>();
        for (const owner of owners) {
          // tx map for this owner
          const uploaded = await contract.getPastEvents('FileUploaded', { filter: { owner }, fromBlock: 0, toBlock: 'latest' });
          const txByTopic = new Map<string, string>();
          for (const ev of uploaded) {
            const fh = (ev.returnValues as any).fileHash as string;
            const rawKey = fh.toLowerCase();
            const topic = web3.utils.keccak256(fh).toLowerCase();
            const txh = (ev as any).transactionHash as string;
            txByTopic.set(rawKey, txh);
            txByTopic.set(topic, txh);
          }
          const countStr: string = await contract.methods.getMyFilesCount().call({ from: owner });
          const count = Number(countStr) || 0;
          for (let i = 0; i < count; i++) {
            // eslint-disable-next-line no-await-in-loop
            const res: any = await contract.methods.getFile(i).call({ from: owner });
            const fileName: string = res[0] ?? res.fileName;
            const fileHash: string = res[1] ?? res.fileHash;
            const tsRaw: any = res[2] ?? res.timestamp;
            const timestamp = typeof tsRaw === 'string' ? Number(tsRaw) : Number(tsRaw);
            const topic = web3.utils.keccak256(fileHash);
            const txHash = txByTopic.get(topic.toLowerCase());
            metaMap.set(`${owner}|${topic}`.toLowerCase(), { fileName, timestamp, fileHash, txHash });
          }
        }

        return current.map(({ owner, fileHashTopic, txHash }) => {
          const meta = metaMap.get(`${owner}|${fileHashTopic}`.toLowerCase()) || { fileName: '', timestamp: 0, fileHash: '', txHash: undefined } as any;
          return { owner, fileName: meta.fileName, fileHash: meta.fileHash, timestamp: meta.timestamp, txHash: txHash || meta.txHash };
        });
      },
      getMyShares: async () => {
        if (!web3 || !account || !contract) throw new Error('Ethereum not initialized');

        const [grants, revokes] = await Promise.all([
          contract.getPastEvents('AccessGranted', { filter: { owner: account }, fromBlock: 0, toBlock: 'latest' }),
          contract.getPastEvents('AccessRevoked', { filter: { owner: account }, fromBlock: 0, toBlock: 'latest' })
        ]);

        type Key = string;
        type Ev = { key: Key; fileHashTopic: string; user: string; kind: 'grant' | 'revoke'; blockNumber: number; logIndex: number };
        const all: Ev[] = [];
        for (const g of grants) {
          const fileHashTopic = (g.returnValues as any).fileHash as string;
          const user = (g.returnValues as any).user as string;
          all.push({ key: `${fileHashTopic}|${user}`.toLowerCase(), fileHashTopic, user, kind: 'grant', blockNumber: g.blockNumber!, logIndex: g.logIndex! });
        }
        for (const r of revokes) {
          const fileHashTopic = (r.returnValues as any).fileHash as string;
          const user = (r.returnValues as any).user as string;
          all.push({ key: `${fileHashTopic}|${user}`.toLowerCase(), fileHashTopic, user, kind: 'revoke', blockNumber: r.blockNumber!, logIndex: r.logIndex! });
        }
        all.sort((a, b) => (a.blockNumber - b.blockNumber) || (a.logIndex - b.logIndex));

        const state = new Map<Key, Ev>();
        for (const e of all) state.set(e.key, e);

        // Build list of currently granted users per fileHash
        const current: Array<{ fileHashTopic: string; user: string }> = [];
        for (const e of state.values()) {
          if (e.kind !== 'grant') continue;
          current.push({ fileHashTopic: e.fileHashTopic, user: e.user });
        }
        if (current.length === 0) return [];

        // Map file meta by fileHash topic using direct owner reads
        const metaByTopic = new Map<string, { fileName: string; timestamp: number; fileHash: string; txHash?: string }>();
        const uploaded = await contract.getPastEvents('FileUploaded', { filter: { owner: account }, fromBlock: 0, toBlock: 'latest' });
        const txByTopic = new Map<string, string>();
        for (const ev of uploaded) {
          const fh = (ev.returnValues as any).fileHash as string;
          const rawKey = fh.toLowerCase();
          const topic = web3.utils.keccak256(fh).toLowerCase();
          const txh = (ev as any).transactionHash as string;
          txByTopic.set(rawKey, txh);
          txByTopic.set(topic, txh);
        }
        const countStr: string = await contract.methods.getMyFilesCount().call({ from: account });
        const count = Number(countStr) || 0;
        for (let i = 0; i < count; i++) {
          // eslint-disable-next-line no-await-in-loop
          const res: any = await contract.methods.getFile(i).call({ from: account });
          const fileName: string = res[0] ?? res.fileName;
          const fileHash: string = res[1] ?? res.fileHash;
          const tsRaw: any = res[2] ?? res.timestamp;
          const timestamp = typeof tsRaw === 'string' ? Number(tsRaw) : Number(tsRaw);
          const topic = web3.utils.keccak256(fileHash);
          const txHash = txByTopic.get(topic.toLowerCase());
          metaByTopic.set(topic.toLowerCase(), { fileName, timestamp, fileHash, txHash });
        }

        return current.map(({ fileHashTopic, user }) => {
          const meta = metaByTopic.get(fileHashTopic.toLowerCase()) || { fileName: '', timestamp: 0, fileHash: '', txHash: undefined } as any;
          return { user, fileName: meta.fileName, fileHash: meta.fileHash, timestamp: meta.timestamp, txHash: meta.txHash };
        });
      }
    }),
    [web3, account, isConnected, contract, connectWallet, uploadMetadata, grantAccess, revokeAccess, hasAccess, getMyFilesCount, getMyFile, getMyFiles]
  );

  return <EthereumContext.Provider value={value}>{children}</EthereumContext.Provider>;
};

export const useEthereum = (): EthereumContextValue => {
  const ctx = useContext(EthereumContext);
  if (!ctx) {
    throw new Error('useEthereum must be used within EthereumProvider');
  }
  return ctx;
};
