import React, { useState } from 'react';
import { Download, FileText, Image, FileJson, Loader2 } from 'lucide-react';
import { LifeDestinyResult } from '../types';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

interface ExportButtonProps {
  result: LifeDestinyResult;
  userName?: string;
}

const ExportButton: React.FC<ExportButtonProps> = ({ result, userName }) => {
  const [isExporting, setIsExporting] = useState<string | null>(null);

  const exportJSON = () => {
    setIsExporting('json');
    try {
      const dataStr = JSON.stringify(result, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${userName || '命盘分析'}_${new Date().getTime()}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('导出 JSON 失败:', error);
      alert('导出 JSON 失败，请重试');
    } finally {
      setIsExporting(null);
    }
  };

  const exportImage = async () => {
    setIsExporting('image');
    try {
      const chartElement = document.querySelector('[data-export-chart]');
      const analysisElement = document.querySelector('[data-export-analysis]');

      if (!chartElement || !analysisElement) {
        alert('未找到要导出的内容');
        setIsExporting(null);
        return;
      }

      // 导出图表
      const chartCanvas = await html2canvas(chartElement as HTMLElement, {
        backgroundColor: '#ffffff',
        scale: 2,
      });

      // 导出分析结果
      const analysisCanvas = await html2canvas(analysisElement as HTMLElement, {
        backgroundColor: '#ffffff',
        scale: 2,
      });

      // 合并两个 canvas
      const mergedCanvas = document.createElement('canvas');
      mergedCanvas.width = Math.max(chartCanvas.width, analysisCanvas.width);
      mergedCanvas.height = chartCanvas.height + analysisCanvas.height + 40; // 40px 间距

      const ctx = mergedCanvas.getContext('2d');
      if (!ctx) {
        throw new Error('无法创建 canvas context');
      }

      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, mergedCanvas.width, mergedCanvas.height);

      ctx.drawImage(chartCanvas, 0, 0);
      ctx.drawImage(analysisCanvas, 0, chartCanvas.height + 40);

      // 下载图片
      mergedCanvas.toBlob((blob) => {
        if (!blob) {
          throw new Error('无法生成图片');
        }
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${userName || '命盘分析'}_${new Date().getTime()}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      }, 'image/png');
    } catch (error) {
      console.error('导出图片失败:', error);
      alert('导出图片失败，请重试');
    } finally {
      setIsExporting(null);
    }
  };

  const exportPDF = async () => {
    setIsExporting('pdf');
    try {
      const chartElement = document.querySelector('[data-export-chart]');
      const analysisElement = document.querySelector('[data-export-analysis]');

      if (!chartElement || !analysisElement) {
        alert('未找到要导出的内容');
        setIsExporting(null);
        return;
      }

      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const margin = 10;

      // 添加标题
      pdf.setFontSize(18);
      pdf.text(`${userName || '命盘分析'} - 人生K线图`, pdfWidth / 2, 15, {
        align: 'center',
      });

      // 导出图表
      const chartCanvas = await html2canvas(chartElement as HTMLElement, {
        backgroundColor: '#ffffff',
        scale: 2,
      });

      const chartImgData = chartCanvas.toDataURL('image/png');
      const chartImgHeight = (chartCanvas.height * (pdfWidth - 2 * margin)) / chartCanvas.width;

      pdf.addImage(chartImgData, 'PNG', margin, 25, pdfWidth - 2 * margin, chartImgHeight);

      // 如果内容超过一页，添加新页
      let currentY = 25 + chartImgHeight + 10;
      if (currentY > pdfHeight - 20) {
        pdf.addPage();
        currentY = margin;
      }

      // 导出分析结果
      const analysisCanvas = await html2canvas(analysisElement as HTMLElement, {
        backgroundColor: '#ffffff',
        scale: 2,
      });

      const analysisImgData = analysisCanvas.toDataURL('image/png');
      const analysisImgHeight = (analysisCanvas.height * (pdfWidth - 2 * margin)) / analysisCanvas.width;

      // 如果分析结果太长，需要分页
      let remainingHeight = analysisImgHeight;
      let sourceY = 0;
      const pageHeight = pdfHeight - margin - currentY;

      while (remainingHeight > 0) {
        if (currentY + remainingHeight > pdfHeight - margin) {
          // 需要新页面
          pdf.addPage();
          currentY = margin;
        }

        const heightToAdd = Math.min(remainingHeight, pageHeight);
        pdf.addImage(
          analysisImgData,
          'PNG',
          margin,
          currentY,
          pdfWidth - 2 * margin,
          heightToAdd,
          undefined,
          'FAST',
          0,
          sourceY / 2 // 因为 scale 是 2
        );

        currentY += heightToAdd;
        sourceY += heightToAdd * 2;
        remainingHeight -= heightToAdd;
      }

      // 保存 PDF
      pdf.save(`${userName || '命盘分析'}_${new Date().getTime()}.pdf`);
    } catch (error) {
      console.error('导出 PDF 失败:', error);
      alert('导出 PDF 失败，请重试');
    } finally {
      setIsExporting(null);
    }
  };

  return (
    <div className="relative inline-block">
      <div className="flex items-center gap-2">
        <button
          onClick={exportJSON}
          disabled={isExporting !== null}
          className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
          title="导出 JSON"
        >
          {isExporting === 'json' ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <FileJson className="w-4 h-4" />
          )}
          <span className="hidden md:inline">JSON</span>
        </button>

        <button
          onClick={exportImage}
          disabled={isExporting !== null}
          className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
          title="导出图片"
        >
          {isExporting === 'image' ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Image className="w-4 h-4" />
          )}
          <span className="hidden md:inline">图片</span>
        </button>

        <button
          onClick={exportPDF}
          disabled={isExporting !== null}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
          title="导出 PDF"
        >
          {isExporting === 'pdf' ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <FileText className="w-4 h-4" />
          )}
          <span className="hidden md:inline">PDF</span>
        </button>
      </div>
    </div>
  );
};

export default ExportButton;

