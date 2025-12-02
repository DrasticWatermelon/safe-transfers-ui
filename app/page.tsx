'use client';

import { useState } from 'react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { SenderView } from '@/components/SenderView';
import { ReceiverView } from '@/components/ReceiverView';
import { useTheme } from '@/contexts/ThemeContext';

export default function Home() {
  const [activeTab, setActiveTab] = useState<'sender' | 'receiver'>('sender');
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 transition-colors">
      <div className="container mx-auto px-4 py-8">
        <header className="mb-12">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white">Safe Transfers</h1>
              <p className="text-gray-600 dark:text-gray-300 mt-2">
                Secure ERC20 token transfers using allowance-based flow
              </p>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={toggleTheme}
                className="p-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                aria-label="Toggle theme"
              >
                {theme === 'light' ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-900" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                )}
              </button>
              <ConnectButton />
            </div>
          </div>
        </header>

        <div className="max-w-4xl mx-auto">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-2 mb-8">
            <div className="flex gap-2">
              <button
                onClick={() => setActiveTab('sender')}
                className={`flex-1 py-3 px-6 rounded-lg font-semibold transition-colors ${
                  activeTab === 'sender'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                I&apos;m Sending
              </button>
              <button
                onClick={() => setActiveTab('receiver')}
                className={`flex-1 py-3 px-6 rounded-lg font-semibold transition-colors ${
                  activeTab === 'receiver'
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                I&apos;m Receiving
              </button>
            </div>
          </div>

          {activeTab === 'sender' ? <SenderView /> : <ReceiverView />}

          <div className="mt-8 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Comparison: Normal vs Approve-Based Transfers</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b-2 border-gray-300 dark:border-gray-600">
                    <th className="text-left py-3 px-4 font-bold text-gray-900 dark:text-white w-2/5">Characteristic</th>
                    <th className="text-center py-3 px-4 font-bold text-gray-900 dark:text-white w-3/10">Normal Transfer</th>
                    <th className="text-center py-3 px-4 font-bold text-gray-900 dark:text-white w-3/10">Approve-Based Transfer</th>
                  </tr>
                </thead>
                <tbody className="text-gray-700 dark:text-gray-300">
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <td className="py-4 px-4">
                      <div className="font-semibold mb-1">Number of transactions required</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">How many blockchain transactions need to be sent for the tokens to move</div>
                    </td>
                    <td className="text-center py-4 px-4">
                      <div className="text-2xl mb-1">1️⃣</div>
                      <div className="text-xs">Single transaction by sender</div>
                    </td>
                    <td className="text-center py-4 px-4">
                      <div className="text-2xl mb-1">2️⃣</div>
                      <div className="text-xs">Approve by sender + claim by receiver</div>
                    </td>
                  </tr>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <td className="py-4 px-4">
                      <div className="font-semibold mb-1">Result of incorrect receiver address</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">What happens if you accidentally enter the wrong wallet address</div>
                    </td>
                    <td className="text-center py-4 px-4">
                      <div className="text-2xl mb-1">❌</div>
                      <div className="text-xs">Tokens sent and lost forever</div>
                    </td>
                    <td className="text-center py-4 px-4">
                      <div className="text-2xl mb-1">✅</div>
                      <div className="text-xs">Claim fails, tokens stay in sender wallet</div>
                    </td>
                  </tr>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <td className="py-4 px-4">
                      <div className="font-semibold mb-1">Need for test transactions</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">Whether you need to send a small amount first to verify the address works</div>
                    </td>
                    <td className="text-center py-4 px-4">
                      <div className="text-2xl mb-1">⚠️</div>
                      <div className="text-xs">Recommended to test with small amount first</div>
                    </td>
                    <td className="text-center py-4 px-4">
                      <div className="text-2xl mb-1">✅</div>
                      <div className="text-xs">Not needed - receiver verifies by claiming</div>
                    </td>
                  </tr>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <td className="py-4 px-4">
                      <div className="font-semibold mb-1">Possibility for remediation</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">Can you fix it if you realize you made a mistake with the address</div>
                    </td>
                    <td className="text-center py-4 px-4">
                      <div className="text-2xl mb-1">❌</div>
                      <div className="text-xs">No way to recover once sent</div>
                    </td>
                    <td className="text-center py-4 px-4">
                      <div className="text-2xl mb-1">✅</div>
                      <div className="text-xs">Revoke approval & create new one anytime</div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
              <p className="text-sm text-gray-700 dark:text-gray-300">
                <strong>💡 Key takeaway:</strong> While approve-based transfers require one extra transaction, they eliminate the risk of losing funds to incorrect addresses.
                The receiver must prove they can access the address by claiming the funds. If they can&apos;t, your tokens stay safe with you.
              </p>
            </div>
          </div>

          <div className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400 space-y-2">
            <p>
              Open source project •{' '}
              <a
                href="https://github.com/DrasticWatermelon/safe-transfers-ui"
                className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
                target="_blank"
                rel="noopener noreferrer"
              >
                View on GitHub
              </a>
            </p>
            <p className="text-gray-700 dark:text-gray-300">
              Made with ❤️ by{' '}
              <a
                href="https://x.com/DrasticWM"
                className="hover:scale-110 inline-block transition-transform"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Follow on Twitter"
              >
                🍉
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
