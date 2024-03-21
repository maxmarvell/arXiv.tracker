import z from "zod";

const query = {
  ti: z.string().optional(),
  cat: z.string().optional(),
  au: z.string().optional(),
  maxResults: z.string().optional(),
  startIndex: z.string().optional(),
  sortBy: z.string().optional(),
  sortOrder: z.string().optional(),
};

export const queryArXivSchema = z.object({
  query: z.object(query)
});

export type QueryArXivInput = z.infer<typeof queryArXivSchema>;