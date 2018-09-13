import SalesType from './../tables/types/SalesType';
import ClientsType from './../tables/types/ClientsType';
import EstimationsType from './../tables/types/EstimationsType';
import { Row, Map } from '@types';
import DatabaseManager from '@DatabaseManager';
import Utils from '@Utils';
import path from 'path';
import fs, { promises } from 'fs';
import logger from '@logger';
import { LogType, QueryOperation } from '@types';

export default class GenerateQuotePDF {
  static async generate(salesId: number) {
    return new Promise(async (resolve, reject) => {
      logger.log(LogType.DEBUG, 'Generating PDF for salesId: ' + salesId);
      const pdf = require('html-pdf');
      let html = fs.readFileSync('./src/assets/quote.html', 'utf8'),
        headerImg = 'file://';
      if (Utils.getOSType() === 'windows') {
        headerImg = 'file:///';
      }
      headerImg += path.join(__dirname, './../../assets/header.png');
      console.log(headerImg);
      const pdfOptions = {
        header: {
          height: '75px',
          contents:
            '<div style="width:100%; height:75px;padding-bottom:10px;"><img width="305px" height="65px" class="logo" src="' +
            headerImg +
            '"><div style="width:100%;border: 1px solid #e6e6e6"></div></div>'
        }
      };
      const db = DatabaseManager.getInstance();
      const sales_sql = 'SELECT * FROM SALES WHERE SALES_ID = ?';
      const client_sql = 'SELECT * FROM CLIENTS WHERE CLIENT_ID = ?';
      const estmate_sql =
        'SELECT * FROM ESTIMATIONS WHERE SALES_ID = ? ORDER BY version_number DESC LIMIT 1';
      let sales: SalesType = {},
        client: ClientsType = {},
        estimation: EstimationsType = {};
      let resp: Row[] = <Row[]>(
        await db.executeQuery(QueryOperation.QUERY, sales_sql, [salesId])
      );
      if (resp && resp.length > 0) {
        sales = resp[0];
        resp = <Row[]>(
          await db.executeQuery(QueryOperation.QUERY, client_sql, [
            sales.clientId
          ])
        );
        if (resp && resp.length > 0) {
          client = resp[0];
        }
      }
      resp = <Row[]>(
        await db.executeQuery(QueryOperation.QUERY, estmate_sql, [salesId])
      );
      if (resp && resp.length > 0) {
        estimation = resp[0];
      }

      html = html.replace('{logo}', headerImg);
      const Freemarker = require('freemarker');
      const freemarker = new Freemarker();
      const today = Utils.toDay();
      const data = {
        sales: {},
        client: {},
        estimation: {
          mainSteelInclusions: [''],
          miscSteelInclusions: [''],
          mainSteelExclusions: [''],
          miscSteelExclusions: ['']
        },
        today
      };
      Object.keys(sales).forEach((key: string) => {
        if ((<Map>sales)[key]) {
          (<Map>data.sales)[key] = (<Map>sales)[key];
        }
      });
      Object.keys(client).forEach((key: string) => {
        if ((<Map>client)[key]) {
          (<Map>data.client)[key] = (<Map>client)[key];
        }
      });
      Object.keys(estimation).forEach((key: string) => {
        if ((<Map>estimation)[key]) {
          (<Map>data.estimation)[key] = (<Map>estimation)[key];
        }
      });
      data.estimation.mainSteelInclusions = (<string>(
        estimation.mainSteelInclusions
      )).split('$');
      data.estimation.miscSteelInclusions = (<string>(
        estimation.miscSteelInclusions
      )).split('$');
      data.estimation.mainSteelExclusions = (<string>(
        estimation.mainSteelExclusions
      )).split('$');
      data.estimation.miscSteelExclusions = (<string>(
        estimation.miscSteelExclusions
      )).split('$');
      freemarker.render(html, data, (err: any, result: any) => {
        if (err) {
          logger.log(
            LogType.ERROR,
            'Generating PDF for sales ' +
              salesId +
              ' has error in freemarker ' +
              err
          );
          resolve();
        } else {
          pdf
            .create(result, pdfOptions)
            .toBuffer(async function(err: any, buffer: any) {
              if (err) {
                logger.log(LogType.ERROR, 'Error in PDF generation', err);
              } else {
                const updateSQL =
                  'UPDATE SALES SET PDF = ?, is_Pdf_Generated = ? WHERE SALES_ID = ?';
                await db.executeQuery(QueryOperation.UPDATE, updateSQL, [
                  buffer,
                  'Y',
                  salesId
                ]);
                logger.log(
                  LogType.DEBUG,
                  'Quote PDF generated successfully for sales #' + salesId
                );
              }
              resolve();
            });
        }
      });
    });
  }
}
