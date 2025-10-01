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

export type HierarchicalArchivePickerProps = {
  archives: Archive[];
  value: string;
  onChange: (val: string) => void;
  selectionKey: "code" | "id";
  baseArchiveId: string;
  label?: string;
  showRootOptionAtRoot?: boolean;
  excludeBase?: boolean;
  placeholder?: string;
  enableExpandAllToggle?: boolean;
  showChildCount?: boolean;
  className?: string;
};

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

  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());

  const toggleNode = useCallback((id: string) => {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const childrenMap = useMemo(() => {
    const map: Record<string, Archive[]> = {};
    archives.forEach((a) => {
      const pid = a.parentId || "root";
      if (!map[pid]) map[pid] = [];
      map[pid].push(a);
    });
    return map;
  }, [archives]);

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
          depth: -1,
          synthetic: true,
        };
        visible.push(synthetic);
        full.push(synthetic);
      }
      const roots = childrenMap["root"] || [];

      build(roots, 0, visible, true);
      build(roots, 0, full, false);
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
        build(children, 0, visible, true);
        build(children, 0, full, false);
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

  useEffect(() => setTempSelection(value), [value]);

  const selectedArchive = useMemo(() => {
    const direct = archives.find((a) => a[selectionKey] === value);
    if (direct) return direct;

    if (!value && baseArchiveId !== "root") {
      const base = archives.find((a) => a.id === baseArchiveId);
      if (base) return base;
    }

    if (!value && baseArchiveId === "root" && showRootOptionAtRoot) {
      return {
        id: "root",
        name: "Root",
        code: "root",
        parentId: "",
      } as Archive;
    }

    if (value === "root") {
      return {
        id: "root",
        name: "Root",
        code: "root",
        parentId: "",
      } as Archive;
    }
    return undefined;
  }, [archives, selectionKey, value, baseArchiveId, showRootOptionAtRoot]);

  const filtered = useMemo(() => {
    if (!query.trim()) return visibleArchives;
    const q = query.toLowerCase();

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

  // (Reset removed) — no longer need fallback/reset logic

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
          className={`absolute left-0 z-50 w-full rounded-md border border-gray-200 bg-white shadow-lg dark:border-gray-700 dark:bg-gray-800 text-sm ${
            dropUp ? "bottom-full mb-1" : "top-full mt-1"
          }`}
          onKeyDown={handleKeyDown}>
          <div className="p-2 pb-1 border-b border-gray-100 dark:border-gray-700">
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search..."
              className="w-full rounded-md border border-gray-300 bg-white px-2 py-1 h-8 text-gray-900 focus:border-green-500 focus:ring-green-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200"
            />
          </div>
          {/* Removed global expand bar for cleaner UI */}
          <ul className="max-h-56 overflow-y-auto py-1">
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
                  className={`group flex cursor-pointer items-center justify-between px-3 py-1 hover:bg-gray-100 dark:hover:bg-gray-700 ${
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
          <div className="border-t border-gray-100 p-2 dark:border-gray-700">
            <button
              type="button"
              disabled={!tempSelection}
              onClick={commitSelection}
              className="mt-1 w-full rounded-md bg-demplon py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50">
              Choose
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default HierarchicalArchivePicker;
