import SalesType from './../tables/types/SalesType';
import ClientsType from './../tables/types/ClientsType';
import EstimationsType from './../tables/types/EstimationsType';
import QuotesType from './../tables/types/QuotesType';
import { Row, Map } from '@types';
import DatabaseManager from '@DatabaseManager';
import Utils from '@Utils';
import path from 'path';
import fs, { promises } from 'fs';
import logger from '@logger';
import { LogType, QueryOperation } from '@types';
import EstimationScheduleType from '../tables/types/EstimationScheduleType';

export default class GenerateQuotePDF {
  static async generate(salesId: number) {
    return new Promise(async (resolve, reject) => {
      logger.log(LogType.DEBUG, 'Generating PDF for salesId: ' + salesId);
      const pdf = require('html-pdf');
      let html = fs.readFileSync(path.join(__dirname, './../../assets/quote.html'), 'utf8'),
        headerImg = 'file:///';
      if (Utils.getOSType() === 'windows') {
        headerImg = 'file:///';
      }
      headerImg += path.join(__dirname, './../../assets/header.png');
      const pdfOptions = {
        header: {
          height: '75px',
          contents:
            '<div style="width:100%; height:75px;margin:10px 0px"><img width="228.75px" height="48.75px" class="logo" src="' +
            headerImg +
            '"><div style="width:100%;height:1px; border-bottom: 1px solid #e6e6e6;margin-top:5px"></div></div>'
        }
      };
      const db = DatabaseManager.getInstance();
      const sales_sql = 'SELECT * FROM SALES WHERE SALES_ID = ?';
      const client_sql = 'SELECT * FROM CLIENTS WHERE CLIENT_ID = ?';
      const estmate_sql =
        'SELECT * FROM ESTIMATIONS WHERE SALES_ID = ? ORDER BY version_number DESC LIMIT 1';
      const quote_sql =
        'SELECT * FROM quotes WHERE SALES_ID = ? ORDER BY version_number DESC LIMIT 1';
      const schedules_sql =
        'select * from estimation_schedule where estimation_id = ?';
      let sales: SalesType = {},
        client: ClientsType = {},
        estimation: EstimationsType = {},
        quote: QuotesType = {},
        schedules: EstimationScheduleType[] = [];
      let resp: Row[] = <Row[]>(
        await db.executeQuery(QueryOperation.QUERY, sales_sql, [salesId])
      );
      if (resp && resp.length > 0) {
        sales = resp[0];
        sales.projectName = (sales.projectName || '').toUpperCase();
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
        schedules = await db.executeQuery(QueryOperation.QUERY, schedules_sql, [
          estimation.id
        ]);
      }
      resp = <Row[]>(
        await db.executeQuery(QueryOperation.QUERY, quote_sql, [salesId])
      );
      if (resp && resp.length > 0) {
        quote = resp[0];
      }

      html = html.replace('{logo}', headerImg);
      html = html.replace('{{templateHere}}', sales.pdfTemplate || '');
      html = html.replace(
        '{estimation.mainSteelInclusions}',
        '<ol><#list estimation.mainSteelInclusions as i><li><p>${i}</p></li></#list></ol>'
      );
      html = html.replace(
        '{estimation.miscSteelInclusions}',
        '<ol><#list estimation.miscSteelInclusions as i><li><p>${i}</p></li></#list></ol>'
      );
      html = html.replace(
        '{estimation.mainSteelExclusions}',
        '<ol><#list estimation.mainSteelExclusions as i><li><p>${i}</p></li></#list></ol>'
      );
      html = html.replace(
        '{estimation.miscSteelExclusions}',
        '<ol><#list estimation.miscSteelExclusions as i><li><p>${i}</p></li></#list></ol>'
      );
      html = html.replace(
        '<p>{if_client.addressLine2}</p>',
        '<#if client.addressLine2??>'
      );
      html = html.replace('{if_client.zip}', '<#if client.zip??>');

      html = html.replace('<p>{if_close}</p>', '</#if>');
      html = html.replace('{if_close}', '</#if>');
      html = html.replace('{sysdate}', '${today}');

      const Freemarker = require('freemarker');
      const freemarker = new Freemarker();
      const today = Utils.toDay();
      const jobNumber =
        '3S/' +
        new Date()
          .getFullYear()
          .toString()
          .substring(2) +
        '/' +
        sales.salesId;
      const data = {
        sales: {},
        client: {},
        estimation: {
          mainSteelInclusions: [''],
          miscSteelInclusions: [''],
          mainSteelExclusions: [''],
          miscSteelExclusions: ['']
        },
        schedule: {
          mainSteelSchedule: '0',
          miscSteelSchedule: '0',
          otherSchedules: []
        },
        today,
        jobNumber,
        quote: {}
      };
      Object.keys(quote).forEach((key: string) => {
        if ((<Map>quote)[key]) {
          if (key === 'mainSteelPrice' || key === 'miscSteelPrice') {
            (<Map>data.quote)[key] = Number((<Map>quote)[key]).toLocaleString();
          } else {
            (<Map>data.quote)[key] = (<Map>quote)[key];
          }
        }
      });
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
      schedules.forEach(row => {
        if (row.scheduleName === 'Main Steel') {
          data.schedule.mainSteelSchedule = row.scheduleWeeks + '';
        } else if (row.scheduleName === 'Misc Steel') {
          data.schedule.miscSteelSchedule = row.scheduleWeeks + '';
        } else {
          (<EstimationScheduleType[]>data.schedule.otherSchedules).push(row);
        }
      });
      html = html.replace(
        '{schedulesList}',
        '<p class="ql-indent-1">X + ${schedule.mainSteelSchedule} Weeks (Main Steel for Approval)</p>' +
          '<p class="ql-indent-1">&nbsp;&nbsp;&nbsp;+ ${schedule.miscSteelSchedule} Weeks (Misc. Steel for Approval)</p>' +
          '<#list schedule.otherSchedules as schedule>' +
          '<p class="ql-indent-1">&nbsp;&nbsp;&nbsp;+ ${schedule.scheduleWeeks} Weeks (${schedule.scheduleName} for Approval)</p>' +
          '</#list>'
      );
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
