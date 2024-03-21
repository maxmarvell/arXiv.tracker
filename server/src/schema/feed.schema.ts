import z from "zod";

const payload = {
  name: z.string({
    required_error: "name of feed required"
  }),
  cat: z.array(z.string()).optional(),
  max_results: z.number().optional(),
  au: z.array(z.string()).optional(),
  sortBy: z.string().optional(),
  sortOrder: z.string().optional(),
};

const params = {
  feedId: z.string({
    required_error: "id of the feed is required"
  })
};

export const createFeedSchema = z.object({
  body: z.object(payload),
});

export const updateFeedSchema = z.object({
  body: z.object(payload),
  params: z.object(params)
});

export const deleteFeedSchema = z.object({
  params: z.object(params)
});

export const getFeedSchema = z.object({
  params: z.object(params)
});

export type CreateFeedInput = z.infer<typeof createFeedSchema>;
export type UpdateFeedInput = z.infer<typeof updateFeedSchema>;
export type DeleteFeedInput = z.infer<typeof deleteFeedSchema>;
export type GetFeedInput = z.infer<typeof getFeedSchema>;