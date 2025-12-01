'use client';

import { useState, useEffect } from 'react';
import { useAccount, useWriteContract, useWaitForTransactionReceipt, useReadContract } from 'wagmi';
import { parseUnits, Address, isAddress, formatUnits } from 'viem';
import { erc20Abi } from 'viem';

export function ReceiverView() {
  const { address, isConnected } = useAccount();
  const [tokenAddress, setTokenAddress] = useState('');
  const [senderAddress, setSenderAddress] = useState('');
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

  // Check allowance
  const { data: allowanceData, isLoading: isLoadingAllowance, refetch: refetchAllowance } = useReadContract({
    address: tokenAddress && isAddress(tokenAddress) ? (tokenAddress as Address) : undefined,
    abi: erc20Abi,
    functionName: 'allowance',
    args: [
      senderAddress && isAddress(senderAddress) ? (senderAddress as Address) : '0x0000000000000000000000000000000000000000',
      address || '0x0000000000000000000000000000000000000000'
    ],
    query: {
      enabled: tokenAddress !== '' && isAddress(tokenAddress) && senderAddress !== '' && isAddress(senderAddress) && !!address,
    },
  });

  const allowance = allowanceData ? allowanceData : BigInt(0);
  const hasAllowance = allowance > BigInt(0);

  const { data: hash, isPending, writeContract } = useWriteContract();

  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({
      hash,
    });

  const handleTransferFrom = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!tokenAddress || !senderAddress || !amount || !address) {
      alert('Please fill in all fields');
      return;
    }

    if (!hasAllowance) {
      alert('No allowance found. The sender has not granted you an allowance yet.');
      return;
    }

    try {
      const amountInWei = parseUnits(amount, parseInt(decimals));

      if (amountInWei > allowance) {
        alert(`Insufficient allowance. You can only pull up to ${formatUnits(allowance, parseInt(decimals))} tokens.`);
        return;
      }

      writeContract({
        address: tokenAddress as Address,
        abi: erc20Abi,
        functionName: 'transferFrom',
        args: [senderAddress as Address, address, amountInWei],
      });
    } catch (error) {
      console.error('Error transferring:', error);
      alert('Error transferring tokens. Check console for details.');
    }
  };

  const handleCheckAllowance = () => {
    refetchAllowance();
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
      <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">Pull Funds (Receiver)</h2>

      <form onSubmit={handleTransferFrom} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Token Contract Address
          </label>
          <input
            type="text"
            value={tokenAddress}
            onChange={(e) => handleTokenAddressChange(e.target.value)}
            placeholder="0x..."
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900 dark:text-white dark:bg-gray-700"
          />
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
            The ERC20 token to receive
            {isLoadingDecimals && <span className="text-green-600 dark:text-green-400 ml-2">Detecting decimals...</span>}
            {decimalsError && <span className="text-red-600 dark:text-red-400 ml-2">Failed to detect decimals. Using default (18).</span>}
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Sender Address
          </label>
          <input
            type="text"
            value={senderAddress}
            onChange={(e) => setSenderAddress(e.target.value)}
            placeholder="0x..."
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900 dark:text-white dark:bg-gray-700"
          />
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
            The address that granted you the allowance
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
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900 dark:text-white dark:bg-gray-700"
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
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900 dark:text-white dark:bg-gray-700"
            />
          </div>
        </div>

        <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
          <p className="text-sm text-gray-700 dark:text-gray-300">
            <span className="font-medium">Your address:</span>{' '}
            <span className="text-xs break-all">{address}</span>
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Funds will be transferred to this address
          </p>
        </div>

        {/* Allowance Check Section */}
        {tokenAddress && isAddress(tokenAddress) && senderAddress && isAddress(senderAddress) && (
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 p-4 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-semibold text-blue-900 dark:text-blue-300">Allowance Status</h3>
              <button
                type="button"
                onClick={handleCheckAllowance}
                disabled={isLoadingAllowance}
                className="text-xs bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 disabled:bg-gray-400 transition-colors"
              >
                {isLoadingAllowance ? 'Checking...' : 'Refresh'}
              </button>
            </div>

            {isLoadingAllowance ? (
              <p className="text-sm text-blue-700 dark:text-blue-300">Checking allowance...</p>
            ) : hasAllowance ? (
              <div>
                <p className="text-sm text-green-700 dark:text-green-400 font-medium">
                  ✓ Allowance Found: {formatUnits(allowance, parseInt(decimals))} tokens
                </p>
                <p className="text-xs text-blue-700 dark:text-blue-300 mt-1">
                  You can pull up to this amount from the sender.
                </p>
              </div>
            ) : (
              <div>
                <p className="text-sm text-red-700 dark:text-red-400 font-medium">
                  ✗ No allowance found
                </p>
                <p className="text-xs text-red-600 dark:text-red-400 mt-1">
                  The sender has not granted you an allowance yet, or you entered the wrong addresses.
                </p>
              </div>
            )}
          </div>
        )}

        <button
          type="submit"
          disabled={isPending || isConfirming || !hasAllowance}
          className="w-full bg-green-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
        >
          {isPending ? 'Confirming...' : isConfirming ? 'Waiting for confirmation...' : 'Pull Funds'}
        </button>

        {!hasAllowance && tokenAddress && senderAddress && (
          <p className="text-xs text-center text-red-600 dark:text-red-400">
            Button disabled: No allowance found. Check allowance status above.
          </p>
        )}
      </form>

      {hash && (
        <div className="mt-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
          <p className="text-sm font-medium text-green-900 dark:text-green-300">Transaction Hash:</p>
          <p className="text-xs text-green-700 dark:text-green-400 break-all mt-1">{hash}</p>
        </div>
      )}

      {isConfirmed && (
        <div className="mt-4 p-4 bg-green-100 dark:bg-green-900/30 border border-green-200 dark:border-green-800 rounded-lg">
          <p className="text-sm font-medium text-green-900 dark:text-green-300">
            ✓ Funds received successfully!
          </p>
        </div>
      )}

      <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-400 dark:border-blue-600">
        <h3 className="text-sm font-semibold text-blue-900 dark:text-blue-300 mb-2">Safety Note:</h3>
        <p className="text-xs text-blue-800 dark:text-blue-300">
          If the sender made a mistake with your address, this tool will detect that you do not have an allowance and disallow you from sending a transaction which is known to fail. 
          The sender can then correct their mistake and grant the allowance to your actual address.
        </p>
      </div>
    </div>
  );
}
