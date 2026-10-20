import { KeyboardArrowDownOutlined, KeyboardArrowUpOutlined } from '@mui/icons-material';
import { Divider, IconButton, Tooltip, useMediaQuery, useTheme } from '@mui/material';
import {
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent,
  type PointerEvent,
  type ReactElement,
  type ReactNode,
} from 'react';

import styles from '@/studio/section/components/grid/grid-section.module.css';
import type { GridRecordChildLayoutMetadata } from '@/studio/section/model/section-layout-metadata';

interface StoredGridLayout {
  childHeight: number;
  collapsed: boolean;
}

interface ResizableGridLayoutProps {
  child: ReactNode;
  collapseLabel: string;
  expandLabel: string;
  layout?: GridRecordChildLayoutMetadata;
  minimumPrimaryHeight: number;
  parent: ReactNode;
  scope?: 'detail';
  sectionId: string;
  separatorLabel: string;
}

const defaultChildHeight = 320;
const defaultChildMinHeight = 180;
const maximumStoredChildHeight = 1200;
const resizeStep = 24;
const splitterHeight = 28;

const getStorageKey = (sectionId: string, scope?: 'detail'): string =>
  `fitly:grid-record-child-layout:${sectionId}${scope ? `:${scope}` : ''}`;

const getChildMinimumHeight = (layout?: GridRecordChildLayoutMetadata): number =>
  Math.min(
    maximumStoredChildHeight,
    Math.max(1, layout?.minHeight ?? defaultChildMinHeight),
  );

const getDefaultLayout = (layout?: GridRecordChildLayoutMetadata): StoredGridLayout => {
  const minimumHeight = getChildMinimumHeight(layout);

  return {
    childHeight: Math.min(
      maximumStoredChildHeight,
      Math.max(minimumHeight, layout?.defaultHeight ?? defaultChildHeight),
    ),
    collapsed: layout?.initiallyCollapsed ?? false,
  };
};

const readStoredLayout = (
  storageKey: string,
  fallback: StoredGridLayout,
  minimumHeight: number,
): StoredGridLayout => {
  if (typeof window === 'undefined') return fallback;

  try {
    const stored = JSON.parse(
      window.localStorage.getItem(storageKey) ?? 'null',
    ) as Partial<StoredGridLayout> | null;
    const hasValidHeight = typeof stored?.childHeight === 'number'
      && Number.isFinite(stored.childHeight)
      && stored.childHeight >= minimumHeight
      && stored.childHeight <= maximumStoredChildHeight;

    return {
      childHeight: hasValidHeight ? stored.childHeight as number : fallback.childHeight,
      collapsed: typeof stored?.collapsed === 'boolean' ? stored.collapsed : fallback.collapsed,
    };
  } catch {
    return fallback;
  }
};

const writeStoredLayout = (storageKey: string, layout: StoredGridLayout): void => {
  if (typeof window === 'undefined') return;

  try {
    window.localStorage.setItem(storageKey, JSON.stringify(layout));
  } catch {
    // The layout remains usable when storage is unavailable.
  }
};

export const ResizableGridLayout = ({
  child,
  collapseLabel,
  expandLabel,
  layout: layoutMetadata,
  minimumPrimaryHeight,
  parent,
  scope,
  sectionId,
  separatorLabel,
}: ResizableGridLayoutProps): ReactElement => {
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up('md'));
  const storageKey = getStorageKey(sectionId, scope);
  const childMinimumHeight = getChildMinimumHeight(layoutMetadata);
  const defaultLayout = getDefaultLayout(layoutMetadata);
  const [layout, setLayout] = useState<StoredGridLayout>(() =>
    readStoredLayout(storageKey, defaultLayout, childMinimumHeight));
  const containerRef = useRef<HTMLDivElement | null>(null);
  const layoutRef = useRef(layout);
  const childHeightRef = useRef(layout.childHeight);
  const resizeStartRef = useRef<{ childHeight: number; pointerY: number } | null>(null);

  const getMaximumChildHeight = (): number => {
    const containerHeight = containerRef.current?.clientHeight ?? 0;
    if (containerHeight <= splitterHeight) {
      return maximumStoredChildHeight;
    }

    return Math.max(
      childMinimumHeight,
      containerHeight - minimumPrimaryHeight - splitterHeight,
    );
  };

  const constrainChildHeight = (height: number): number =>
    Math.min(getMaximumChildHeight(), Math.max(childMinimumHeight, height));

  const saveLayout = (nextLayout: StoredGridLayout): void => {
    layoutRef.current = nextLayout;
    childHeightRef.current = nextLayout.childHeight;
    setLayout(nextLayout);
    writeStoredLayout(storageKey, nextLayout);
  };

  const toggleChild = (): void => {
    saveLayout({
      childHeight: childHeightRef.current,
      collapsed: !layout.collapsed,
    });
  };

  const handleResizePointerDown = (event: PointerEvent<HTMLDivElement>): void => {
    if (!isDesktop || layout.collapsed || event.button !== 0) return;

    resizeStartRef.current = {
      childHeight: childHeightRef.current,
      pointerY: event.clientY,
    };
    event.currentTarget.setPointerCapture(event.pointerId);
    event.preventDefault();
  };

  const handleResizePointerMove = (event: PointerEvent<HTMLDivElement>): void => {
    const resizeStart = resizeStartRef.current;
    if (!isDesktop || !resizeStart) return;

    const childHeight = constrainChildHeight(
      resizeStart.childHeight + resizeStart.pointerY - event.clientY,
    );
    const nextLayout = { childHeight, collapsed: false };
    layoutRef.current = nextLayout;
    childHeightRef.current = childHeight;
    setLayout(nextLayout);
  };

  const finishResize = (event: PointerEvent<HTMLDivElement>): void => {
    if (!resizeStartRef.current) return;

    resizeStartRef.current = null;
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
    writeStoredLayout(storageKey, {
      childHeight: childHeightRef.current,
      collapsed: false,
    });
  };

  const handleResizeKeyDown = (event: KeyboardEvent<HTMLDivElement>): void => {
    if (event.key === 'Home') {
      event.preventDefault();
      if (!layout.collapsed) toggleChild();
      return;
    }

    if (!isDesktop || (event.key !== 'ArrowUp' && event.key !== 'ArrowDown')) return;

    event.preventDefault();
    const direction = event.key === 'ArrowUp' ? 1 : -1;
    saveLayout({
      childHeight: constrainChildHeight(childHeightRef.current + direction * resizeStep),
      collapsed: false,
    });
  };

  useLayoutEffect(() => {
    const initialLayout = readStoredLayout(storageKey, defaultLayout, childMinimumHeight);
    layoutRef.current = initialLayout;
    childHeightRef.current = initialLayout.childHeight;
    setLayout(initialLayout);
  }, [
    childMinimumHeight,
    defaultLayout.childHeight,
    defaultLayout.collapsed,
    storageKey,
  ]);

  useLayoutEffect(() => {
    if (!isDesktop) return undefined;

    const resizeLayout = (): void => {
      if (layoutRef.current.collapsed) return;

      const childHeight = constrainChildHeight(childHeightRef.current);
      if (childHeight === childHeightRef.current) return;

      const nextLayout = { ...layoutRef.current, childHeight };
      layoutRef.current = nextLayout;
      childHeightRef.current = childHeight;
      setLayout(nextLayout);
      writeStoredLayout(storageKey, nextLayout);
    };

    resizeLayout();
    if (typeof ResizeObserver === 'undefined' || !containerRef.current) return undefined;

    const observer = new ResizeObserver(resizeLayout);
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [
    childMinimumHeight,
    isDesktop,
    layout.collapsed,
    minimumPrimaryHeight,
    storageKey,
  ]);

  const layoutClassName = [
    styles.resizableLayout,
    isDesktop ? styles.resizableLayoutDesktop : styles.resizableLayoutMobile,
    layout.collapsed ? styles.resizableLayoutCollapsed : '',
  ].filter(Boolean).join(' ');
  const splitterClassName = [
    styles.splitter,
    isDesktop ? styles.splitterDesktop : '',
    layout.collapsed ? styles.splitterCollapsed : '',
  ].filter(Boolean).join(' ');
  const layoutStyle = {
    '--grid-section-child-default-height': `${defaultLayout.childHeight}px`,
    '--grid-section-child-height': `${layout.childHeight}px`,
    '--grid-section-primary-min-height': `${minimumPrimaryHeight}px`,
    '--grid-section-splitter-height': `${splitterHeight}px`,
  } as CSSProperties;

  return (
    <div className={layoutClassName} ref={containerRef} style={layoutStyle}>
      {parent}
      <div
        aria-label={separatorLabel}
        aria-orientation="horizontal"
        aria-valuemax={getMaximumChildHeight()}
        aria-valuemin={layout.collapsed ? 0 : childMinimumHeight}
        aria-valuenow={layout.collapsed ? 0 : isDesktop ? layout.childHeight : defaultLayout.childHeight}
        className={splitterClassName}
        onKeyDown={handleResizeKeyDown}
        onPointerCancel={finishResize}
        onPointerDown={handleResizePointerDown}
        onPointerMove={handleResizePointerMove}
        onPointerUp={finishResize}
        role="separator"
        tabIndex={0}
      >
        <Divider className={styles.splitterDivider} />
        <Tooltip title={layout.collapsed ? expandLabel : collapseLabel}>
          <IconButton
            aria-label={layout.collapsed ? expandLabel : collapseLabel}
            className={styles.splitterButton}
            onClick={toggleChild}
            onPointerDown={(event) => event.stopPropagation()}
            size="small"
          >
            {layout.collapsed
              ? <KeyboardArrowUpOutlined fontSize="small" />
              : <KeyboardArrowDownOutlined fontSize="small" />}
          </IconButton>
        </Tooltip>
      </div>
      {!layout.collapsed ? child : null}
    </div>
  );
};
