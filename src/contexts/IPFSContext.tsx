import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { create, IPFSHTTPClient } from 'ipfs-http-client';

type UploadFn = (file: File) => Promise<string>;
type DownloadFn = (cid: string) => Promise<Blob>;
type PeerInfo = { id: string; address: string };
type ListPeersFn = () => Promise<PeerInfo[]>;
type GetPeerIdFn = () => Promise<string>;
type ConnectPeerFn = (multiaddr: string) => Promise<void>;

interface IPFSContextValue {
  isLoading: boolean;
  error: string | null;
  uploadFile: UploadFn;
  downloadFile: DownloadFn;
  listPeers: ListPeersFn;
  getPeerId: GetPeerIdFn;
  connectPeer: ConnectPeerFn;
}

const IPFSContext = createContext<IPFSContextValue | undefined>(undefined);

export const IPFSProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [ipfs, setIpfs] = useState<IPFSHTTPClient | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Initialize IPFS HTTP client
  useEffect(() => {
    let mounted = true;

    const init = async () => {
      try {
        // Connect to local IPFS Kubo API
        const client = create({ url: 'http://127.0.0.1:5001/api/v0' });
        // Validate connection
        await client.id();
        if (!mounted) return;
        setIpfs(client);
        console.log('✅ Connected to IPFS node');
      } catch (e: any) {
        console.error('Failed to connect to IPFS:', e);
        if (mounted) setError('Failed to connect to local IPFS API at http://127.0.0.1:5001/api/v0');
      }
    };

    init();
    return () => {
      mounted = false;
    };
  }, []);

  const uploadFile: UploadFn = async (file: File) => {
    if (!ipfs) throw new Error('IPFS client not ready');
    setIsLoading(true);
    setError(null);
    try {
      const added = await ipfs.add(file, { wrapWithDirectory: false, pin: true });
      const cid = added.cid.toString();
      console.log(`📂 File uploaded with CID: ${cid}`);
      return cid;
    } catch (e: any) {
      console.error('IPFS upload failed:', e);
      setError(e?.message || 'Upload failed');
      throw e;
    } finally {
      setIsLoading(false);
    }
  };

  const downloadFile: DownloadFn = async (cid: string) => {
    if (!ipfs) throw new Error('IPFS client not ready');
    setIsLoading(true);
    setError(null);
    try {
      const chunks: Uint8Array[] = [];
      for await (const chunk of ipfs.cat(cid)) {
        chunks.push(chunk);
      }
      return new Blob(chunks);
    } catch (e: any) {
      console.error('IPFS download failed:', e);
      setError(e?.message || 'Download failed');
      throw e;
    } finally {
      setIsLoading(false);
    }
  };

  const listPeers: ListPeersFn = async () => {
    if (!ipfs) throw new Error('IPFS client not ready');
    try {
      // @ts-expect-error: type from ipfs-http-client can vary across versions
      const peers = await ipfs.swarm.peers();
      const normalized = (Array.isArray(peers) ? peers : peers?.Peers || peers?.peers || []) as any[];
      const list: PeerInfo[] = normalized.map((p: any) => {
        const id = p?.peer?.toString?.() || p?.Peer?.toString?.() || p?.id?.toString?.() || '';
        const addr = p?.addr?.toString?.() || p?.Addr?.toString?.() || '';
        return {
          id: id || addr || 'unknown',
          address: addr || id || 'unknown'
        };
      });
      console.log(`🌐 Connected peers: ${list.length}`, list);
      return list;
    } catch (e: any) {
      console.error('Failed to list peers:', e);
      setError(e?.message || 'List peers failed');
      throw e;
    }
  };

  const getPeerId: GetPeerIdFn = async () => {
    if (!ipfs) throw new Error('IPFS client not ready');
    try {
      const info = await ipfs.id();
      const id = (info as any)?.id?.toString?.() || (info as any)?.ID || '';
      return id;
    } catch (e: any) {
      console.error('Failed to get peer id:', e);
      setError(e?.message || 'Get peer id failed');
      throw e;
    }
  };

  const connectPeer: ConnectPeerFn = async (multiaddr: string) => {
    if (!ipfs) throw new Error('IPFS client not ready');
    try {
      // @ts-expect-error: type compatibility across versions
      await ipfs.swarm.connect(multiaddr);
      console.log(`🔗 Connected to peer: ${multiaddr}`);
    } catch (e: any) {
      console.error('Failed to connect peer:', e);
      setError(e?.message || 'Connect peer failed');
      throw e;
    }
  };

  const value = useMemo<IPFSContextValue>(
    () => ({
      isLoading,
      error,
      uploadFile,
      downloadFile,
      listPeers,
      getPeerId,
      connectPeer
    }),
    [isLoading, error, ipfs]
  );

  return <IPFSContext.Provider value={value}>{children}</IPFSContext.Provider>;
};

export const useIPFS = (): IPFSContextValue => {
  const ctx = useContext(IPFSContext);
  if (!ctx) {
    throw new Error('useIPFS must be used within IPFSProvider');
  }
  return ctx;
};
