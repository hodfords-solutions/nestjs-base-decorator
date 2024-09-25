export type SortParamsType =
    | undefined
    | {
          allowedFields?: string[];
          sortField?: string;
          sortDirection?: string;
          default?:
              | null
              | undefined
              | {
                    sortField: string;
                    sortDirection?: string;
                };
      };
