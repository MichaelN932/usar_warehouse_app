import { VendorQuote, QuoteRequestLine } from '../types';

interface VendorQuoteCompareProps {
  quoteRequestLines: QuoteRequestLine[];
  vendorQuotes: VendorQuote[];
  onSelectQuote: (quoteId: string) => void;
  selectedQuoteId?: string;
}

export function VendorQuoteCompare({
  quoteRequestLines,
  vendorQuotes,
  onSelectQuote,
  selectedQuoteId,
}: VendorQuoteCompareProps) {
  function formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  }

  function formatDate(dateStr: string): string {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
  }

  // Find the best (lowest) price for each line item across all quotes
  function getBestPriceForLine(lineId: string): number | null {
    let bestPrice: number | null = null;
    for (const quote of vendorQuotes) {
      const quoteLine = quote.lines?.find(l => l.quoteRequestLineId === lineId);
      if (quoteLine && (bestPrice === null || quoteLine.unitPrice < bestPrice)) {
        bestPrice = quoteLine.unitPrice;
      }
    }
    return bestPrice;
  }

  // Find the best (lowest) total across all quotes
  const bestTotal = vendorQuotes.reduce((best, quote) => {
    const total = quote.totalAmount + (quote.shippingCost || 0);
    return best === null || total < best ? total : best;
  }, null as number | null);

  if (vendorQuotes.length === 0) {
    return (
      <div className="border border-dashed border-border-default rounded-lg p-8 text-center text-primary-500">
        <span className="material-symbols-outlined text-4xl mb-2 block">compare</span>
        <p>No vendor quotes to compare</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-primary-900 flex items-center gap-2">
          <span className="material-symbols-outlined text-lg">compare</span>
          Quote Comparison
        </h3>
        <span className="text-xs text-primary-500">
          {vendorQuotes.length} quote{vendorQuotes.length !== 1 ? 's' : ''} received
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b-2 border-border-default">
              <th className="py-3 px-4 text-left text-xs font-semibold text-primary-500 uppercase bg-primary-50 sticky left-0 z-10 min-w-[200px]">
                Item
              </th>
              {vendorQuotes.map((quote) => (
                <th
                  key={quote.id}
                  className={`py-3 px-4 text-center text-xs font-semibold uppercase min-w-[150px] ${
                    quote.id === selectedQuoteId
                      ? 'bg-green-50 text-green-700'
                      : quote.isSelected
                      ? 'bg-green-50 text-green-700'
                      : 'bg-primary-50 text-primary-500'
                  }`}
                >
                  <div className="flex flex-col items-center gap-1">
                    <span className="font-medium text-primary-900 normal-case">
                      {quote.vendor?.name || 'Vendor'}
                    </span>
                    {quote.quoteNumber && (
                      <span className="text-xs font-normal text-primary-400">
                        #{quote.quoteNumber}
                      </span>
                    )}
                    {(quote.isSelected || quote.id === selectedQuoteId) && (
                      <span className="px-2 py-0.5 bg-green-100 text-green-700 rounded text-xs">
                        Selected
                      </span>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {/* Line Items */}
            {quoteRequestLines.map((reqLine) => {
              const bestPrice = getBestPriceForLine(reqLine.id);
              return (
                <tr key={reqLine.id} className="border-b border-border-default">
                  <td className="py-3 px-4 bg-white sticky left-0 z-10 border-r border-border-default">
                    <div>
                      <p className="text-sm font-medium text-primary-900">{reqLine.description}</p>
                      <p className="text-xs text-primary-500">Qty: {reqLine.quantity}</p>
                    </div>
                  </td>
                  {vendorQuotes.map((quote) => {
                    const quoteLine = quote.lines?.find(l => l.quoteRequestLineId === reqLine.id);
                    const isBestPrice = quoteLine && bestPrice !== null && quoteLine.unitPrice === bestPrice;
                    return (
                      <td
                        key={quote.id}
                        className={`py-3 px-4 text-center ${
                          quote.id === selectedQuoteId || quote.isSelected ? 'bg-green-50/50' : ''
                        }`}
                      >
                        {quoteLine ? (
                          <div>
                            <span
                              className={`text-sm font-medium ${
                                isBestPrice ? 'text-green-600' : 'text-primary-900'
                              }`}
                            >
                              {formatCurrency(quoteLine.unitPrice)}
                              {isBestPrice && vendorQuotes.length > 1 && (
                                <span className="material-symbols-outlined text-sm ml-1 text-green-500">
                                  check_circle
                                </span>
                              )}
                            </span>
                            <p className="text-xs text-primary-400">
                              {formatCurrency(quoteLine.lineTotal)} total
                            </p>
                            {quoteLine.availability && (
                              <p className="text-xs text-primary-500 mt-1">{quoteLine.availability}</p>
                            )}
                          </div>
                        ) : (
                          <span className="text-xs text-primary-300">—</span>
                        )}
                      </td>
                    );
                  })}
                </tr>
              );
            })}

            {/* Subtotal Row */}
            <tr className="border-b border-border-default bg-primary-50/50">
              <td className="py-2 px-4 text-sm font-medium text-primary-700 sticky left-0 z-10 bg-primary-50 border-r border-border-default">
                Subtotal
              </td>
              {vendorQuotes.map((quote) => {
                const subtotal = quote.totalAmount - (quote.shippingCost || 0);
                return (
                  <td key={quote.id} className="py-2 px-4 text-center text-sm font-medium text-primary-700">
                    {formatCurrency(subtotal)}
                  </td>
                );
              })}
            </tr>

            {/* Shipping Row */}
            <tr className="border-b border-border-default">
              <td className="py-2 px-4 text-sm text-primary-500 sticky left-0 z-10 bg-white border-r border-border-default">
                Shipping
              </td>
              {vendorQuotes.map((quote) => (
                <td key={quote.id} className="py-2 px-4 text-center text-sm text-primary-500">
                  {quote.shippingCost > 0 ? formatCurrency(quote.shippingCost) : 'Free'}
                </td>
              ))}
            </tr>

            {/* Total Row */}
            <tr className="bg-primary-100">
              <td className="py-3 px-4 text-sm font-bold text-primary-900 sticky left-0 z-10 bg-primary-100 border-r border-border-default">
                Total
              </td>
              {vendorQuotes.map((quote) => {
                const total = quote.totalAmount;
                const isBestTotal = bestTotal !== null && total === bestTotal;
                return (
                  <td key={quote.id} className="py-3 px-4 text-center">
                    <span
                      className={`text-lg font-bold ${
                        isBestTotal ? 'text-green-600' : 'text-primary-900'
                      }`}
                    >
                      {formatCurrency(total)}
                      {isBestTotal && vendorQuotes.length > 1 && (
                        <span className="material-symbols-outlined text-sm ml-1 text-green-500">
                          star
                        </span>
                      )}
                    </span>
                  </td>
                );
              })}
            </tr>

            {/* Lead Time Row */}
            <tr className="border-b border-border-default">
              <td className="py-2 px-4 text-sm text-primary-500 sticky left-0 z-10 bg-white border-r border-border-default">
                Lead Time
              </td>
              {vendorQuotes.map((quote) => (
                <td key={quote.id} className="py-2 px-4 text-center text-sm text-primary-500">
                  {quote.leadTimeDays ? `${quote.leadTimeDays} days` : '—'}
                </td>
              ))}
            </tr>

            {/* Valid Until Row */}
            <tr className="border-b border-border-default">
              <td className="py-2 px-4 text-sm text-primary-500 sticky left-0 z-10 bg-white border-r border-border-default">
                Valid Until
              </td>
              {vendorQuotes.map((quote) => (
                <td key={quote.id} className="py-2 px-4 text-center text-sm text-primary-500">
                  {quote.validUntil ? formatDate(quote.validUntil) : '—'}
                </td>
              ))}
            </tr>

            {/* Select Action Row */}
            <tr>
              <td className="py-4 px-4 sticky left-0 z-10 bg-white border-r border-border-default">
                <span className="text-sm font-medium text-primary-700">Select Winner</span>
              </td>
              {vendorQuotes.map((quote) => (
                <td key={quote.id} className="py-4 px-4 text-center">
                  {quote.isSelected || quote.id === selectedQuoteId ? (
                    <span className="inline-flex items-center gap-1 px-3 py-1.5 bg-green-100 text-green-700 rounded-lg text-sm font-medium">
                      <span className="material-symbols-outlined text-lg">check_circle</span>
                      Selected
                    </span>
                  ) : (
                    <button
                      onClick={() => onSelectQuote(quote.id)}
                      className="px-3 py-1.5 border border-action-primary text-action-primary rounded-lg text-sm font-medium hover:bg-action-primary hover:text-white transition-colors"
                    >
                      Select
                    </button>
                  )}
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 text-xs text-primary-500 pt-2 border-t border-border-default">
        <div className="flex items-center gap-1">
          <span className="material-symbols-outlined text-sm text-green-500">check_circle</span>
          <span>Best price for item</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="material-symbols-outlined text-sm text-green-500">star</span>
          <span>Lowest total</span>
        </div>
      </div>
    </div>
  );
}

export default VendorQuoteCompare;
