import React, { useState, useEffect } from 'react';

interface SummaryItem {
  header: string;
  total: number;
  items: any[];
}

interface CashupSummaryBoxProps {
  summaryBox?: SummaryItem[];
  currSym?: string;
  difference?: number;
}

const CashupSummaryBox: React.FC<CashupSummaryBoxProps> = ({
  summaryBox = [
    { header: "EPOs Takings", total: 0, items: [] },
    { header: "Cash Takings", total: 0, items: [] },
    { header: "PDQ Takings", total: 0, items: [] },
    { header: "Third Party Takings", total: 0, items: [] },
  ],
  currSym = "",
  difference = 0
}) => {
  const [diffColor, setDiffColor] = useState("black");
  const [expandAll, setExpandAll] = useState(false);

  const toggleExpandAll = () => {
    setExpandAll(!expandAll);
  };

  useEffect(() => {
    if (difference < 0) {
      setDiffColor("#A24646"); // Red for negative
    } else if (difference === 0) {
      setDiffColor("#000000"); // Black for zero
    } else {
      setDiffColor("#468F49"); // Green for positive
    }
  }, [difference]);

  return (
    <div className="card p-5 inline-block m-4 relative w-full transition-all duration-300 ease-in-out bg-white shadow-lg rounded-xl hover:shadow-xl">
      <div className="summary_box h-[540px] min-w-[274px] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Summary</h2>
          <button
            onClick={toggleExpandAll}
            className="text-sm px-3 py-1 bg-gray-100 rounded hover:bg-gray-200"
          >
            {expandAll ? "Collapse All" : "Expand All"}
          </button>
        </div>

        <div style={{ color: diffColor }} className="text-right mb-4">
          Difference: {currSym}{difference.toFixed(2)}
        </div>

        {summaryBox.map((summary, index) => (
          <div 
            key={index}
            className="mb-5 rounded-xl bg-gray-50 shadow-md hover:shadow-lg transition-all duration-300"
          >
            <div className="flex justify-between items-center p-3">
              <h3 className="font-medium">{summary.header}</h3>
              <span className="font-semibold">
                {currSym}{summary.total.toFixed(2)}
              </span>
            </div>

            {expandAll && summary.items.length > 0 && (
              <div className="p-3 border-t border-gray-200">
                {summary.items.map((item, itemIndex) => (
                  <div key={itemIndex} className="flex justify-between text-sm py-1">
                    <span className="summary-text">{item.name || `Item ${itemIndex + 1}`}</span>
                    <span>{currSym}{item.value?.toFixed(2) || "0.00"}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CashupSummaryBox;