import { useWriteContract, useReadContract, useAccount, useChainId } from 'wagmi';
import { parseEther, formatEther } from 'viem';
import { getContractAddresses, PREDICTION_MARKET_ABI, BDAG_TOKEN_ABI } from '../contracts/config';

export function usePredictionMarket() {
  const { address } = useAccount();
  const { writeContract } = useWriteContract();
  const chainId = useChainId();

  // Get contract addresses for current chain
  const contractAddresses = getContractAddresses(chainId);
  const PREDICTION_MARKET_ADDRESS = contractAddresses.PREDICTION_MARKET;
  const BDAG_TOKEN_ADDRESS = contractAddresses.BDAG_TOKEN;

  // Get user's BDAG balance
  const { data: bdagBalance } = useReadContract({
    address: BDAG_TOKEN_ADDRESS,
    abi: BDAG_TOKEN_ABI,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
    query: {
      enabled: !!address,
    },
  });

  // Get allowance
  const { data: allowance } = useReadContract({
    address: BDAG_TOKEN_ADDRESS,
    abi: BDAG_TOKEN_ABI,
    functionName: 'allowance',
    args: address ? [address, PREDICTION_MARKET_ADDRESS] : undefined,
    query: {
      enabled: !!address,
    },
  });

  // Helper functions for reading contract data
  const getMarketInfo = (marketId: number) => {
    return useReadContract({
      address: PREDICTION_MARKET_ADDRESS,
      abi: PREDICTION_MARKET_ABI,
      functionName: 'getMarketInfo',
      args: [BigInt(marketId)],
    });
  };

  const getCurrentPrice = (marketId: number, isYes: boolean) => {
    return useReadContract({
      address: PREDICTION_MARKET_ADDRESS,
      abi: PREDICTION_MARKET_ABI,
      functionName: 'getCurrentPrice',
      args: [BigInt(marketId), isYes],
    });
  };

  const getPotentialPayout = (marketId: number) => {
    return useReadContract({
      address: PREDICTION_MARKET_ADDRESS,
      abi: PREDICTION_MARKET_ABI,
      functionName: 'getPotentialPayout',
      args: address ? [BigInt(marketId), address] : undefined,
      query: {
        enabled: !!address,
      },
    });
  };

  // Write functions
  const approve = async (amount: string = '1000000') => {
    return writeContract({
      address: BDAG_TOKEN_ADDRESS,
      abi: BDAG_TOKEN_ABI,
      functionName: 'approve',
      args: [PREDICTION_MARKET_ADDRESS, parseEther(amount)],
    });
  };

  const buyShares = async (marketId: number, isYes: boolean, amount: string) => {
    return writeContract({
      address: PREDICTION_MARKET_ADDRESS,
      abi: PREDICTION_MARKET_ABI,
      functionName: 'buyShares',
      args: [BigInt(marketId), isYes, parseEther(amount)],
    });
  };

  const claimPayout = async (marketId: number) => {
    return writeContract({
      address: PREDICTION_MARKET_ADDRESS,
      abi: PREDICTION_MARKET_ABI,
      functionName: 'claimPayout',
      args: [BigInt(marketId)],
    });
  };

  return {
    bdagBalance: bdagBalance ? formatEther(bdagBalance) : '0',
    allowance: allowance ? formatEther(allowance) : '0',
    approve,
    getMarketInfo,
    getCurrentPrice,
    getPotentialPayout,
    buyShares,
    claimPayout,
    userAddress: address,
  };
}

export function useBuyShares(marketId: number, isYes: boolean, amount: string) {
  const { writeContract, isPending, isSuccess, error } = useWriteContract();
  const chainId = useChainId();

  const contractAddresses = getContractAddresses(chainId);
  const PREDICTION_MARKET_ADDRESS = contractAddresses.PREDICTION_MARKET;

  const buyShares = () => {
    if (!amount || parseFloat(amount) <= 0) return;

    return writeContract({
      address: PREDICTION_MARKET_ADDRESS,
      abi: PREDICTION_MARKET_ABI,
      functionName: 'buyShares',
      args: [BigInt(marketId), isYes, parseEther(amount)],
    });
  };

  return {
    buyShares,
    isLoading: isPending,
    isSuccess,
    error,
  };
}