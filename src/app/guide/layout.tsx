import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'User Guide - CodeUtilsHub',
  description: 'Complete guide to using CodeUtilsHub platform features, from browsing utilities to contributing code.',
  keywords: ['user guide', 'documentation', 'tutorial', 'how to use', 'CodeUtilsHub'],
};

export default function GuideLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
