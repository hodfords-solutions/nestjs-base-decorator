export type SortsParamsType =
    | undefined
    | {
          allowedFields?: string[];
          sortFields?: string;
          default?:
              | null
              | undefined
              | {
                    sortField: string;
                    sortDirection?: string;
                };
      };
