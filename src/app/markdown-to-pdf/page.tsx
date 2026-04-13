import { Metadata } from 'next';
import MarkdownToPdf from './MarkdownToPdf';

export const metadata: Metadata = {
  title: 'Markdown to PDF — Developer Tools',
  description: 'Convert Markdown to PDF with syntax highlighting and print-optimized styling.',
};

export default function MarkdownToPdfPage() {
  return <MarkdownToPdf />;
}
