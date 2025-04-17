import * as ddb from "@aws-appsync/utils/dynamodb";

export function request(ctx) {
  return {
      operation: 'GetItem',
      key: util.dynamodb.toMapValues({ id: ctx.args.id }),
  };
}

export const response = (ctx) => ctx.result;