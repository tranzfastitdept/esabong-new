import React from 'react';
import Link from 'next/link';
import { ShieldCheck, HelpCircle, Scale, Mail, FileText, Phone } from 'lucide-react';

export default function SupportPage() {
  const faqs = [
    {
      q: 'Why is the platform operating in Demo / Non-Wagering Mode?',
      a: 'The system has been architected under strict regulatory compliance. Until applicable statutory amusement and gaming authorization is independently verified by licensed authorities, all wagering, deposits, cashouts, and real GCash monetary settlements remain completely disabled.',
    },
    {
      q: 'Can demonstration credits be converted into Philippine Pesos (PHP)?',
      a: 'No. All virtual demonstration credits are non-transferable, non-cashable, and non-redeemable. They are provided solely for user interface evaluation and system load testing.',
    },
    {
      q: 'How does the LiveKit multi-camera broadcasting work?',
      a: 'The game operator uses LiveKit WebRTC low-latency streaming to switch between connected arena webcams (Main Octagon, Pit Angle, Wide Arena) with sub-second latency and zero viewer buffering.',
    },
    {
      q: 'How are match outcomes verified?',
      a: 'Match outcomes require a dual-operator protocol: the active pit operator submits a proposed result, and an authorized senior reviewer verifies and confirms the result before it is permanently committed to the database ledger.',
    },
    {
      q: 'How can I test the Operator or Owner interfaces?',
      a: 'Use the quick role switcher in the top navigation menu or the Login page to switch between Bettor (Carlos Reyes), Operator (Juan Del Rosario), and Owner (Maria Santos).',
    },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 w-full flex-1 space-y-8">
      <div className="border-b border-neutral-800 pb-6">
        <div className="text-xs font-mono text-neutral-400">HELP &amp; GOVERNANCE</div>
        <h1 className="text-2xl font-bold text-white tracking-tight">Support &amp; Compliance Center</h1>
        <p className="text-xs text-neutral-400 mt-1">
          Regulatory documentation, platform policies, and frequently asked questions.
        </p>
      </div>

      {/* Compliance Statement Box */}
      <div className="p-5 rounded-lg bg-neutral-900 border border-neutral-800 space-y-3">
        <div className="flex items-center gap-2 text-sm font-bold text-white">
          <Scale className="w-4 h-4 text-amber-400" />
          <span>Statutory Compliance Policy</span>
        </div>
        <p className="text-xs text-neutral-400 leading-relaxed">
          Sabong System Console is engineered with strict server-enforced authorization gates. An administrative compliance module continuously audits deployment parameters. No setting controlled solely by a client flag or environment toggle can unlock real-money transactions.
        </p>
      </div>

      {/* FAQs */}
      <div className="space-y-4">
        <h2 className="text-base font-bold text-white flex items-center gap-2">
          <HelpCircle className="w-4 h-4 text-neutral-400" />
          <span>Frequently Asked Questions</span>
        </h2>

        <div className="space-y-3">
          {faqs.map((faq, idx) => (
            <div key={idx} className="p-4 rounded-lg bg-neutral-900 border border-neutral-800 space-y-1.5">
              <div className="text-xs font-bold text-white">{faq.q}</div>
              <p className="text-xs text-neutral-400 leading-relaxed">{faq.a}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Contact & Technical Desk */}
      <div className="p-5 rounded-lg bg-neutral-900 border border-neutral-800 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
        <div>
          <span className="text-neutral-500 block mb-1">Architecture &amp; IT Support:</span>
          <span className="text-white font-mono">itdepttranzfast@gmail.com</span>
        </div>
        <div>
          <span className="text-neutral-500 block mb-1">LiveKit WebRTC Reference:</span>
          <a
            href="https://docs.livekit.io/"
            target="_blank"
            rel="noreferrer"
            className="text-red-400 hover:underline font-mono"
          >
            https://docs.livekit.io/
          </a>
        </div>
      </div>
    </div>
  );
}
