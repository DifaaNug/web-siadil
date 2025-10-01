"use client";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Archive } from "../../types";
import { useOnClickOutside } from "../../hooks/useOnClickOutside";

/**
 * Generic hierarchical archive picker with:
 * - subtree scoping based on baseArchiveId
 * - optional inclusion / exclusion of base node
 * - optional exposure of root level (when baseArchiveId === 'root')
 * - search filtering (name/code)
 * - confirm via Choose button (not instant)
 * - Clear button
 * - keyboard: Enter commit, Esc close
 * - dynamic drop-up if not enough space below
 * - indentation by depth
 */
export type HierarchicalArchivePickerProps = {
  archives: Archive[];
  /** current selected value (code or id depending on selectionKey) */
  value: string;
  /** callback with committed value */
  onChange: (val: string) => void;
  /** Which field is used for selection & value mapping: 'code' or 'id' */
  selectionKey: "code" | "id";
  /** Current folder context id ("root" for top) */
  baseArchiveId: string;
  /** Field label */
  label?: string;
  /** When at root, include the synthetic Root option */
  showRootOptionAtRoot?: boolean;
  /** Exclude the base archive itself from selectable list */
  excludeBase?: boolean;
  /** Placeholder text */
  placeholder?: string;
  /** Allow user to clear selection */
  clearable?: boolean;
  /** Allow expanding full subtree when at root */
  enableExpandAllToggle?: boolean;
  /** Show child count badges */
  showChildCount?: boolean;
  className?: string;
};

// Helper type for internal node with depth
interface DepthArchive extends Archive {
  depth: number;
  synthetic?: boolean;
}

export const HierarchicalArchivePicker: React.FC<
  HierarchicalArchivePickerProps
> = ({
  archives,
  value,
  onChange,
  selectionKey,
  baseArchiveId,
  label = "Archive",
  showRootOptionAtRoot = true,
  excludeBase = false,
  placeholder = "Select Archive",
  clearable = true,
  // expand all toggle removed from UI
  showChildCount = true,
  className = "",
}) => {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [tempSelection, setTempSelection] = useState<string>(value);
  const [dropUp, setDropUp] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  useOnClickOutside(containerRef, () => setOpen(false), buttonRef);

  // removed global expandAll toggle (per-node only now)
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set()); // per-node

  const toggleNode = useCallback((id: string) => {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  // Precompute children map for faster lookups & counts
  const childrenMap = useMemo(() => {
    const map: Record<string, Archive[]> = {};
    archives.forEach((a) => {
      const pid = a.parentId || "root";
      if (!map[pid]) map[pid] = [];
      map[pid].push(a);
    });
    return map;
  }, [archives]);

  // Build two trees: visible (respects expandedIds) & full (for search)
  const { visibleArchives, fullArchives } = useMemo(() => {
    const build = (
      nodes: Archive[],
      depth: number,
      list: DepthArchive[],
      gating: boolean
    ) => {
      nodes.forEach((n) => {
        list.push({ ...n, depth });
        const children = childrenMap[n.id] || [];
        if (!children.length) return;
        if (!gating || expandedIds.has(n.id)) {
          build(children, depth + 1, list, gating);
        }
      });
    };

    const visible: DepthArchive[] = [];
    const full: DepthArchive[] = [];

    if (baseArchiveId === "root") {
      if (showRootOptionAtRoot) {
        const synthetic: DepthArchive = {
          id: "root",
          name: "Root",
          code: "root",
          parentId: "",
          depth: -1, // use -1 so that its direct children appear visually unindented (depth 0)
          synthetic: true,
        };
        visible.push(synthetic);
        full.push(synthetic);
      }
      const roots = childrenMap["root"] || [];
      // pass depth 0 so they align flush with picker left edge
      build(roots, 0, visible, true); // gated
      build(roots, 0, full, false); // full
    } else {
      const base = archives.find((a) => a.id === baseArchiveId);
      const children = childrenMap[baseArchiveId] || [];
      if (base && !excludeBase) {
        const baseDepth = 0;
        const baseNode: DepthArchive = { ...base, depth: baseDepth };
        visible.push(baseNode);
        full.push(baseNode);
        if (expandedIds.has(base.id)) build(children, 1, visible, true);
        build(children, 1, full, false);
      } else {
        // excludeBase==true -> show direct children as top-level, but keep their descendants gated by expansion
        build(children, 0, visible, true); // gated so grandchildren are hidden until expand
        build(children, 0, full, false); // full tree for search
      }
    }
    return { visibleArchives: visible, fullArchives: full };
  }, [
    archives,
    baseArchiveId,
    childrenMap,
    excludeBase,
    expandedIds,
    showRootOptionAtRoot,
  ]);

  // Compute child counts if needed
  const childCountMap = useMemo(() => {
    if (!showChildCount) return {} as Record<string, number>;
    const counts: Record<string, number> = {};
    archives.forEach((a) => {
      const pid = a.parentId || "root";
      counts[pid] = (counts[pid] || 0) + 1;
    });
    return counts;
  }, [archives, showChildCount]);

  // Sync temp selection when external value changes
  useEffect(() => setTempSelection(value), [value]);

  const selectedArchive = useMemo(() => {
    // If actual value matches an archive, use it
    const direct = archives.find((a) => a[selectionKey] === value);
    if (direct) return direct;
    // If value cleared and we are inside a subtree (not root) and excludeBase=true,
    // show the base archive as contextual label instead of placeholder.
    if (!value && baseArchiveId !== "root" && excludeBase) {
      const base = archives.find((a) => a.id === baseArchiveId);
      if (base) return base;
    }
    // If at root and cleared (value empty) still show Root as contextual label
    if (!value && baseArchiveId === "root" && showRootOptionAtRoot) {
      return {
        id: "root",
        name: "Root",
        code: "root",
        parentId: "",
      } as Archive;
    }
    // Special synthetic root selection
    if (value === "root") {
      return {
        id: "root",
        name: "Root",
        code: "root",
        parentId: "",
      } as Archive;
    }
    return undefined;
  }, [
    archives,
    selectionKey,
    value,
    baseArchiveId,
    excludeBase,
    showRootOptionAtRoot,
  ]);

  const filtered = useMemo(() => {
    if (!query.trim()) return visibleArchives;
    const q = query.toLowerCase();
    // When searching: operate on full tree ignoring expansion, then filter & add ancestors
    const matches = fullArchives.filter(
      (a) =>
        a.name.toLowerCase().includes(q) || a.code.toLowerCase().includes(q)
    );
    if (matches.length === 0) return [];
    const neededIds = new Set(matches.map((m) => m.id));
    const byId: Record<string, DepthArchive> = {};
    fullArchives.forEach((a) => {
      byId[a.id] = a;
    });
    // add ancestors
    matches.forEach((m) => {
      let currentParent = m.parentId;
      while (currentParent) {
        if (byId[currentParent]) {
          neededIds.add(currentParent);
          currentParent = byId[currentParent].parentId;
        } else break;
      }
    });
    return fullArchives.filter((a) => neededIds.has(a.id));
  }, [visibleArchives, fullArchives, query]);

  const commitSelection = useCallback(() => {
    onChange(tempSelection);
    setOpen(false);
  }, [onChange, tempSelection]);

  const clearSelection = useCallback(() => {
    if (!clearable) return;
    setTempSelection("");
    onChange("");
    setQuery("");
    setOpen(false);
  }, [clearable, onChange]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && open) {
      e.preventDefault();
      commitSelection();
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  };

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 50);
      if (buttonRef.current) {
        const rect = buttonRef.current.getBoundingClientRect();
        const spaceBelow = window.innerHeight - rect.bottom;
        const estimatedHeight = 300;
        const shouldDropUp =
          spaceBelow < estimatedHeight && rect.top > spaceBelow;
        setDropUp(shouldDropUp);
      }
    }
  }, [open]);

  return (
    <div className={`relative ${className}`} ref={containerRef}>
      <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
        {label}
      </label>
      <button
        ref={buttonRef}
        type="button"
        onClick={() => setOpen((o) => !o)}
        onKeyDown={handleKeyDown}
        className="flex w-full items-center justify-between rounded-md border border-gray-300 bg-white px-3 py-2 text-left text-sm text-gray-900 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200">
        <span className={selectedArchive ? "" : "text-gray-400"}>
          {selectedArchive ? selectedArchive.name : placeholder}
        </span>
        <svg
          className={`ml-2 h-4 w-4 transform transition-transform ${
            open ? "rotate-180" : ""
          }`}
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor">
          <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
        </svg>
      </button>
      {open && (
        <div
          className={`absolute left-0 z-50 w-full rounded-md border border-gray-200 bg-white shadow-lg dark:border-gray-700 dark:bg-gray-800 ${
            dropUp ? "bottom-full mb-1" : "top-full mt-1"
          }`}
          onKeyDown={handleKeyDown}>
          <div className="p-2 border-b border-gray-100 dark:border-gray-700">
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search..."
              className="w-full rounded-md border border-gray-300 bg-white px-2 py-1 text-sm text-gray-900 focus:border-green-500 focus:ring-green-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200"
            />
          </div>
          {/* Removed global expand bar for cleaner UI */}
          <ul className="max-h-60 overflow-y-auto py-1 text-sm">
            {filtered.length === 0 && (
              <li className="px-3 py-2 text-gray-500 dark:text-gray-400">
                No archives found
              </li>
            )}
            {filtered.map((a) => {
              const key = a[selectionKey as "code" | "id"];
              const active = tempSelection === key;
              const count =
                showChildCount && !a.synthetic
                  ? childCountMap[a.id]
                  : undefined;
              // Removed ascii branch lines; rely on indentation
              const hasChildren = !!(
                childrenMap[a.id] && childrenMap[a.id].length
              );
              const isExpanded = expandedIds.has(a.id);
              return (
                <li
                  key={a.id + key}
                  className={`group flex cursor-pointer items-center justify-between px-3 py-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 ${
                    active ? "bg-green-50 dark:bg-gray-700/70" : ""
                  }`}>
                  <div
                    className="flex items-center flex-1 min-w-0"
                    style={{ paddingLeft: `${Math.max(a.depth, 0) * 10}px` }}>
                    {hasChildren && !(a.synthetic && a.id === "root") ? (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleNode(a.id);
                        }}
                        className="mr-1 inline-flex h-4 w-4 items-center justify-center text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
                        <svg
                          className={`h-3.5 w-3.5 transition-transform ${
                            isExpanded ? "rotate-90" : ""
                          }`}
                          viewBox="0 0 20 20"
                          fill="currentColor">
                          <path d="M6 6l6 4-6 4V6z" />
                        </svg>
                      </button>
                    ) : (
                      <span className="mr-1 inline-block h-4 w-4" />
                    )}
                    <button
                      type="button"
                      onClick={() => setTempSelection(key)}
                      className={`flex flex-1 items-center truncate text-left text-gray-700 dark:text-gray-200 ${
                        active ? "font-medium" : "font-normal"
                      }`}>
                      <span className="truncate flex-1">{a.name}</span>
                      {showChildCount && count ? (
                        <span className="ml-2 inline-block shrink-0 rounded bg-gray-200 px-1.5 py-0.5 text-[10px] font-semibold text-gray-700 dark:bg-gray-600 dark:text-gray-100">
                          {count}
                        </span>
                      ) : null}
                    </button>
                  </div>
                  {active && (
                    <svg
                      className="ml-2 h-4 w-4 text-green-600"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={3}>
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  )}
                </li>
              );
            })}
          </ul>
          <div className="flex items-center gap-2 border-t border-gray-100 p-3 dark:border-gray-700">
            {clearable && (
              <button
                type="button"
                onClick={clearSelection}
                className="rounded-md border border-gray-300 bg-white px-4 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600">
                Clear
              </button>
            )}
            <button
              type="button"
              disabled={!tempSelection}
              onClick={commitSelection}
              className="ml-auto rounded-md bg-demplon px-5 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50">
              Choose
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default HierarchicalArchivePicker;
