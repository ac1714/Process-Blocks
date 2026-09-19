export type CollectionRow = {
  id: string;
  columns: string[][];
};

export type CollectionLayout = { rows: CollectionRow[] };

const rowId = () => `row-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;

export function defaultCollectionLayout(ids: string[]): CollectionLayout {
  return { rows: ids.map((id) => ({ id: rowId(), columns: [[id]] })) };
}

export function normalizeCollectionLayout(
  layout: CollectionLayout | undefined,
  ids: string[],
): CollectionLayout {
  const valid = new Set(ids);
  const seen = new Set<string>();
  const rows = (layout?.rows ?? [])
    .map((row) => ({
      id: row.id || rowId(),
      columns: row.columns
        .slice(0, 6)
        .map((column) => column.filter((id) => valid.has(id) && !seen.has(id) && seen.add(id))),
    }))
    .filter((row) => row.columns.some((column) => column.length));
  for (const id of ids) {
    if (!seen.has(id)) rows.push({ id: rowId(), columns: [[id]] });
  }
  return { rows };
}

export function setRowColumnCount(row: CollectionRow, count: number): CollectionRow {
  const safe = Math.max(1, Math.min(6, count));
  const columns = row.columns.map((column) => [...column]);
  while (columns.length < safe) columns.push([]);
  if (columns.length > safe) {
    const overflow = columns.splice(safe).flat();
    columns[safe - 1]?.push(...overflow);
  }
  return { ...row, columns };
}

export function moveCollectionItem(
  layout: CollectionLayout,
  uid: string,
  direction: "up" | "down" | "left" | "right",
): CollectionLayout {
  const rows = layout.rows.map((row) => ({
    ...row,
    columns: row.columns.map((column) => [...column]),
  }));
  for (const row of rows) {
    for (let columnIndex = 0; columnIndex < row.columns.length; columnIndex += 1) {
      const column = row.columns[columnIndex];
      const position = column?.indexOf(uid) ?? -1;
      if (!column || position < 0) continue;
      if (direction === "up" || direction === "down") {
        const destination = position + (direction === "up" ? -1 : 1);
        if (destination < 0 || destination >= column.length) {
          const rowIndex = rows.findIndex((candidate) => candidate.id === row.id);
          const targetRow = rows[rowIndex + (direction === "up" ? -1 : 1)];
          const targetColumn =
            targetRow?.columns[Math.min(columnIndex, (targetRow?.columns.length ?? 1) - 1)];
          if (!targetColumn) return layout;
          column.splice(position, 1);
          if (direction === "up") targetColumn.push(uid);
          else targetColumn.unshift(uid);
          return {
            rows: rows.filter((candidate) => candidate.columns.some((entry) => entry.length)),
          };
        }
        [column[position], column[destination]] = [
          column[destination] as string,
          column[position] as string,
        ];
        return { rows };
      }
      const targetIndex = columnIndex + (direction === "left" ? -1 : 1);
      const target = row.columns[targetIndex];
      if (!target) return layout;
      column.splice(position, 1);
      target.push(uid);
      return { rows };
    }
  }
  return layout;
}

export function insertCollectionItem(
  layout: CollectionLayout,
  uid: string,
  rowIndex: number,
  columnIndex: number,
  position: number,
): CollectionLayout {
  const rows = layout.rows.map((row) => ({
    ...row,
    columns: row.columns.map((column) => [...column]),
  }));
  if (!rows[rowIndex]) rows.push({ id: rowId(), columns: [[]] });
  const row = rows[rowIndex];
  if (!row) return layout;
  while (row.columns.length <= columnIndex && row.columns.length < 6) row.columns.push([]);
  const column = row.columns[columnIndex];
  if (!column) return layout;
  column.splice(Math.max(0, Math.min(position, column.length)), 0, uid);
  return { rows };
}

export function addCollectionRow(layout: CollectionLayout, after: number): CollectionLayout {
  const rows = [...layout.rows];
  rows.splice(after + 1, 0, { id: rowId(), columns: [[]] });
  return { rows };
}

export function reorderCollectionItem(
  layout: CollectionLayout,
  activeUid: string,
  overId: string,
): CollectionLayout {
  if (activeUid === overId) return layout;
  const rows = layout.rows.map((row) => ({
    ...row,
    columns: row.columns.map((column) => [...column]),
  }));

  // First locate activeUid and remove it
  let sourceRowId: string | null = null;
  let sourceColIdx = -1;
  for (const row of rows) {
    for (let c = 0; c < row.columns.length; c++) {
      const col = row.columns[c];
      if (!col) continue;
      const activeIdx = col.indexOf(activeUid);
      if (activeIdx >= 0) {
        col.splice(activeIdx, 1);
        sourceRowId = row.id;
        sourceColIdx = c;
      }
    }
  }

  // 1. Target is a new row: new-row::bottom
  if (overId.startsWith("new-row::")) {
    rows.push({ id: rowId(), columns: [[activeUid]] });
    return {
      rows: rows.filter((r) => r.columns.some((col) => col.length > 0)),
    };
  }

  // 2. Target is a column container or empty column: col::rowId::columnIndex
  if (overId.startsWith("col::")) {
    const parts = overId.split("::");
    const targetRowId = parts[1];
    const targetColIdx = Number(parts[2]);
    const targetRow = rows.find((r) => r.id === targetRowId);
    if (targetRow) {
      while (targetRow.columns.length <= targetColIdx && targetRow.columns.length < 6) {
        targetRow.columns.push([]);
      }
      const targetCol = targetRow.columns[targetColIdx];
      if (targetCol) {
        targetCol.push(activeUid);
        return {
          rows: rows.filter((r) => r.columns.some((col) => col.length > 0)),
        };
      }
    }
  }

  // 3. Target is a specific position inside a column: col-pos::rowId::columnIndex::pos
  if (overId.startsWith("col-pos::")) {
    const parts = overId.split("::");
    const targetRowId = parts[1];
    const targetColIdx = Number(parts[2]);
    const targetPos = Number(parts[3]);
    const targetRow = rows.find((r) => r.id === targetRowId);
    if (targetRow) {
      while (targetRow.columns.length <= targetColIdx && targetRow.columns.length < 6) {
        targetRow.columns.push([]);
      }
      const targetCol = targetRow.columns[targetColIdx];
      if (targetCol) {
        const safePos = Math.max(0, Math.min(targetPos, targetCol.length));
        targetCol.splice(safePos, 0, activeUid);
        return {
          rows: rows.filter((r) => r.columns.some((col) => col.length > 0)),
        };
      }
    }
  }

  // 4. Target is another item's uid: overId
  let target: { column: string[]; position: number } | null = null;
  for (const row of rows) {
    for (const column of row.columns) {
      const over = column.indexOf(overId);
      if (over >= 0) target = { column, position: over };
    }
  }
  if (target) {
    target.column.splice(target.position, 0, activeUid);
    return {
      rows: rows.filter((r) => r.columns.some((col) => col.length > 0)),
    };
  }

  // Fallback: restore activeUid to source if target not matched
  if (sourceRowId) {
    const origRow = rows.find((r) => r.id === sourceRowId);
    const origCol = origRow?.columns[sourceColIdx];
    if (origCol) origCol.push(activeUid);
  }

  return {
    rows: rows.filter((r) => r.columns.some((col) => col.length > 0)),
  };
}

export function collectionPosition(layout: CollectionLayout, uid: string) {
  for (let row = 0; row < layout.rows.length; row += 1) {
    const current = layout.rows[row];
    if (!current) continue;
    for (let column = 0; column < current.columns.length; column += 1) {
      const position = current.columns[column]?.indexOf(uid) ?? -1;
      if (position >= 0) return { row, column, position };
    }
  }
  return null;
}
