import { useEffect, useState } from "react";

type ContentMap = Record<string, string>;

export function useCmsContent(page: string) {
  const [content, setContent] = useState<ContentMap>({});
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    fetch(`/api/content?page=${page}`)
      .then((r) => r.json())
      .then((data) => {
        setContent(data.map || {});
        setLoaded(true);
      })
      .catch(() => setLoaded(true));
  }, [page]);

  const text = (key: string, fallback: string = "") => content[key] ?? fallback;

  const json = <T>(key: string, fallback: T): T => {
    const val = content[key];
    if (!val) return fallback;
    try {
      return JSON.parse(val) as T;
    } catch {
      return fallback;
    }
  };

  return { content, loaded, text, json };
}

export function useMultiPageContent(pages: string[]) {
  const [content, setContent] = useState<ContentMap>({});
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    Promise.all(
      pages.map((p) =>
        fetch(`/api/content?page=${p}`)
          .then((r) => r.json())
          .then((data) => data.map || {}),
      ),
    )
      .then((results) => {
        const merged: ContentMap = {};
        for (const r of results) Object.assign(merged, r);
        setContent(merged);
        setLoaded(true);
      })
      .catch(() => setLoaded(true));
  }, [pages.join(",")]);

  const text = (key: string, fallback: string = "") => content[key] ?? fallback;

  const json = <T>(key: string, fallback: T): T => {
    const val = content[key];
    if (!val) return fallback;
    try {
      return JSON.parse(val) as T;
    } catch {
      return fallback;
    }
  };

  return { content, loaded, text, json };
}
