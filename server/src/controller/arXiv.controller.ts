import { Request, Response } from "express";
import _, { pick, map, partialRight } from "lodash";
import logger from "../utils/logger"
import { QueryArXivInput } from "../schema/arXiv.schema";

const http = require('http');
var parser = require("xml-js");

export async function queryArxivHandler(
  request: Request<{}, {}, {}, QueryArXivInput["query"]>,
  response: Response
) {

  const { sortBy, sortOrder, startIndex, maxResults, ...rest } = request.query;

  var queryObj = Object.entries(rest).map(el => {
    if (el[0] === "ti") {
      return `${el[0]}:"${el[1].split("+").join(" ")}"`
    } else {
      return `${el[0]}:${el[1]}`
    }
  });

  var queryString = Array.from(Object(queryObj).values()).join(";");

  console.log(encodeURI(
    `/api/query?search_query=${queryString || ""}&start=${startIndex}&max_results=${maxResults || ""}&sortBy=${sortBy || ""}&sortOrder=${sortOrder || ""}`
  ))

  const options = {
    hostname: 'export.arxiv.org',
    path: encodeURI(
      `/api/query?search_query=${queryString || ""}&start=${startIndex}&max_results=${maxResults || ""}&sortBy=${sortBy || ""}&sortOrder=${sortOrder || ""}`
    ),
    method: 'GET'
  };

  try {
    const httpRequest = http.request(options, (result: any) => {
      let data = '';

      result.on('data', (chunk: any) => {
        data += chunk;
      });

      result.on('end', () => {
        var parsed = parser.xml2json(data, { compact: true, spaces: 4 });
        var parsed = JSON.parse(parsed);
        var { feed } = pick<{ feed: any }>(parsed, ['feed.opensearch:totalResults', 'feed.opensearch:startIndex', 'feed.opensearch:itemsPerPage', 'feed.entry'])

        return response.send({
          totalResults: feed["opensearch:totalResults"]._text,
          startIndex: feed["opensearch:startIndex"]._text,
          itemsPerPage: feed["opensearch:itemsPerPage"]._text,
          entries: feed.entry
        });
      });
    });

    return httpRequest.end();
  } catch (error: any) {
    throw new Error(error);
  };
};