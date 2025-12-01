'use client';

import { useState, useEffect } from 'react';
import { useAccount, useWriteContract, useWaitForTransactionReceipt, useReadContract } from 'wagmi';
import { parseUnits, Address, isAddress } from 'viem';
import { erc20Abi } from 'viem';

export function SenderView() {
  const { address, isConnected } = useAccount();
  const [tokenAddress, setTokenAddress] = useState('');
  const [receiverAddress, setReceiverAddress] = useState('');
  const [amount, setAmount] = useState('');
  const [decimals, setDecimals] = useState('18');
  const [isLoadingDecimals, setIsLoadingDecimals] = useState(false);
  const [decimalsError, setDecimalsError] = useState(false);

  const { data: tokenDecimals, isError, isLoading } = useReadContract({
    address: tokenAddress && isAddress(tokenAddress) ? (tokenAddress as Address) : undefined,
    abi: erc20Abi,
    functionName: 'decimals',
    query: {
      enabled: tokenAddress !== '' && isAddress(tokenAddress),
      retry: 2,
      retryDelay: 1000,
    },
  });

  useEffect(() => {
    if (tokenDecimals !== undefined) {
      setDecimals(tokenDecimals.toString());
      setIsLoadingDecimals(false);
      setDecimalsError(false);
    }
  }, [tokenDecimals]);

  useEffect(() => {
    if (isError) {
      setIsLoadingDecimals(false);
      setDecimalsError(true);
      setDecimals('18'); // Reset to default
    }
  }, [isError]);

  useEffect(() => {
    if (!isLoadingDecimals) return;

    // Set timeout for 5 seconds
    const timeoutId = setTimeout(() => {
      if (isLoadingDecimals && !tokenDecimals) {
        setIsLoadingDecimals(false);
        setDecimalsError(true);
        setDecimals('18'); // Reset to default
      }
    }, 5000);

    return () => clearTimeout(timeoutId);
  }, [isLoadingDecimals, tokenDecimals]);

  const handleTokenAddressChange = (value: string) => {
    setTokenAddress(value);
    setDecimalsError(false);
    if (value && isAddress(value)) {
      setIsLoadingDecimals(true);
    } else {
      setIsLoadingDecimals(false);
    }
  };

  const { data: hash, isPending, writeContract } = useWriteContract();

  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({
      hash,
    });

  const handleApprove = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!tokenAddress || !receiverAddress || !amount) {
      alert('Please fill in all fields');
      return;
    }

    try {
      const amountInWei = parseUnits(amount, parseInt(decimals));

      writeContract({
        address: tokenAddress as Address,
        abi: erc20Abi,
        functionName: 'approve',
        args: [receiverAddress as Address, amountInWei],
      });
    } catch (error) {
      console.error('Error approving:', error);
      alert('Error approving tokens. Check console for details.');
    }
  };

  if (!isConnected) {
    return (
      <div className="text-center p-8 bg-gray-50 dark:bg-gray-800 rounded-lg">
        <p className="text-gray-600 dark:text-gray-300">Please connect your wallet to continue</p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">Grant Allowance (Sender)</h2>

      <form onSubmit={handleApprove} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Token Contract Address
          </label>
          <input
            type="text"
            value={tokenAddress}
            onChange={(e) => handleTokenAddressChange(e.target.value)}
            placeholder="0x..."
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-white dark:bg-gray-700"
          />
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
            The ERC20 token you want to transfer
            {isLoadingDecimals && <span className="text-blue-600 dark:text-blue-400 ml-2">Detecting decimals...</span>}
            {decimalsError && <span className="text-red-600 dark:text-red-400 ml-2">Failed to detect decimals. Using default (18).</span>}
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Receiver Address
          </label>
          <input
            type="text"
            value={receiverAddress}
            onChange={(e) => setReceiverAddress(e.target.value)}
            placeholder="0x..."
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-white dark:bg-gray-700"
          />
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
            Double-check this address! The receiver will pull funds from you.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Amount
            </label>
            <input
              type="text"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="1000"
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-white dark:bg-gray-700"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Decimals
            </label>
            <input
              type="text"
              value={decimals}
              onChange={(e) => setDecimals(e.target.value)}
              placeholder="18"
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-white dark:bg-gray-700"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={isPending || isConfirming}
          className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
        >
          {isPending ? 'Confirming...' : isConfirming ? 'Waiting for confirmation...' : 'Approve Allowance'}
        </button>
      </form>

      {hash && (
        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <p className="text-sm font-medium text-blue-900">Transaction Hash:</p>
          <p className="text-xs text-blue-700 break-all mt-1">{hash}</p>
        </div>
      )}

      {isConfirmed && (
        <div className="mt-4 p-4 bg-green-50 rounded-lg">
          <p className="text-sm font-medium text-green-900">
            ✓ Allowance granted successfully!
          </p>
          <p className="text-xs text-green-700 mt-1">
            The receiver can now pull the funds. If you made a mistake with the address,
            you can revoke by approving 0 tokens to that address.
          </p>
        </div>
      )}

      <div className="mt-6 p-4 bg-yellow-50 border-l-4 border-yellow-400">
        <h3 className="text-sm font-semibold text-yellow-900 mb-2">How it works:</h3>
        <ol className="text-xs text-yellow-800 space-y-1 list-decimal list-inside">
          <li>You grant an allowance to the receiver&apos;s address</li>
          <li>The receiver pulls the funds using transferFrom</li>
          <li>If you entered the wrong address, likely no one controls that address so you'll keep your tokens</li>
          <li>You can then revoke the allowance and grant it to the correct address</li>
        </ol>
      </div>
    </div>
  );
}
