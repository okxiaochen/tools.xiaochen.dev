import { Metadata } from 'next';
import TextDiff from './TextDiff';

export const metadata: Metadata = {
  title: 'Text Diff — Developer Tools',
  description: 'Compare two blocks of text side by side and highlight the differences. Runs entirely in your browser.',
};

export default function TextDiffPage() {
  return <TextDiff />;
}
