import type { BuilderItem } from "@/lib/render";
import type { Theme } from "@/lib/theme";
import type { CustomBlock } from "@/lib/custom-blocks";
import type { CollectionLayout } from "@/lib/collection-layout";

export const STORAGE_KEY = "block-studio-v3";
export const LEGACY_KEY = "ignite-snippet-builder-v1";

export type Template = {
  id: string;
  name: string;
  items: BuilderItem[];
  collectionLayout?: CollectionLayout;
};
export type SavedFragment = { id: string; name: string; html: string };

export type Persisted = {
  theme: Theme;
  items: BuilderItem[];
  collectionLayout?: CollectionLayout;
  favorites: string[];
  customBlocks: CustomBlock[];
  savedFragments: SavedFragment[];
  templates: Template[];
  panelOpen: boolean;
  trayOpen: boolean;
};
