// export class Privilege {
//   constructor(
//     public name: string,
//     public id: string,
//     public path: string,
//     public subPrivs?: Privilege[]
//   ) {}
// }
// export type Auth = {
//   token: string;
//   privs: Privilege[];
// };
export type Auth = {
  token: string;
  is_staff: boolean;
};
