import { getCombinationID, lightenUpCheck } from "../providers/api";

export const getReduceStockContent = (portfolioId?: number): Promise<any[]> => {
  return new Promise((resolve, reject) => {
    if (portfolioId) {
      lightenUpCheck(portfolioId)
        .then((res2: any) => {
          if (res2 && res2.results.length) {
            resolve(res2.results);
          } else {
            resolve([]);
          }
        })
        .catch(err1 => {
          reject(err1);
        });
    } else {
      getCombinationID()
        .then((res1: any) => {
          // console.log('getCombinationID >> ', res1);
          if (res1 && res1.results.length > 0) {
            // 获取组合 ID
            const id = res1.results[0].id;
            // 查询指定组合 ID 自动减仓计划
            lightenUpCheck(id)
              .then((res2: any) => {
                // console.log('lightenUpCheck >> ', res2);
                if (res2 && res2.results.length) {
                  resolve(res2.results);
                } else {
                  resolve([]);
                }
              })
              .catch(err1 => {
                reject(err1);
              });
          } else {
            resolve([]);
          }
        })
        .catch(err2 => {
          reject(err2);
        });
    }
  });
};
