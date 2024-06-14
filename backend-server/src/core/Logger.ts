import winston from "winston";
import Elasticsearch from "winston-elasticsearch";
import expressWinston from "express-winston";
import client from "./../client/elasticsearch";
import { LooseObject } from "./../types/elasticBody";
import { Request, Response } from 'express';

expressWinston.responseWhitelist.push('body')
expressWinston.requestWhitelist.push('body')

export const Logger = expressWinston.logger({
  transports: [
    new Elasticsearch.ElasticsearchTransport({
      format: winston.format.combine(winston.format.json()),
      client: client,
      index: process.env.SERVER_REQ_LOGS_INDEX!
    })],
  format: winston.format.combine(
    winston.format.colorize(),
    winston.format.json()
  ),
  meta: true, msg: "HTTP {{req.method}} {{req.url}}",
  expressFormat: true,
  colorize: false,
  headerBlacklist: ['os', 'process', 'trace', 'authorization'],
  dynamicMeta: (req: Request, res: Response) => {
    const meta: LooseObject = {};
    return meta;
  },
  ignoreRoute: function (req, res) {
    if (req.url == '/health' || req.url.includes("/docs")) {
      return true;
    } return false;
  }
});