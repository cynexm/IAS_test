import { stringify } from "query-string";
import {
  CREATE,
  DELETE,
  DELETE_MANY,
  fetchUtils,
  GET_LIST,
  GET_MANY,
  GET_MANY_REFERENCE,
  GET_ONE,
  UPDATE,
  UPDATE_MANY
} from "react-admin";
import storage, { Storage } from "../core/Storage";

/**
 * Maps react-admin queries to the default format of Django REST Framework
 */
const drfProvider = (
  apiUrl,
  httpClient = fetchUtils.fetchJson as typeof fetch
) => {

  let resourceFlag = ''

  /**
   * @param {string} type React-admin request type, e.g. 'GET_LIST'
   * @param {string} resource Name of the resource to fetch, e.g. 'posts'
   * @param {Object} params Request parameters. Depends on the request type
   * @returns {Object} { url, options } The HTTP request parameters
   */
  const convertDataRequestToHttp = (
    type,
    resource: string,
    params = {
      pagination: { offset: 0, limit: 200, page: 1, perPage: 10 },
      sort: { field: "id", order: "DESC" },
      filter: {},
      action: null,
      data: null,
      id: null,
      target: ""
    }
  ) => {
    resourceFlag = resource
    if (resource === "order") {
      const _ =
        params.filter &&
        storage.get(Storage.Keys.AuthPriv) === "apm" 
        // && (params.filter["status"] = 1);
    }
    if (resource === "tm") {
      const _ = params.filter && (params.filter["status"] = 0);
      resource = "order";
    }

    let url = "";
    let action = params.action;
    let options: RequestInit = {};
    switch (type) {
      case CREATE:
        url = `${apiUrl}/${resource}/`;
        options.method = "POST";
        options.body = JSON.stringify(params.data);
        break;
      case GET_ONE:
        url = `${apiUrl}/${resource}/${params.id}/`;
        break;
      case GET_LIST: {
        let { offset, limit, page, perPage } = params.pagination;
        if (!limit) {
          limit = perPage;
          offset = (page - 1) * perPage;
        }
        const { field, order } = params.sort;
        const { filter } = params;
        const query = {
          offset,
          limit,
          ordering: `${order === "ASC" ? "" : "-"}${field}`,
          ...filter
        };
        url = `${apiUrl}/${resource}/?${stringify(query)}`;
        break;
      }
      case GET_MANY_REFERENCE: {
        const { offset, limit } = params.pagination;
        const { field, order } = params.sort;
        const { filter, target, id } = params;
        const query = {
          offset,
          limit,
          ordering: `${order === "ASC" ? "" : "-"}${field}`,
          ...filter,
          [target]: id
        };
        url = `${apiUrl}/${resource}/?${stringify(query)}`;
        break;
      }
      case UPDATE:
        url = `${apiUrl}/${resource}/${params.id}/`;
        options.method = "PUT";
        options.body = JSON.stringify(params.data);
        break;
      case DELETE:
        url = `${apiUrl}/${resource}/${params.id}/`;
        options.method = "DELETE";
        break;
      default:
        throw new Error(`Unsupported Data Provider request type ${type}`);
    }
    if (action) {
      url += `${action}/`;
    }
    return { url, options };
  };

  /**
   * @param {Object} response HTTP response from fetch()
   * @param {string} type React-admin request type, e.g. 'GET_LIST'
   * @param {string} resource Name of the resource to fetch, e.g. 'posts'
   * @param {Object} params Request parameters. Depends on the request type
   * @returns {Object} Data response
   */
  const convertHttpResponse = (response, type, resource, params) => {
    const { headers, json } = response;
    switch (type) {
      case GET_LIST:
      case GET_MANY_REFERENCE:
        if ("count" in json) {
          return { data: json.results, total: json.count };
        } else if (headers.has("content-range")) {
          return {
            data: json,
            total: parseInt(
              headers
                .get("content-range")
                .split("/")
                .pop(),
              10
            )
          };
        } else if ("detail" in json && json.detail === "Invalid offset.") {
          return { data: [], total: 0 };
        } else {
          throw new Error(
            "The total number of results is unknown. The DRF data provider " +
              "expects responses for lists of resources to contain this " +
              "information to build the pagination. If you're not using the " +
              "default PageNumberPagination class, please include this " +
              // tslint:disable-next-line: prettier
              // tslint:disable-next-line: quotemark
              'information using the Content-Range header OR a "count" key ' +
              "inside the response."
          );
        }
      case CREATE:
        return { data: { ...params.data, id: json.id } };
      case DELETE:
        return { data: params.previousData };
      default:
        return { data: json };
    }
  };

  /**
   * @param {string} type React-admin request type, e.g. 'GET_LIST'
   * @param {string} resource Name of the resource to fetch, e.g. 'posts'
   * @param {Object} params Request parameters. Depends on the request type
   * @returns {Promise} the Promise for a data response
   */
  return (type, resource, params) => {
    /**
     * Split GET_MANY, UPDATE_MANY and DELETE_MANY requests into multiple promises,
     * since they're not supported by default.
     */
    switch (type) {
      case GET_MANY:
        return Promise.all(
          params.ids.map(id =>
            httpClient(
              `${apiUrl}/${resource}/${id}${params.noTail ? "" : "/"}`,
              {
                method: "GET"
              }
            )
          )
        )
          .then(responses => ({
            data: responses.map(response => (response as any).json)
          }))
          .then(res => {
            return res;
          });
      case UPDATE_MANY:
        return Promise.all(
          params.ids.map(id =>
            httpClient(`${apiUrl}/${resource}/${id}`, {
              method: "PUT",
              body: JSON.stringify(params.data)
            })
          )
        ).then(responses => ({
          data: responses.map(response => (response as any).json)
        }));
      case DELETE_MANY:
        return Promise.all(
          params.ids.map(id =>
            httpClient(`${apiUrl}/${resource}/${id}`, {
              method: "DELETE"
            })
          )
        ).then(responses => ({
          data: responses.map(response => (response as any).json)
        }));
      default:
        break;
    }

    const convertObject = array => {
      const result = {};
      for (const item of array) {
        result[item[0]] = item[1];
      }
      return result;
    };

    const { url, options } = convertDataRequestToHttp(type, resource, params);

    return httpClient(url, options)
      .then(response => convertHttpResponse(response, type, resource, params))
      .then(res => {
        if (type === GET_ONE && resource === "portfolio") {
          return Promise.all(
            ["mtd", "qtd", "ytd"].map(period =>
              httpClient(`${url}performance?period=${period}`, {
                method: "GET"
              })
                .then(p => p.json)
                .catch(err => ({}))
                .then(perform => [period, perform])
            )
          ).then(performance => ({
            data: {
              ...res.data,
              // performance: Object.fromEntries(performance)
              performance: convertObject(performance)
            }
          }));
        }

        /*
        // 需求变更，暂时注释（一期）
        if (resourceFlag === 'order') {
          console.log('order: ', res.data)
          res.data.forEach(v => {
            // if (v.trx_purpose === 'reduce') {
            //   v.reduce_stock_status = 2
            // } else {
            //   v.reduce_stock_status = 3
            // }
          })
        }
        */


        /*
        // 组合管理列表接口返回数据（二期）
        if (resourceFlag === 'portfolio') {
          console.log('组合管理列表')
          res.data.forEach(v => {
            console.log('v: ', v)
          })
        }
        */

        return res;
      });
  };
};

export default drfProvider;
