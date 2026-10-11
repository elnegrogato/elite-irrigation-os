// src/components/VirtualizedList.tsx
import React, { useRef, useEffect } from 'react';
import { FixedSizeList as List, ListChildComponentProps } from 'react-window';

interface VirtualizedListProps<T> {
  items: T[];
  height: number;
  itemHeight: number;
  renderItem: (item: T, index: number, style: React.CSSProperties) => React.ReactNode;
  className?: string;
  overscanCount?: number;
}

export function VirtualizedList<T>({
  items,
  height,
  itemHeight,
  renderItem,
  className = '',
  overscanCount = 5,
}: VirtualizedListProps<T>) {
  const Row = ({ index, style }: ListChildComponentProps) => {
    return (
      <div style={style}>
        {renderItem(items[index], index, style)}
      </div>
    );
  };

  if (items.length === 0) {
    return (
      <div className={`flex items-center justify-center ${className}`} style={{ height }}>
        <p className="text-sm text-slate-400">No items to display</p>
      </div>
    );
  }

  return (
    <List
      className={className}
      height={height}
      itemCount={items.length}
      itemSize={itemHeight}
      width="100%"
      overscanCount={overscanCount}
    >
      {Row}
    </List>
  );
}

// Memoized version for better performance
import { memo } from 'react';

export const MemoizedVirtualizedList = memo(VirtualizedList) as typeof VirtualizedList;

/**
 * Hook to auto-size the virtualized list based on container
 */
export function useVirtualListHeight(defaultHeight: number = 400) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = React.useState(defaultHeight);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const newHeight = entry.contentRect.height;
        if (newHeight > 0) {
          setHeight(newHeight);
        }
      }
    });

    resizeObserver.observe(container);

    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  return { containerRef, height };
}
