import { Injectable } from '@angular/core';
import {
  Http,
  Headers,
  URLSearchParams,
  ResponseContentType,
  RequestOptions
} from '@angular/http';
import 'rxjs/add/operator/map';

@Injectable()
export class AuthService {
  [x: string]: any;
  private loginUrl: string;
  private salesUrl: string;
  private usersUrl: string;
  private rolesUrl: string;
  private inclusionsUrl: string;
  private exClusionsUrl: string;
  private insertUrl: string;

  constructor(private http: Http) {
    // this.loginUrl = "http://localhost:5000/loginRequest";
    // this.salesUrl = "http://localhost:5000/api/query/sales";
    // this.usersUrl = "http://localhost:5000/api/query/users";
    // this.rolesUrl = "http://localhost:5000/api/query/roles";
    // this.inclusionsUrl = "http://localhost:5000/api/query/misc_inclusions";
    // this.exClusionsUrl = "http://localhost:5000/api/query/misc_exclusions";
    // this.insertUrl = "http://localhost:5000/api/insertRequest";
    // this.fabricatorUrl = "http://localhost:5000/api/addFabricator";
    // this.getFabricatorsUrl = "http://localhost:5000/api/query/fabricator";
    // this.CountUrl = "http://localhost:5000/api/count/";
    // this.latestUrl = "http://localhost:5000/api/latest";

    this.loginUrl = 'loginRequest';
    this.salesUrl = 'http://192.168.1.7:5000/api/query/sales';
    this.usersUrl = 'api/query/users';
    this.rolesUrl = 'api/query/roles';
    this.inclusionsUrl = 'api/query/misc_inclusions';
    this.exClusionsUrl = 'api/query/misc_exclusions';
    this.insertUrl = 'api/insertRequest';
    this.fabricatorUrl = 'api/addFabricator';
    this.getFabricatorsUrl = 'api/query/fabricator';
    this.CountUrl = 'api/count/';
    this.latestUrl = 'api/latest';
  }

  login(username: string, password: any) {
    const params = new URLSearchParams();
    const statement =
      'select * from users where user_username = ? and user_password = ? ';
    params.append('statement', statement);
    params.append('username', username);
    params.append('password', password);
    return this.http.post(this.loginUrl, params).map(res => res.json());
  }

  getCount(tableName: string) {
    return this.http.get(this.CountUrl + tableName).map(res => res.json());
  }

  getLatestQuote() {
    const sales_id = sessionStorage.getItem('sales_id');

    const statement =
      'select * from quote where sales_id = ? order by quote_id DESC limit 1';

    const insertParams = {
      params: {
        statement: statement,
        sales_id: sales_id
      }
    };

    return this.http.post(this.latestUrl, insertParams).map(res => res.json());
  }

  getLatestEstimation() {
    const sales_id = sessionStorage.getItem('sales_id');

    const statement =
      'select * from estimate where sales_id = ? order by Estimate_id DESC limit 1';

    const insertParams = {
      params: {
        statement: statement,
        sales_id: sales_id
      }
    };

    return this.http.post(this.latestUrl, insertParams).map(res => res.json());
  }

  updateBidStatus(status: string, bid_number: string) {
    console.log('update', status, bid_number, this.salesUrl);
    const statement = 'update sales set status = ? where bid_number = ? ';
    // params.append('Content-Type', 'application/json');
    // params.append('statement', statement);
    const headers = { 'Content-Type': 'application/x-www-form-urlencoded' };

    const searchParams = {
      params: {
        statement: statement,
        bid_number: bid_number,
        status: status
      }
    };

    return this.http.put(this.salesUrl, searchParams);
  }

  getUserInfo() {
    if (sessionStorage.getItem('user_role_code')) {
      return sessionStorage.getItem('user_role_code');
    } else {
      return false;
    }
  }

  getSales() {
    return this.http.get(this.salesUrl).map(res => res.json());
  }

  getFabricators() {
    return this.http.get(this.getFabricatorsUrl).map(res => res.json());
  }

  getSalesDetails(bid_number) {
    return this.http
      .get(this.salesUrl + '/' + bid_number.toString())
      .map(res => res.json());
  }

  getUsers() {
    return this.http.get(this.usersUrl).map(res => res.json());
  }

  getRoles() {
    return this.http.get(this.rolesUrl).map(res => res.json());
  }

  getInclusions() {
    return this.http.get(this.inclusionsUrl).map(res => res.json());
  }

  getExclusions() {
    return this.http.get(this.exClusionsUrl).map(res => res.json());
  }

  logout() {
    sessionStorage.clear();
  }
}
