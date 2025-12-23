import React from 'react';
import { X, Sparkles, ExternalLink } from 'lucide-react';

interface AnnouncementModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AnnouncementModal: React.FC<AnnouncementModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const handleFeedbackClick = () => {
    window.open('https://v.wjx.cn/vm/e7TP0At.aspx#', '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-xl w-full overflow-hidden border border-gray-200 animate-fade-in">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-rose-500 text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5" />
            <div>
              <p className="text-sm font-semibold">版本更新公告 · 多维度K线已上线</p>
              <p className="text-[11px] text-indigo-100">
                现在不仅能看整体人生走势，还能分别查看财富、感情、事业等关键维度
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-white/15 transition-colors"
            aria-label="关闭公告"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="px-6 py-4 space-y-4 text-sm text-gray-700">
          <div className="space-y-2">
            <p className="font-semibold text-gray-900">
              ✨ 本次更新重点：新增「多维度人生 K 线」视图
            </p>
            <ul className="list-disc list-inside space-y-1 text-gray-700">
              <li>
                在结果页中，除了原来的<strong>整体流年大运 K 线图</strong>，
                现在新增一张<strong className="text-indigo-600">多维度 K 线图</strong>。
              </li>
              <li>
                你可以同时查看<strong>财富、感情、事业、健康、六亲</strong>等维度的年度运势曲线，
                更直观看到每个阶段「哪一块更亮、哪一块要多留心」。
              </li>
              <li>
                维度曲线是基于整体 K 线和各维度评分做的可视化拆分，
                方便你做<strong>回顾和规划</strong>，并非绝对命理结论，请理性参考。
              </li>
            </ul>
          </div>

          <div className="border-t border-gray-200 pt-3 space-y-2">
            <p className="font-semibold text-gray-900 flex items-center gap-1.5">
              💬 你的想法，对迭代非常重要
            </p>
            <p className="text-gray-700 text-sm leading-relaxed">
              如果你在使用过程中有任何想法，比如：
              <br />
              <span className="text-gray-600">
                「还想看哪些维度？」、「交互哪里可以更顺手？」、「图形怎么展示更清晰？」……
              </span>
              <br />
              欢迎在<strong className="text-indigo-600">页面底部的问卷入口</strong>里随手留下几句建议，
              这会直接影响下一版的优先级。
            </p>
            <p className="text-[11px] text-gray-500">
              问卷只需 1～2 分钟，主要是开放题，想写多少都可以，非常感谢你的耐心和反馈 🙏
            </p>
          </div>

          <button
            type="button"
            onClick={handleFeedbackClick}
            className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-indigo-500 to-rose-500 hover:from-indigo-600 hover:to-rose-600 rounded-xl shadow-md hover:shadow-lg transition-all"
          >
            <ExternalLink className="w-4 h-4" />
            <span>立即前往填写问卷，帮我把「人生K线」做得更好</span>
          </button>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-gray-50 border-t border-gray-200 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 text-xs md:text-sm rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-100 transition-colors"
          >
            我知道了
          </button>
        </div>
      </div>
    </div>
  );
};

export default AnnouncementModal;


