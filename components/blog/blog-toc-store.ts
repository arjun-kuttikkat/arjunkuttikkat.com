let activeId: string | null = null;
const listeners = new Set<() => void>();

export function subscribeTocActive(cb: () => void): () => void {
  listeners.add(cb);
  return () => {
    listeners.delete(cb);
  };
}

export function getTocActiveSnapshot(): string | null {
  return activeId;
}

export function getTocActiveServerSnapshot(): string | null {
  return null;
}

export function setTocActiveId(id: string | null): void {
  if (id === activeId) return;
  activeId = id;
  listeners.forEach((l) => l());
}
