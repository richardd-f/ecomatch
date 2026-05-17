export type EcologicalCategory = "Maggot BSF" | "Compost" | "Eco Enzyme" | "Livestock Feed" | "All";

export interface FilterTag {
  id: EcologicalCategory;
  label: string;
}

export const ECOLOGICAL_FILTERS: FilterTag[] = [
  { id: "All", label: "All Ecological" },
  { id: "Maggot BSF", label: "Maggot BSF" },
  { id: "Compost", label: "Compost" },
  { id: "Eco Enzyme", label: "Eco Enzyme" },
  { id: "Livestock Feed", label: "Livestock Feed" },
];
