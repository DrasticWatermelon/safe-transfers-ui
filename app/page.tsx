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
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Why is this safer?</h3>
            <div className="space-y-3 text-sm text-gray-700 dark:text-gray-300">
              <div className="flex gap-3">
                <span className="text-blue-600 font-bold">1.</span>
                <p>
                  <strong>Traditional transfer:</strong> If you send tokens to the wrong address by mistake,
                  they&apos;re gone forever. No way to recover them ☠️
                </p>
              </div>
              <div className="flex gap-3">
                <span className="text-blue-600 font-bold">2.</span>
                <p>
                  <strong>Allowance-based transfer:</strong> You grant permission for the receiver
                  to pull funds from your wallet. If you enter the wrong address, the pull transaction will fail
                  and no harm is done 😁
                </p>
              </div>
              <div className="flex gap-3">
                <span className="text-blue-600 font-bold">3.</span>
                <p>
                  <strong>Recovery:</strong> If the receiver can&apos;t pull the funds, you know
                  you made a mistake. Simply revoke the allowance (by approving 0) and grant it to the
                  correct address 🩹
                </p>
              </div>
            </div>
          </div>

          <div className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400 space-y-2">
            <p>
              Open source project •{' '}
              <a
                href="https://github.com"
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
