import { jsPDF } from 'jspdf';
import { FactCheckResult } from '../types';

export function exportAnalysisToPdf(result: FactCheckResult): void {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 16;
  const contentWidth = pageWidth - margin * 2;
  let y = 18;

  const checkPageBreak = (neededHeight: number) => {
    if (y + neededHeight > 280) {
      doc.addPage();
      y = 18;
    }
  };

  // Header Banner
  doc.setFillColor(99, 102, 241); // #6366f1 Brand Primary
  doc.rect(margin, y, contentWidth, 22, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.text('TruthLens AI — Fact-Check Report', margin + 6, y + 10);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.text('Verify before you believe  |  BTech CSE Project Report', margin + 6, y + 16);

  const dateStr = new Date(result.timestamp).toLocaleString();
  doc.setFontSize(8);
  doc.text(`Report ID: ${result.id}`, pageWidth - margin - 6, y + 10, { align: 'right' });
  doc.text(`Generated: ${dateStr}`, pageWidth - margin - 6, y + 16, { align: 'right' });

  y += 28;

  // Claim Analyzed Box
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(margin, y, contentWidth, 24, 2, 2, 'FD');

  doc.setTextColor(100, 116, 139);
  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.text('ANALYZED CLAIM / HEADLINE', margin + 4, y + 6);

  doc.setTextColor(15, 23, 42);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  const claimLines = doc.splitTextToSize(`"${result.inputClaim}"`, contentWidth - 8);
  doc.text(claimLines, margin + 4, y + 13);

  y += 28 + (claimLines.length > 2 ? (claimLines.length - 2) * 5 : 0);

  // Verdict & Confidence Summary
  checkPageBreak(30);

  let verdictColor = [16, 185, 129]; // Emerald
  if (result.verdict === 'Potentially Misleading') verdictColor = [245, 158, 11]; // Amber
  else if (result.verdict === 'Likely False') verdictColor = [239, 68, 68]; // Red
  else if (result.verdict === 'Requires Verification') verdictColor = [59, 130, 246]; // Blue

  doc.setFillColor(verdictColor[0], verdictColor[1], verdictColor[2]);
  doc.roundedRect(margin, y, 90, 18, 2, 2, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.text('FINAL VERDICT', margin + 5, y + 5);
  doc.setFontSize(12);
  doc.text(result.verdict.toUpperCase(), margin + 5, y + 13);

  // Confidence & Risk
  doc.setFillColor(241, 245, 249);
  doc.roundedRect(margin + 94, y, contentWidth - 94, 18, 2, 2, 'F');
  doc.setTextColor(15, 23, 42);
  doc.setFontSize(8);
  doc.text('AI CONFIDENCE', margin + 98, y + 5);
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text(`${result.confidence}%`, margin + 98, y + 13);

  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.text(`Risk: ${result.riskLevel} | Clickbait: ${result.clickbait.risk}`, margin + 130, y + 13);

  y += 24;

  // Executive Summary
  checkPageBreak(35);
  doc.setTextColor(99, 102, 241);
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text('Executive Summary', margin, y);
  y += 5;

  doc.setTextColor(51, 65, 85);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  const summaryLines = doc.splitTextToSize(result.summary, contentWidth);
  doc.text(summaryLines, margin, y);
  y += summaryLines.length * 4.5 + 4;

  // Detailed AI Reasoning
  checkPageBreak(35);
  doc.setTextColor(99, 102, 241);
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text('Detailed AI Reasoning & Linguistic Analysis', margin, y);
  y += 5;

  doc.setTextColor(51, 65, 85);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  const detailLines = doc.splitTextToSize(result.detailedExplanation, contentWidth);
  doc.text(detailLines, margin, y);
  y += detailLines.length * 4.5 + 4;

  // Subclaim Breakdown
  if (result.claimsBreakdown && result.claimsBreakdown.length > 0) {
    checkPageBreak(40);
    doc.setTextColor(99, 102, 241);
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text('Claim-by-Claim Breakdown', margin, y);
    y += 5;

    result.claimsBreakdown.forEach((sub, idx) => {
      checkPageBreak(25);
      doc.setFillColor(248, 250, 252);
      doc.roundedRect(margin, y, contentWidth, 18, 2, 2, 'F');
      doc.setTextColor(15, 23, 42);
      doc.setFontSize(8);
      doc.setFont('helvetica', 'bold');
      doc.text(`Claim ${idx + 1}: ${sub.verdict} (${sub.confidence}% Conf)`, margin + 4, y + 5);

      doc.setFontSize(8);
      doc.setFont('helvetica', 'normal');
      const scText = doc.splitTextToSize(sub.claim, contentWidth - 8);
      doc.text(scText, margin + 4, y + 10);
      y += 20;
    });
  }

  // Sources Checked
  if (result.sources && result.sources.length > 0) {
    checkPageBreak(45);
    doc.setTextColor(99, 102, 241);
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text(`Sources Checked & Cross-Referenced (${result.sources.length})`, margin, y);
    y += 5;

    result.sources.forEach(src => {
      checkPageBreak(20);
      doc.setTextColor(15, 23, 42);
      doc.setFontSize(8);
      doc.setFont('helvetica', 'bold');
      doc.text(`• ${src.name} [${src.category}] — Reliability: ${src.reliabilityScore}%`, margin + 2, y);
      y += 4;
      doc.setTextColor(100, 116, 139);
      doc.setFontSize(7.5);
      doc.setFont('helvetica', 'normal');
      const snippet = doc.splitTextToSize(`"${src.snippet}"`, contentWidth - 6);
      doc.text(snippet, margin + 5, y);
      y += snippet.length * 3.5 + 3;
    });
  }

  // Mandatory Disclaimer
  checkPageBreak(25);
  y += 4;
  doc.setDrawColor(203, 213, 225);
  doc.line(margin, y, pageWidth - margin, y);
  y += 5;
  doc.setTextColor(100, 116, 139);
  doc.setFontSize(7.5);
  doc.setFont('helvetica', 'italic');
  const disclaimerLines = doc.splitTextToSize(result.disclaimer, contentWidth);
  doc.text(disclaimerLines, margin, y);

  doc.save(`TruthLens_Report_${result.id}.pdf`);
}
